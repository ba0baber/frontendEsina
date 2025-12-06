import React, { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, onRandomSelect, technologies }) {
    const [showExportModal, setShowExportModal] = useState(false);

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            totalTechnologies: technologies.length,
            completed: technologies.filter(tech => tech.status === 'completed').length,
            inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
            notStarted: technologies.filter(tech => tech.status === 'not-started').length,
            technologies: technologies
        };
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setShowExportModal(true);
    };

    return (
        <div className="quick-actions">
            <h3>⚡ Быстрые действия</h3>
            <div className="actions-grid">
                <button 
                    className="action-btn complete-all"
                    onClick={onMarkAllCompleted}
                    title="Отметить все технологии как завершенные"
                >
                    <div className="btn-icon">✅</div>
                    <div className="btn-text">Все выполнено</div>
                </button>
                
                <button 
                    className="action-btn reset-all"
                    onClick={onResetAll}
                    title="Сбросить все статусы на 'Не начато'"
                >
                    <div className="btn-icon">🔄</div>
                    <div className="btn-text">Сбросить все</div>
                </button>
                
                <button 
                    className="action-btn random-select"
                    onClick={onRandomSelect}
                    title="Случайно выбрать следующую технологию для изучения"
                >
                    <div className="btn-icon">🎲</div>
                    <div className="btn-text">Случайный выбор</div>
                </button>

                <button 
                    className="action-btn export-data"
                    onClick={handleExport}
                    title="Экспортировать данные в JSON файл"
                >
                    <div className="btn-icon">📤</div>
                    <div className="btn-text">Экспорт данных</div>
                </button>
            </div>

            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
            >
                <div className="export-success">
                    <div className="success-icon">✅</div>
                    <h3>Данные успешно экспортированы!</h3>
                    <p>Файл с вашими данными был скачан автоматически.</p>
                    <div className="export-stats">
                        <p><strong>Всего технологий:</strong> {technologies.length}</p>
                        <p><strong>Завершено:</strong> {technologies.filter(tech => tech.status === 'completed').length}</p>
                        <p><strong>В процессе:</strong> {technologies.filter(tech => tech.status === 'in-progress').length}</p>
                        <p><strong>Не начато:</strong> {technologies.filter(tech => tech.status === 'not-started').length}</p>
                    </div>
                    <button 
                        className="close-modal-btn"
                        onClick={() => setShowExportModal(false)}
                    >
                        Закрыть
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default QuickActions;