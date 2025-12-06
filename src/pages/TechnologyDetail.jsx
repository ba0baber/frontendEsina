import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const { technologies, updateStatus, updateNotes } = useTechnologies();
    
    const [technology, setTechnology] = useState(null);
    const [editedNotes, setEditedNotes] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        const tech = technologies.find(t => t.id === parseInt(techId));
        if (tech) {
            setTechnology(tech);
            setEditedNotes(tech.notes || '');
        }
    }, [techId, technologies]);
    
    const handleStatusChange = (newStatus) => {
        if (technology) {
            updateStatus(technology.id, newStatus);
            setTechnology({ ...technology, status: newStatus });
        }
    };
    
    const handleSaveNotes = () => {
        if (technology) {
            updateNotes(technology.id, editedNotes);
            setIsEditing(false);
        }
    };
    
    const handleDelete = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
            alert('Функция удаления в разработке');
        }
    };
    
    if (!technology) {
        return (
            <div className="technology-detail-page">
                <div className="not-found">
                    <h1>Технология не найдена</h1>
                    <p>Технология с ID {techId} не существует.</p>
                    <Link to="/technologies" className="btn-primary">
                        ← Назад к списку
                    </Link>
                </div>
            </div>
        );
    }
    
    const getStatusInfo = (status) => {
        switch(status) {
            case 'completed':
                return { text: 'Завершено', icon: '✅', color: '#4CAF50', bg: '#e8f5e9' };
            case 'in-progress':
                return { text: 'В процессе', icon: '⏳', color: '#ffa726', bg: '#fff3e0' };
            case 'not-started':
                return { text: 'Не начато', icon: '⏰', color: '#ff6b6b', bg: '#ffebee' };
            default:
                return { text: status, icon: '', color: '#7f8c8d', bg: '#f0f2f5' };
        }
    };
    
    const statusInfo = getStatusInfo(technology.status);
    
    return (
        <div className="technology-detail-page">
            <div className="detail-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <h1>{technology.title}</h1>
            </div>
            
            <div className="detail-grid">
                <div className="main-content">
                    <div className="detail-card">
                        <div className="card-header">
                            <h2>Описание</h2>
                            <span 
                                className="status-badge" 
                                style={{ 
                                    backgroundColor: statusInfo.bg, 
                                    color: statusInfo.color 
                                }}
                            >
                                {statusInfo.icon} {statusInfo.text}
                            </span>
                        </div>
                        <div className="description">
                            {technology.description}
                        </div>
                        
                        {technology.category && (
                            <div className="meta-info">
                                <span className="meta-label">Категория:</span>
                                <span className="meta-value">{technology.category}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="detail-card">
                        <h2>Статус изучения</h2>
                        <div className="status-buttons">
                            <button
                                onClick={() => handleStatusChange('not-started')}
                                className={`status-btn not-started ${technology.status === 'not-started' ? 'active' : ''}`}
                            >
                                ⏰ Не начато
                            </button>
                            <button
                                onClick={() => handleStatusChange('in-progress')}
                                className={`status-btn in-progress ${technology.status === 'in-progress' ? 'active' : ''}`}
                            >
                                ⏳ В процессе
                            </button>
                            <button
                                onClick={() => handleStatusChange('completed')}
                                className={`status-btn completed ${technology.status === 'completed' ? 'active' : ''}`}
                            >
                                ✅ Завершено
                            </button>
                        </div>
                        <div className="status-help">
                            Кликните на кнопку, чтобы изменить статус изучения
                        </div>
                    </div>
                </div>
                
                <div className="sidebar">
                    <div className="detail-card">
                        <div className="notes-header">
                            <h2>Мои заметки</h2>
                            {isEditing ? (
                                <div className="notes-actions">
                                    <button onClick={handleSaveNotes} className="btn-small btn-primary">
                                        Сохранить
                                    </button>
                                    <button onClick={() => { setIsEditing(false); setEditedNotes(technology.notes || ''); }} className="btn-small btn-secondary">
                                        Отмена
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="btn-small btn-primary">
                                    Редактировать
                                </button>
                            )}
                        </div>
                        
                        {isEditing ? (
                            <textarea
                                value={editedNotes}
                                onChange={(e) => setEditedNotes(e.target.value)}
                                placeholder="Записывайте сюда важные моменты, ссылки, команды..."
                                rows="8"
                                className="notes-editor"
                            />
                        ) : (
                            <div className="notes-content">
                                {technology.notes ? (
                                    <p>{technology.notes}</p>
                                ) : (
                                    <p className="empty-notes">Заметок пока нет. Нажмите "Редактировать", чтобы добавить заметки.</p>
                                )}
                            </div>
                        )}
                        
                        {technology.notes && (
                            <div className="notes-stats">
                                {technology.notes.length} символов, {technology.notes.split(' ').length} слов
                            </div>
                        )}
                    </div>
                    
                    <div className="detail-card">
                        <h2>Действия</h2>
                        <div className="action-buttons">
                            <button
                                onClick={() => navigate(-1)}
                                className="btn-action"
                            >
                                ↩️ Вернуться назад
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-action"
                            >
                                🏠 На главную
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn-action danger"
                            >
                                🗑️ Удалить технологию
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;