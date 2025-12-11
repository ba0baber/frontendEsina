
import React, { useState, useEffect } from 'react'; 
import useApi from '../hooks/useApi';
import './ApiTechnologiesLoader.css';

function ApiTechnologiesLoader({ onTechnologiesLoaded }) {
    const [apiUrl, setApiUrl] = useState('');
    const [customApiMode, setCustomApiMode] = useState(false);

    const { 
        data: apiData, 
        loading, 
        error, 
        refetch 
    } = useApi(
        customApiMode && apiUrl ? apiUrl : null
    );

    const publicApis = [
        {
            id: 1,
            name: 'GitHub Public APIs',
            url: 'https://api.github.com/search/repositories?q=react+technology&per_page=5',
            description: 'Поиск репозиториев с технологиями на GitHub'
        },
        {
            id: 2,
            name: 'Dev.to Articles',
            url: 'https://dev.to/api/articles?tag=javascript&per_page=5',
            description: 'Статьи о технологиях с Dev.to'
        },
        {
            id: 3,
            name: 'Mock Technologies API',
            url: 'https://mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8',
            description: 'Тестовый API с моковыми данными'
        }
    ];
    const transformApiData = (apiName, rawData) => {
        switch(apiName) {
            case 'GitHub Public APIs':
                if (rawData.items) {
                    return rawData.items.map(item => ({
                        id: item.id,
                        title: item.name,
                        description: item.description || 'Без описания',
                        category: 'api',
                        status: 'not-started',
                        notes: '',
                        url: item.html_url,
                        language: item.language
                    }));
                }
                break;
                
            case 'Dev.to Articles':
                if (Array.isArray(rawData)) {
                    return rawData.map(article => ({
                        id: article.id,
                        title: article.title,
                        description: article.description || 'Без описания',
                        category: 'article',
                        status: 'not-started',
                        notes: '',
                        url: article.url,
                        tags: article.tag_list
                    }));
                }
                break;
                
            case 'Mock Technologies API':
                if (Array.isArray(rawData)) {
                    return rawData.map(tech => ({
                        id: tech.id || Date.now() + Math.random(),
                        title: tech.name || 'Технология',
                        description: tech.description || 'Описание технологии',
                        category: tech.category || 'other',
                        status: 'not-started',
                        notes: '',
                        difficulty: tech.level || 'beginner'
                    }));
                }
                break;
                
            default:

                if (Array.isArray(rawData)) {
                    return rawData.map((item, index) => ({
                        id: item.id || Date.now() + index,
                        title: item.title || item.name || `Технология ${index + 1}`,
                        description: item.description || 'Описание отсутствует',
                        category: item.category || 'other',
                        status: 'not-started',
                        notes: '',
                        ...item
                    }));
                }
        }
        
        return [];
    };

    const handleApiLoad = (api) => {
        setCustomApiMode(false);
        setApiUrl(api.url);

        setTimeout(() => {
            refetch();
        }, 100);
    };
    const handleCustomApiLoad = (e) => {
        e.preventDefault();
        if (apiUrl) {
            setCustomApiMode(true);
            refetch();
        }
    };
    useEffect(() => {
        if (apiData && !loading && !error) {
            const selectedApi = publicApis.find(api => api.url === apiUrl) || { name: 'Custom API' };
            const transformedTechnologies = transformApiData(selectedApi.name, apiData);
            
            if (transformedTechnologies.length > 0) {
                onTechnologiesLoaded(transformedTechnologies);
            }
        }
    }, [apiData, loading, error, apiUrl, publicApis, onTechnologiesLoaded]);

    return (
        <div className="api-technologies-loader">
            <h3>🌐 Загрузка технологий из внешних API</h3>
            
            <div className="api-loader-content">
                {}
                <div className="public-apis-section">
                    <h4>Доступные публичные API:</h4>
                    <div className="api-buttons">
                        {publicApis.map(api => (
                            <button
                                key={api.id}
                                className="api-button"
                                onClick={() => handleApiLoad(api)}
                                disabled={loading}
                            >
                                <span className="api-name">{api.name}</span>
                                <span className="api-description">{api.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {}
                <div className="custom-api-section">
                    <h4>Или используйте свой API:</h4>
                    <form onSubmit={handleCustomApiLoad} className="custom-api-form">
                        <input
                            type="url"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            placeholder="https://api.example.com/technologies"
                            className="api-url-input"
                            required
                        />
                        <button 
                            type="submit" 
                            className="load-api-button"
                            disabled={loading || !apiUrl}
                        >
                            {loading ? 'Загрузка...' : 'Загрузить'}
                        </button>
                    </form>
                    <p className="api-hint">
                        Укажите URL API, который возвращает JSON массив технологий
                    </p>
                </div>

                {}
                <div className="api-status">
                    {loading && (
                        <div className="loading-status">
                            <div className="spinner"></div>
                            <span>Загрузка данных из API...</span>
                        </div>
                    )}
                    
                    {error && (
                        <div className="error-status">
                            <span className="error-icon">❌</span>
                            <span>Ошибка: {error}</span>
                            <button onClick={refetch} className="retry-button">
                                Повторить
                            </button>
                        </div>
                    )}
                    
                    {apiData && !loading && !error && (
                        <div className="success-status">
                            <span className="success-icon">✅</span>
                            <span>
                                Данные загрузки успешно! 
                                {Array.isArray(apiData) && ` Найдено: ${apiData.length} записей`}
                            </span>
                        </div>
                    )}
                </div>

                {}
                {apiData && !loading && (
                    <div className="api-preview">
                        <h5>Предпросмотр данных:</h5>
                        <div className="preview-content">
                            <pre>{JSON.stringify(apiData, null, 2).slice(0, 500)}...</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ApiTechnologiesLoader;