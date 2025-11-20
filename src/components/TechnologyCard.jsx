import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange, isSelected }) {
    const handleClick = () => {
        const nextStatus = getNextStatus(status);
        onStatusChange(id, nextStatus);
    };

    return (
        <div 
            id={`tech-${id}`}
            className={`technology-card ${status} ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
        >
            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                    <span className={`status-badge ${status}`}>
                        {getStatusIcon(status)} {getStatusText(status)}
                    </span>
                </div>
                <p className="card-description">{description}</p>
                <div className="card-progress">
                    <span className="progress-text">
                        {getProgressText(status)} (кликни чтобы изменить)
                    </span>
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

function getNextStatus(currentStatus) {
    switch(currentStatus) {
        case 'not-started': return 'in-progress';
        case 'in-progress': return 'completed';
        case 'completed': return 'not-started';
        default: return 'not-started';
    }
}

export default TechnologyCard;