
import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import useLocalStorage from './useLocalStorage';
import useApi from './useApi';

const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение функциональных и классовых компонентов, работа с props и state',
        status: 'not-started',
        notes: '',
        category: 'frontend',
        difficulty: 'beginner',
        resources: ['https://react.dev']
    },
    {
        id: 2,
        title: 'JSX Syntax',
        description: 'Освоение синтаксиса JSX, условного рендеринга и работы со списками',
        status: 'not-started',
        notes: '',
        category: 'frontend',
        difficulty: 'beginner',
        resources: ['https://react.dev/docs/introducing-jsx']
    },
    {
        id: 3,
        title: 'State Management',
        description: 'Работа с состоянием компонентов, изучение хуков useState и useEffect',
        status: 'not-started',
        notes: '',
        category: 'frontend',
        difficulty: 'intermediate',
        resources: ['https://react.dev/reference/react']
    },
    {
        id: 4,
        title: 'React Router',
        description: 'Настройка маршрутизации в React-приложениях',
        status: 'not-started',
        notes: '',
        category: 'frontend',
        difficulty: 'intermediate',
        resources: ['https://reactrouter.com/']
    },
    {
        id: 5,
        title: 'API Integration',
        description: 'Работа с внешними API, использование fetch и axios',
        status: 'not-started',
        notes: '',
        category: 'frontend',
        difficulty: 'intermediate',
        resources: ['https://developer.mozilla.org/docs/Web/API/Fetch_API']
    }
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('techTrackerData', initialTechnologies);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    
    const searchApiUrl = 'https://mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8';
    const { data: apiSearchData, loading: apiLoading, error: apiError, refetch: refetchSearch } = useApi(searchApiUrl);

    const searchTechnologies = useCallback(async (query, signal) => {
        if (!query.trim()) {
            setSearchResults([]);
            return Promise.resolve([]);
        }

        setIsSearching(true);
        
        try {

            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (signal.aborted) {
                throw new DOMException('Aborted', 'AbortError');
            }

            const localResults = technologies.filter(tech =>
                tech.title.toLowerCase().includes(query.toLowerCase()) ||
                tech.description.toLowerCase().includes(query.toLowerCase()) ||
                tech.category.toLowerCase().includes(query.toLowerCase())
            );
            let apiResults = [];
            if (apiSearchData && Array.isArray(apiSearchData)) {
                apiResults = apiSearchData
                    .filter(item => 
                        item.name?.toLowerCase().includes(query.toLowerCase()) ||
                        item.description?.toLowerCase().includes(query.toLowerCase())
                    )
                    .map(item => ({
                        id: `api-${item.id || Date.now()}`,
                        title: item.name || 'Технология из API',
                        description: item.description || 'Описание отсутствует',
                        status: 'not-started',
                        notes: '',
                        category: item.category || 'api',
                        isFromApi: true,
                        source: 'external'
                    }));
            }

            const allResults = [...localResults, ...apiResults];
            setSearchResults(allResults);
            
            return allResults;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Search failed:', err);
            }
            throw err;
        } finally {
            setIsSearching(false);
        }
    }, [technologies, apiSearchData]);
    const loadTechnologiesFromApi = useCallback((apiTechnologies) => {
        if (!Array.isArray(apiTechnologies) || apiTechnologies.length === 0) {
            return;
        }
        const newTechnologies = apiTechnologies.filter(apiTech => 
            !technologies.some(existingTech => 
                existingTech.title.toLowerCase() === apiTech.title.toLowerCase() ||
                (apiTech.id && existingTech.id === apiTech.id)
            )
        );

        if (newTechnologies.length > 0) {
            const updatedTechnologies = [...technologies, ...newTechnologies];
            setTechnologies(updatedTechnologies);
            
            return {
                added: newTechnologies.length,
                total: updatedTechnologies.length,
                newTechnologies
            };
        }
        
        return { added: 0, total: technologies.length, newTechnologies: [] };
    }, [technologies, setTechnologies]);
    const updateStatus = (techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    };

    const updateNotes = (techId, newNotes) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    const calculateProgress = () => {
        if (technologies.length === 0) return 0;
        const completed = technologies.filter(tech => tech.status === 'completed').length;
        return Math.round((completed / technologies.length) * 100);
    };

    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'completed' }))
        );
    };

    const resetAll = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'not-started' }))
        );
    };

    const randomSelect = () => {
        const notCompletedTech = technologies.filter(tech => tech.status !== 'completed');
        
        if (notCompletedTech.length === 0) {
            alert('🎉 Все технологии уже изучены!');
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * notCompletedTech.length);
        const randomTech = notCompletedTech[randomIndex];
        
        updateStatus(randomTech.id, 'in-progress');
        return randomTech.id;
    };
    const addTechnologyFromApi = (techData) => {
        const newTech = {
            id: Date.now(),
            ...techData,
            status: 'not-started',
            notes: '',
            createdAt: new Date().toISOString()
        };
        
        setTechnologies(prev => [...prev, newTech]);
        return newTech;
    };

    return {
        technologies,
        setTechnologies,
        updateStatus,
        updateNotes,
        markAllCompleted,
        resetAll,
        randomSelect,
        progress: calculateProgress(),
        searchTechnologies,
        searchResults,
        isSearching,
        loadTechnologiesFromApi,
        addTechnologyFromApi,
        apiStatus: {
            loading: apiLoading,
            error: apiError,
            data: apiSearchData
        }
    };
}

export default useTechnologies;