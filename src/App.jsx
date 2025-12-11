// App.jsx
import React, { useState } from 'react';
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';
import TechnologyNotes from './components/TechnologyNotes';
import DetailedStatistics from './components/DetailedStatistics';
import useTechnologies from './hooks/useTechnologies';

// Новые компоненты из Практики 24 - опциональные
import ApiTechnologiesLoader from './components/ApiTechnologiesLoader';
import SearchWithDebounce from './components/SearchWithDebounce';

function App() {
    const { 
        technologies, 
        updateStatus, 
        updateNotes, 
        markAllCompleted, 
        resetAll, 
        randomSelect,
        progress,
        // Новые функции из обновленного useTechnologies
        searchTechnologies,
        searchResults,
        isSearching,
        loadTechnologiesFromApi
    } = useTechnologies();

    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedTechId, setSelectedTechId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Новые состояния для опциональных функций
    const [showApiLoader, setShowApiLoader] = useState(false);
    const [useDebounceSearch, setUseDebounceSearch] = useState(false);
    const [apiLoadedCount, setApiLoadedCount] = useState(0);

    const handleStatusChange = (id, newStatus) => {
        updateStatus(id, newStatus);
        setSelectedTechId(null);
    };

    const handleRandomSelect = () => {
        const selectedId = randomSelect();
        if (selectedId) {
            setSelectedTechId(selectedId);
            setTimeout(() => {
                const element = document.getElementById(`tech-${selectedId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            alert(`🎲 Выбрана технология: ${technologies.find(tech => tech.id === selectedId)?.title}\nСтатус изменен на "В процессе"`);
        }
    };

    // Обработчик загрузки технологий из API
    const handleTechnologiesLoaded = (apiTechnologies) => {
        const result = loadTechnologiesFromApi(apiTechnologies);
        if (result && result.added > 0) {
            setApiLoadedCount(prev => prev + result.added);
            alert(`✅ Загружено ${result.added} новых технологий из API!`);
            setShowApiLoader(false); // Скрыть после успешной загрузки
        } else {
            alert('ℹ️ Новых технологий для добавления не найдено');
        }
    };

    // Обработчик поиска через API с debounce
    const handleApiSearch = async (query, signal) => {
        return searchTechnologies(query, signal);
    };

    // Основная фильтрация (как было)
    const filteredTechnologies = technologies.filter(tech => {
        const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
        const searchMatch = searchQuery === '' || 
            tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && searchMatch;
    });

    return (
        <div className="App">
            <ProgressHeader technologies={technologies} />
            
            <DetailedStatistics technologies={technologies} />
            
            <QuickActions 
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAll}
                onRandomSelect={handleRandomSelect}
                technologies={technologies}
            />

            {/* ОПЦИОНАЛЬНЫЙ БЛОК: API Интеграция - Практика 24 */}
            <div className="optional-features">
                <div className="feature-toggle">
                    <h3>🔧 Дополнительные функции (Практика 24)</h3>
                    <div className="toggle-buttons">
                        <button 
                            className={`toggle-btn ${showApiLoader ? 'active' : ''}`}
                            onClick={() => setShowApiLoader(!showApiLoader)}
                        >
                            {showApiLoader ? '✕ Скрыть API загрузчик' : '🌐 Показать API загрузчик'}
                        </button>
                        <button 
                            className={`toggle-btn ${useDebounceSearch ? 'active' : ''}`}
                            onClick={() => setUseDebounceSearch(!useDebounceSearch)}
                        >
                            {useDebounceSearch ? '✕ Обычный поиск' : '🔍 Поиск с debounce'}
                        </button>
                    </div>
                </div>

                {/* API Loader (показывается по нажатию кнопки) */}
                {showApiLoader && (
                    <ApiTechnologiesLoader 
                        onTechnologiesLoaded={handleTechnologiesLoaded}
                    />
                )}

                {/* Поиск с debounce (заменяет обычный поиск если включен) */}
                {useDebounceSearch ? (
                    <div className="debounce-search-section">
                        <h4>🔍 Поиск с debounce (500ms)</h4>
                        <SearchWithDebounce 
                            onSearch={handleApiSearch}
                            placeholder="Ищите технологии локально и через API..."
                        />
                        
                        {isSearching && (
                            <div className="search-status">
                                <div className="searching-indicator"></div>
                                <span>Выполняется поиск...</span>
                            </div>
                        )}
                        
                        {searchResults.length > 0 && !isSearching && (
                            <div className="search-results-info">
                                Найдено результатов: {searchResults.length}
                                {searchResults.some(tech => tech.isFromApi) && 
                                    <span className="api-results"> (включая данные из API)</span>
                                }
                            </div>
                        )}

                        {/* Показать результаты API поиска */}
                        {searchResults.length > 0 && (
                            <div className="api-search-preview">
                                <h5>Результаты поиска:</h5>
                                <div className="preview-items">
                                    {searchResults.slice(0, 3).map(tech => (
                                        <div key={tech.id} className="preview-item">
                                            <strong>{tech.title}</strong>
                                            {tech.isFromApi && <span className="api-badge">API</span>}
                                            <button 
                                                className="add-preview-btn"
                                                onClick={() => {
                                                    handleTechnologiesLoaded([tech]);
                                                    alert(`Технология "${tech.title}" добавлена!`);
                                                }}
                                            >
                                                ➕
                                            </button>
                                        </div>
                                    ))}
                                    {searchResults.length > 3 && (
                                        <div className="more-results">
                                            ... и еще {searchResults.length - 3} результатов
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Обычный поиск (как было)
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Поиск технологий..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="search-results">Найдено: {filteredTechnologies.length}</span>
                    </div>
                )}
            </div>

            {/* Статистика загрузок из API */}
            {apiLoadedCount > 0 && (
                <div className="api-stats-banner">
                    📥 Загружено из внешних API: <strong>{apiLoadedCount}</strong> технологий
                </div>
            )}

            <FilterButtons 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            <div className="technologies-container">
                <h2>
                    Технологии для изучения 
                    <span className="filter-count"> ({filteredTechnologies.length})</span>
                </h2>
                <div className="technologies-list">
                    {filteredTechnologies.map(tech => (
                        <div key={tech.id} className="technology-item" id={`tech-${tech.id}`}>
                            <TechnologyCard
                                id={tech.id}
                                title={tech.title}
                                description={tech.description}
                                status={tech.status}
                                onStatusChange={handleStatusChange}
                                isSelected={tech.id === selectedTechId}
                            />
                            <TechnologyNotes 
                                notes={tech.notes}
                                onNotesChange={updateNotes}
                                techId={tech.id}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;