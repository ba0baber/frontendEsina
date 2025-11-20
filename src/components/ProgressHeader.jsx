import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
    const totalCount = technologies.length;
    const completedCount = technologies.filter(tech => tech.status === 'completed').length;
    const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStartedCount = technologies.filter(tech => tech.status === 'not-started').length;
    
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="progress-header">
            <div className="header-main">
                <h1> Трекер изучения технологий</h1>
                <div className="progress-overview">
                    <div className="progress-text">
                        <span className="progress-percent">{progressPercentage}%</span>
                        <span className="progress-details">
                            {completedCount} из {totalCount} технологий изучено
                        </span>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="stats-overview">
                <div className="stat-item">
                    <div className="stat-number total">{totalCount}</div>
                    <div className="stat-label">Всего</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number completed">{completedCount}</div>
                    <div className="stat-label">Изучено</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number in-progress">{inProgressCount}</div>
                    <div className="stat-label">В процессе</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number not-started">{notStartedCount}</div>
                    <div className="stat-label">Не начато</div>
                </div>
            </div>
        </div>
    );
}

export default ProgressHeader;