import React from 'react';
import { useState, useRef } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './RoadmapImporter.css';

function RoadmapImporter() {
    const { addTechnology } = useTechnologies();
    const [importing, setImporting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Mock данные для демонстрации поиска
    const mockTechnologies = [
        {
            id: 1001,
            title: 'React Hooks',
            description: 'Хуки позволяют использовать состояние и другие возможности React без написания классов',
            category: 'frontend',
            difficulty: 'intermediate'
        },
        {
            id: 1002,
            title: 'Node.js Express',
            description: 'Минималистичный и гибкий фреймворк для веб-приложений Node.js',
            category: 'backend',
            difficulty: 'intermediate'
        },
        {
            id: 1003,
            title: 'TypeScript Generics',
            description: 'Обобщенные типы для создания переиспользуемых компонентов',
            category: 'language',
            difficulty: 'advanced'
        },
        {
            id: 1004,
            title: 'Docker Containers',
            description: 'Технология контейнеризации для развертывания приложений',
            category: 'devops',
            difficulty: 'intermediate'
        }
    ];

    const searchTechnologies = async (query) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);

            if (!query.trim()) {
                setSearchResults([]);
                return;
            }

            
            await new Promise(resolve => setTimeout(resolve, 800));
            const filtered = mockTechnologies.filter(tech =>
                tech.title.toLowerCase().includes(query.toLowerCase()) ||
                tech.description.toLowerCase().includes(query.toLowerCase())
            );

            setSearchResults(filtered);

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Ошибка поиска:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchTechnologies(value);
        }, 500);
    };

    const handleImportTech = async (tech) => {
        try {
            setImporting(true);
            
            const techData = {
                ...tech,
                id: Date.now(), 
                status: 'not-started',
                notes: ''
            };

            await addTechnology(techData);
            alert(`Технология "${tech.title}" успешно добавлена!`);

        } catch (err) {
            alert('Ошибка при импорте: ' + err.message);
        } finally {
            setImporting(false);
        }
    };

    const handleQuickImport = async () => {
        try {
            setImporting(true);
            
            const popularTechs = [
                {
                    id: Date.now() + 1,
                    title: 'React Router',
                    description: 'Стандартная библиотека для маршрутизации в React приложениях',
                    category: 'frontend',
                    status: 'not-started',
                    notes: ''
                },
                {
                    id: Date.now() + 2,
                    title: 'REST API',
                    description: 'Архитектурный стиль для создания веб-сервисов',
                    category: 'backend',
                    status: 'not-started',
                    notes: ''
                },
                {
                    id: Date.now() + 3,
                    title: 'MongoDB',
                    description: 'Документоориентированная система управления базами данных',
                    category: 'database',
                    status: 'not-started',
                    notes: ''
                }
            ];

            for (const tech of popularTechs) {
                await addTechnology(tech);
            }

            alert(`Успешно импортировано ${popularTechs.length} популярных технологий!`);

        } catch (err) {
            alert('Ошибка при импорте: ' + err.message);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="roadmap-importer">
            <h3>🔍 Поиск и импорт технологий</h3>

            <div className="import-actions">
                <button
                    onClick={handleQuickImport}
                    disabled={importing}
                    className="btn btn-primary quick-import-btn"
                >
                    {importing ? 'Импорт...' : '🚀 Быстрый импорт популярных технологий'}
                </button>
            </div>

            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск технологий для импорта..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {loading && <div className="search-spinner">⏳</div>}
                </div>

                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h4>Найдено технологий: {searchResults.length}</h4>
                        <div className="results-grid">
                            {searchResults.map(tech => (
                                <div key={tech.id} className="tech-result-card">
                                    <div className="tech-info">
                                        <h5>{tech.title}</h5>
                                        <p>{tech.description}</p>
                                        <div className="tech-meta">
                                            <span className="category-badge">{tech.category}</span>
                                            <span className="difficulty-badge">{tech.difficulty}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleImportTech(tech)}
                                        disabled={importing}
                                        className="btn btn-success import-btn"
                                    >
                                        📥 Импорт
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {searchTerm && !loading && searchResults.length === 0 && (
                    <div className="no-results">
                        <p>Технологии не найдены. Попробуйте изменить запрос.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoadmapImporter;