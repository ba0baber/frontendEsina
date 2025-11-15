import './TechnologyCard.css';

function TechnologyCard({ title, description, status }) {
    return (
        <div className={`technology-card ${status}`}>
            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                    <span className={`status-badge ${status}`}>
                        {getStatusIcon(status)} {getStatusText(status)}
                    </span>
                </div>
                <p className="card-description">{description}</p>
                <div className="card-progress">
                    <span className="progress-text">{getProgressText(status)}</span>
                </div>
            </div>
        </div>
    );
}
function getStatusIcon(status) {
    switch(status) {
        case 'completed': return '✅';
        case 'in-progress': return '⏳';
        case 'not-started': return '⏰';
        default: return '';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'completed': return 'Изучено';
        case 'in-progress': return 'В процессе';
        case 'not-started': return 'Не начато';
        default: return status;
    }
}

function getProgressText(status) {
    switch(status) {
        case 'completed': return '100% выполнено';
        case 'in-progress': return '50% в процессе';
        case 'not-started': return '0% не начато';
        default: return '';
    }
}

export default TechnologyCard;