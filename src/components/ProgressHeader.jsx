import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="progress-header">
            <h1>Трекер изучения технологий</h1>
            <div className="stats">
                <div className="stat">
                    <span className="number">{total}</span>
                    <span className="label">Всего</span>
                </div>
                <div className="stat">
                    <span className="number">{completed}</span>
                    <span className="label">Изучено</span>
                </div>
                <div className="stat">
                    <span className="number">{inProgress}</span>
                    <span className="label">В процессе</span>
                </div>
                <div className="stat">
                    <span className="number">{notStarted}</span>
                    <span className="label">Не начато</span>
                </div>
            </div>
            
            <div className="progress-bar-container">
                <div className="progress-info">
                    <span>Общий прогресс: {progressPercentage}%</span>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default ProgressHeader;