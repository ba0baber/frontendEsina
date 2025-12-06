
import React from 'react';
import './DetailedStatistics.css';

function DetailedStatistics({ technologies }) {
    const totalCount = technologies.length;
    const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;
    const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
    const completedCount = technologies.filter(tech => tech.status === 'completed').length;
    
    const notStartedPercentage = totalCount > 0 ? Math.round((notStartedCount / totalCount) * 100) : 0;
    const inProgressPercentage = totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0;
    const completedPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="detailed-statistics">
            <h3>📊 Детальная статистика</h3>
            
            <div className="stats-grid">
                <div className="stat-item total">
                    <div className="stat-value">{totalCount}</div>
                    <div className="stat-label">Всего технологий</div>
                </div>
                
                <div className="stat-item not-started">
                    <div className="stat-value">{notStartedCount}</div>
                    <div className="stat-label">Не начато</div>
                    <div className="stat-percentage">{notStartedPercentage}%</div>
                </div>
                
                <div className="stat-item in-progress">
                    <div className="stat-value">{inProgressCount}</div>
                    <div className="stat-label">В процессе</div>
                    <div className="stat-percentage">{inProgressPercentage}%</div>
                </div>
                
                <div className="stat-item completed">
                    <div className="stat-value">{completedCount}</div>
                    <div className="stat-label">Завершено</div>
                    <div className="stat-percentage">{completedPercentage}%</div>
                </div>
            </div>
            
            <div className="progress-summary">
                <div className="progress-header">
                    <span>Общий прогресс:</span>
                    <span className="progress-percent">{overallProgress}%</span>
                </div>
                <div className="progress-bar-detailed">
                    <div 
                        className="progress-fill not-started-fill" 
                        style={{ width: `${notStartedPercentage}%` }}
                        title={`Не начато: ${notStartedPercentage}%`}
                    ></div>
                    <div 
                        className="progress-fill in-progress-fill" 
                        style={{ width: `${inProgressPercentage}%` }}
                        title={`В процессе: ${inProgressPercentage}%`}
                    ></div>
                    <div 
                        className="progress-fill completed-fill" 
                        style={{ width: `${completedPercentage}%` }}
                        title={`Завершено: ${completedPercentage}%`}
                    ></div>
                </div>
                <div className="progress-legend">
                    <div className="legend-item">
                        <span className="legend-color not-started-color"></span>
                        <span>Не начато ({notStartedCount})</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color in-progress-color"></span>
                        <span>В процессе ({inProgressCount})</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color completed-color"></span>
                        <span>Завершено ({completedCount})</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailedStatistics;