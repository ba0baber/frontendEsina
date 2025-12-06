import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyNotes from '../components/TechnologyNotes';
import useTechnologies from '../hooks/useTechnologies';

function TechnologiesPage() {
    const { technologies, updateStatus, updateNotes } = useTechnologies();
    const [filter, setFilter] = useState('all');

    const getFilteredTechnologies = () => {
        if (filter === 'all') return technologies;
        return technologies.filter(tech => tech.status === filter);
    };

    const getStatusCount = (status) => {
        return technologies.filter(tech => tech.status === status).length;
    };

    return (
        <div className="technologies-page">
            <div className="page-header">
                <h1>📚 Все технологии</h1>
                <div className="page-subtitle">
                    Управление всеми технологиями для изучения
                </div>
            </div>

            <div className="technology-stats">
                <div className="stat-card total">
                    <div className="stat-number">{technologies.length}</div>
                    <div className="stat-label">Всего технологий</div>
                </div>
                <div className="stat-card not-started">
                    <div className="stat-number">{getStatusCount('not-started')}</div>
                    <div className="stat-label">Не начато</div>
                </div>
                <div className="stat-card in-progress">
                    <div className="stat-number">{getStatusCount('in-progress')}</div>
                    <div className="stat-label">В процессе</div>
                </div>
                <div className="stat-card completed">
                    <div className="stat-number">{getStatusCount('completed')}</div>
                    <div className="stat-label">Завершено</div>
                </div>
            </div>

            <div className="filter-tabs">
                <button 
                    className={`tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Все ({technologies.length})
                </button>
                <button 
                    className={`tab ${filter === 'not-started' ? 'active' : ''}`}
                    onClick={() => setFilter('not-started')}
                >
                    Не начато ({getStatusCount('not-started')})
                </button>
                <button 
                    className={`tab ${filter === 'in-progress' ? 'active' : ''}`}
                    onClick={() => setFilter('in-progress')}
                >
                    В процессе ({getStatusCount('in-progress')})
                </button>
                <button 
                    className={`tab ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Завершено ({getStatusCount('completed')})
                </button>
            </div>

            <div className="technologies-grid">
                {getFilteredTechnologies().map(tech => (
                    <div key={tech.id} className="technology-card-wrapper">
                        <TechnologyCard
                            id={tech.id}
                            title={tech.title}
                            description={tech.description}
                            status={tech.status}
                            onStatusChange={updateStatus}
                        />
                        <TechnologyNotes 
                            notes={tech.notes}
                            onNotesChange={updateNotes}
                            techId={tech.id}
                        />
                        <Link 
                            to={`/technology/${tech.id}`}
                            className="detail-link"
                        >
                            Подробнее →
                        </Link>
                    </div>
                ))}
            </div>

            {getFilteredTechnologies().length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>Технологий не найдено</h3>
                    <p>Попробуйте изменить фильтр или добавить новые технологии</p>
                    <Link to="/" className="btn-primary">
                        Вернуться на главную
                    </Link>
                </div>
            )}
        </div>
    );
}

export default TechnologiesPage;