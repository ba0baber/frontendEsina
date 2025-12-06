
import React, { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './StatisticsPage.css';

function StatisticsPage() {
    const { technologies } = useTechnologies();
    

    const statusData = [
        { name: 'Не начато', value: technologies.filter(t => t.status === 'not-started').length, color: '#ff6b6b' },
        { name: 'В процессе', value: technologies.filter(t => t.status === 'in-progress').length, color: '#ffa726' },
        { name: 'Завершено', value: technologies.filter(t => t.status === 'completed').length, color: '#4CAF50' }
    ];
    

    const categoryData = technologies.reduce((acc, tech) => {
        const category = tech.category || 'Общее';
        if (!acc[category]) {
            acc[category] = { completed: 0, inProgress: 0, notStarted: 0 };
        }
        acc[category][tech.status === 'completed' ? 'completed' : 
                      tech.status === 'in-progress' ? 'inProgress' : 'notStarted']++;
        return acc;
    }, {});

    const chartData = Object.keys(categoryData).map(category => ({
        name: category,
        Завершено: categoryData[category].completed,
        'В процессе': categoryData[category].inProgress,
        'Не начато': categoryData[category].notStarted
    }));

    const calculateProgressRate = () => {
        const completed = technologies.filter(t => t.status === 'completed').length;
        const total = technologies.length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };
    
    const getAverageCompletionTime = () => {

        const completedTechs = technologies.filter(t => t.status === 'completed');
        if (completedTechs.length === 0) return '—';
        return '~2 недели';
    };
    
    const getMostCommonCategory = () => {
        const categories = technologies.map(t => t.category || 'Общее');
        const frequency = categories.reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
        
        return Object.keys(frequency).reduce((a, b) => 
            frequency[a] > frequency[b] ? a : b, 'Нет данных');
    };
    
    return (
        <div className="statistics-page">
            <div className="page-header">
                <h1>📈 Детальная статистика</h1>
                <div className="page-subtitle">
                    Анализ прогресса изучения технологий
                </div>
            </div>
            
            <div className="stats-summary">
                <div className="summary-card">
                    <div className="summary-icon">📊</div>
                    <div className="summary-content">
                        <div className="summary-value">{calculateProgressRate()}%</div>
                        <div className="summary-label">Общий прогресс</div>
                    </div>
                </div>
                
                <div className="summary-card">
                    <div className="summary-icon">🚀</div>
                    <div className="summary-content">
                        <div className="summary-value">
                            {technologies.filter(t => t.status === 'in-progress').length}
                        </div>
                        <div className="summary-label">В процессе изучения</div>
                    </div>
                </div>
                
                <div className="summary-card">
                    <div className="summary-icon">⏱️</div>
                    <div className="summary-content">
                        <div className="summary-value">{getAverageCompletionTime()}</div>
                        <div className="summary-label">Среднее время изучения</div>
                    </div>
                </div>
                
                <div className="summary-card">
                    <div className="summary-icon">🏷️</div>
                    <div className="summary-content">
                        <div className="summary-value">{getMostCommonCategory()}</div>
                        <div className="summary-label">Самая популярная категория</div>
                    </div>
                </div>
            </div>
            
            <div className="visualization-section">
                <h2>📊 Визуализация данных</h2>
                
                <div className="charts-grid">
                    <div className="chart-container">
                        <h3>Распределение по статусам</h3>
                        <div className="pie-chart">
                            {statusData.map((item, index) => (
                                <div key={index} className="pie-segment" 
                                     style={{
                                         backgroundColor: item.color,
                                         width: `${(item.value / technologies.length) * 100}%`
                                     }}>
                                    <div className="segment-label">
                                        <span className="segment-name">{item.name}</span>
                                        <span className="segment-value">{item.value} ({Math.round((item.value / technologies.length) * 100)}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="chart-legend">
                            {statusData.map((item, index) => (
                                <div key={index} className="legend-item">
                                    <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                                    <span>{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="chart-container">
                        <h3>Прогресс по категориям</h3>
                        <div className="bar-chart">
                            {chartData.map((item, index) => (
                                <div key={index} className="bar-group">
                                    <div className="bar-label">{item.name}</div>
                                    <div className="bars-container">
                                        <div className="bar completed" 
                                             style={{ width: `${(item.Завершено / technologies.length) * 100}%` }}
                                             title={`Завершено: ${item.Завершено}`}>
                                        </div>
                                        <div className="bar in-progress" 
                                             style={{ width: `${(item['В процессе'] / technologies.length) * 100}%` }}
                                             title={`В процессе: ${item['В процессе']}`}>
                                        </div>
                                        <div className="bar not-started" 
                                             style={{ width: `${(item['Не начато'] / technologies.length) * 100}%` }}
                                             title={`Не начато: ${item['Не начато']}`}>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="detailed-stats">
                <h2>📋 Подробная статистика</h2>
                <div className="stats-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Технология</th>
                                <th>Статус</th>
                                <th>Категория</th>
                                <th>Дней в изучении</th>
                                <th>Прогресс</th>
                            </tr>
                        </thead>
                        <tbody>
                            {technologies.map(tech => {
                                const statusInfo = {
                                    'completed': { text: 'Завершено', emoji: '✅', color: '#4CAF50' },
                                    'in-progress': { text: 'В процессе', emoji: '⏳', color: '#ffa726' },
                                    'not-started': { text: 'Не начато', emoji: '⏰', color: '#ff6b6b' }
                                };
                                const info = statusInfo[tech.status];
                                
                                return (
                                    <tr key={tech.id}>
                                        <td>{tech.title}</td>
                                        <td>
                                            <span className="status-indicator" style={{ color: info.color }}>
                                                {info.emoji} {info.text}
                                            </span>
                                        </td>
                                        <td>{tech.category || 'Общее'}</td>
                                        <td>
                                            {tech.createdAt 
                                                ? Math.floor((new Date() - new Date(tech.createdAt)) / (1000 * 60 * 60 * 24))
                                                : '—'}
                                        </td>
                                        <td>
                                            <div className="progress-cell">
                                                <div className="progress-bar-small">
                                                    <div className="progress-fill" style={{
                                                        width: tech.status === 'completed' ? '100%' : 
                                                               tech.status === 'in-progress' ? '50%' : '0%',
                                                        backgroundColor: info.color
                                                    }}></div>
                                                </div>
                                                <span>{tech.status === 'completed' ? '100%' : 
                                                       tech.status === 'in-progress' ? '50%' : '0%'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="insights-section">
                <h2>💡 Аналитика и рекомендации</h2>
                <div className="insights-grid">
                    <div className="insight-card">
                        <h3>📅 Что изучать дальше?</h3>
                        <p>
                            {technologies.filter(t => t.status === 'not-started').length > 0 
                                ? `У вас ${technologies.filter(t => t.status === 'not-started').length} технологий еще не начаты. Рекомендуем начать с самой важной для вашего стека.`
                                : 'Все технологии уже начаты или завершены! Отличная работа!'}
                        </p>
                    </div>
                    
                    <div className="insight-card">
                        <h3>🎯 Цели на неделю</h3>
                        <p>
                            {technologies.filter(t => t.status === 'in-progress').length > 0
                                ? `Попробуйте завершить ${Math.min(2, technologies.filter(t => t.status === 'in-progress').length)} технологии из тех, что уже в процессе.`
                                : 'Начните изучение новых технологий!'}
                        </p>
                    </div>
                    
                    <div className="insight-card">
                        <h3>📝 Качество изучения</h3>
                        <p>
                            {technologies.filter(t => t.notes && t.notes.length > 0).length === technologies.length
                                ? 'Отлично! У всех технологий есть заметки.'
                                : `Добавьте заметки к ${technologies.length - technologies.filter(t => t.notes && t.notes.length > 0).length} технологиям для лучшего запоминания.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatisticsPage;