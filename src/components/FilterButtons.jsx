import './FilterButtons.css';

function FilterButtons({ activeFilter, onFilterChange }) {
    const filters = [
        { key: 'all', label: 'Все технологии', emoji: '📚' },
        { key: 'not-started', label: 'Не начатые', emoji: '⏰' },
        { key: 'in-progress', label: 'В процессе', emoji: '⏳' },
        { key: 'completed', label: 'Выполненные', emoji: '✅' }
    ];

    return (
        <div className="filter-buttons">
            <h3>Фильтр по статусу</h3>
            <div className="filter-options">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                        onClick={() => onFilterChange(filter.key)}
                    >
                        <span className="filter-emoji">{filter.emoji}</span>
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterButtons;