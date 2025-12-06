
import React, { useState, useEffect } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './SettingsPage.css';

function SettingsPage() {
    const { technologies, setTechnologies, resetAll, markAllCompleted } = useTechnologies();
    
    const [settings, setSettings] = useState({
        theme: 'light',
        notifications: true,
        autoSave: true,
        language: 'ru',
        exportFormat: 'json',
        animationSpeed: 'normal',
        fontSize: 'medium'
    });
    
    const [backupData, setBackupData] = useState('');
    const [importStatus, setImportStatus] = useState('');
    
    
    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }, [settings]);
    
    const handleExport = (format) => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies,
            settings,
            version: '1.0.0'
        };
        
        let content, mimeType, extension;
        
        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
        } else if (format === 'csv') {
            const headers = ['ID', 'Название', 'Описание', 'Статус', 'Категория', 'Заметки', 'Создано'];
            const rows = technologies.map(tech => [
                tech.id,
                `"${tech.title}"`,
                `"${tech.description}"`,
                tech.status,
                tech.category || '',
                `"${tech.notes || ''}"`,
                tech.createdAt || new Date().toISOString()
            ].join(','));
            content = [headers.join(','), ...rows].join('\n');
            mimeType = 'text/csv';
            extension = 'csv';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setImportStatus('✅ Данные успешно экспортированы!');
        setTimeout(() => setImportStatus(''), 3000);
    };
    
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.technologies && Array.isArray(data.technologies)) {
                    // Сохраняем текущие данные как backup
                    setBackupData(JSON.stringify({
                        technologies,
                        settings,
                        backedUpAt: new Date().toISOString()
                    }, null, 2));
                    
                    setTechnologies(data.technologies);
                    if (data.settings) {
                        setSettings(data.settings);
                    }
                    
                    setImportStatus('✅ Данные успешно импортированы!');
                    setTimeout(() => setImportStatus(''), 3000);
                } else {
                    setImportStatus('❌ Неверный формат файла');
                }
            } catch (err) {
                setImportStatus('❌ Ошибка при чтении файла: ' + err.message);
            }
        };
        reader.readAsText(file);
    };
    
    const handleRestoreBackup = () => {
        if (backupData) {
            try {
                const data = JSON.parse(backupData);
                setTechnologies(data.technologies);
                setSettings(data.settings || settings);
                setImportStatus('✅ Резервная копия восстановлена!');
                setTimeout(() => setImportStatus(''), 3000);
            } catch (err) {
                setImportStatus('❌ Ошибка при восстановлении');
            }
        }
    };
    
    const handleReset = () => {
        if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            resetAll();
            setImportStatus('✅ Все данные сброшены');
            setTimeout(() => setImportStatus(''), 3000);
        }
    };
    
    const handleCompleteAll = () => {
        if (window.confirm('Отметить все технологии как завершенные?')) {
            markAllCompleted();
            setImportStatus('✅ Все технологии отмечены как завершенные');
            setTimeout(() => setImportStatus(''), 3000);
        }
    };
    
    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };
    
    const calculateDataSize = () => {
        const size = JSON.stringify(technologies).length;
        if (size < 1024) return `${size} Б`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`;
        return `${(size / (1024 * 1024)).toFixed(2)} МБ`;
    };
    
    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>⚙️ Настройки приложения</h1>
                <div className="page-subtitle">
                    Управление параметрами и данными трекера
                </div>
            </div>
            
            {importStatus && (
                <div className={`status-message ${importStatus.includes('✅') ? 'success' : 'error'}`}>
                    {importStatus}
                </div>
            )}
            
            <div className="settings-grid">
                <div className="settings-section">
                    <h2>🎨 Внешний вид</h2>
                    
                    <div className="setting-group">
                        <div className="setting-item">
                            <label>Тема оформления</label>
                            <select 
                                value={settings.theme}
                                onChange={(e) => handleSettingChange('theme', e.target.value)}
                                className="setting-input"
                            >
                                <option value="light">🌞 Светлая</option>
                                <option value="dark">🌙 Темная</option>
                                <option value="auto">🔄 Авто</option>
                            </select>
                        </div>
                        
                        <div className="setting-item">
                            <label>Скорость анимации</label>
                            <select 
                                value={settings.animationSpeed}
                                onChange={(e) => handleSettingChange('animationSpeed', e.target.value)}
                                className="setting-input"
                            >
                                <option value="slow">🐌 Медленно</option>
                                <option value="normal">⚡ Нормально</option>
                                <option value="fast">🚀 Быстро</option>
                                <option value="none">🚫 Без анимаций</option>
                            </select>
                        </div>
                        
                        <div className="setting-item">
                            <label>Размер шрифта</label>
                            <select 
                                value={settings.fontSize}
                                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                                className="setting-input"
                            >
                                <option value="small">🔤 Маленький</option>
                                <option value="medium">🔤 Средний</option>
                                <option value="large">🔤 Крупный</option>
                                <option value="xlarge">🔤 Очень крупный</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="settings-section">
                    <h2>🔔 Уведомления</h2>
                    
                    <div className="setting-group">
                        <div className="setting-item checkbox">
                            <label>
                                <input 
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                    className="setting-checkbox"
                                />
                                <span className="checkbox-label">Включить ежедневные напоминания</span>
                            </label>
                            <div className="setting-description">Напоминания о необходимости изучения технологий</div>
                        </div>
                        
                        <div className="setting-item checkbox">
                            <label>
                                <input 
                                    type="checkbox"
                                    checked={settings.autoSave}
                                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                                    className="setting-checkbox"
                                />
                                <span className="checkbox-label">Автосохранение изменений</span>
                            </label>
                            <div className="setting-description">Автоматически сохранять все изменения</div>
                        </div>
                    </div>
                </div>
                
                <div className="settings-section">
                    <h2>🌍 Язык и регион</h2>
                    
                    <div className="setting-group">
                        <div className="setting-item">
                            <label>Язык интерфейса</label>
                            <select 
                                value={settings.language}
                                onChange={(e) => handleSettingChange('language', e.target.value)}
                                className="setting-input"
                            >
                                <option value="ru">🇷🇺 Русский</option>
                                <option value="en">🇺🇸 English</option>
                                <option value="es">🇪🇸 Español</option>
                                <option value="de">🇩🇪 Deutsch</option>
                                <option value="fr">🇫🇷 Français</option>
                            </select>
                        </div>
                        
                        <div className="setting-item">
                            <label>Формат даты</label>
                            <select className="setting-input">
                                <option value="dd.mm.yyyy">ДД.ММ.ГГГГ</option>
                                <option value="yyyy-mm-dd">ГГГГ-ММ-ДД</option>
                                <option value="mm/dd/yyyy">ММ/ДД/ГГГГ</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="settings-section full-width">
                    <h2>💾 Управление данными</h2>
                    
                    <div className="data-management">
                        <div className="data-card">
                            <h3>Экспорт данных</h3>
                            <p>Сохраните свои данные в файл для резервного копирования</p>
                            <div className="export-buttons">
                                <button 
                                    onClick={() => handleExport('json')}
                                    className="btn btn-primary"
                                >
                                    📥 Экспорт JSON
                                </button>
                                <button 
                                    onClick={() => handleExport('csv')}
                                    className="btn btn-secondary"
                                >
                                    📊 Экспорт CSV
                                </button>
                            </div>
                        </div>
                        
                        <div className="data-card">
                            <h3>Импорт данных</h3>
                            <p>Загрузите данные из ранее сохраненного файла</p>
                            <div className="import-section">
                                <input 
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    className="file-input"
                                    id="import-file"
                                />
                                <label htmlFor="import-file" className="btn btn-secondary">
                                    📤 Выбрать файл
                                </label>
                                <div className="file-hint">Поддерживается только формат JSON</div>
                            </div>
                        </div>
                        
                        <div className="data-card">
                            <h3>Резервная копия</h3>
                            <p>Текущие данные сохранены для возможности восстановления</p>
                            <button 
                                onClick={handleRestoreBackup}
                                disabled={!backupData}
                                className={`btn ${backupData ? 'btn-warning' : 'btn-disabled'}`}
                            >
                                ↩️ Восстановить из резервной копии
                            </button>
                            {backupData && (
                                <div className="backup-info">
                                    <small>Резервная копия создана</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="settings-section full-width danger-zone">
                    <h2>⚠️ Опасная зона</h2>
                    <p className="danger-warning">Эти действия нельзя отменить. Будьте осторожны!</p>
                    
                    <div className="danger-actions">
                        <button 
                            onClick={handleCompleteAll}
                            className="btn btn-warning"
                        >
                            ✅ Отметить все как завершенные
                        </button>
                        
                        <button 
                            onClick={handleReset}
                            className="btn btn-danger"
                        >
                            🗑️ Сбросить все данные
                        </button>
                    </div>
                </div>
                
                <div className="settings-section full-width">
                    <h2>📊 Информация о системе</h2>
                    
                    <div className="system-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Всего технологий:</span>
                                <span className="info-value">{technologies.length}</span>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Версия приложения:</span>
                                <span className="info-value">1.0.0</span>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Размер данных:</span>
                                <span className="info-value">{calculateDataSize()}</span>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Формат экспорта:</span>
                                <span className="info-value">{settings.exportFormat.toUpperCase()}</span>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Дата создания:</span>
                                <span className="info-value">
                                    {new Date().toLocaleDateString('ru-RU')}
                                </span>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Последнее изменение:</span>
                                <span className="info-value">
                                    {new Date().toLocaleTimeString('ru-RU')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;