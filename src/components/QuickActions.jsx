import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, onRandomSelect }) {
    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button 
                    className="action-btn complete-all"
                    onClick={onMarkAllCompleted}
                >
                    ✅ Отметить все как выполненные
                </button>
                <button 
                    className="action-btn reset-all"
                    onClick={onResetAll}
                >
                    🔄 Сбросить все статусы
                </button>
                <button 
                    className="action-btn random-select"
                    onClick={onRandomSelect}
                >
                    🎲 Начать случайную технологию
                </button>
            </div>
        </div>
    );
}

export default QuickActions;