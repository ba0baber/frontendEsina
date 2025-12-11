
import { useState, useEffect, useCallback, useRef } from 'react';

function useApi(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const fetchData = useCallback(async (abortController) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(url, {
                ...options,
                signal: abortController?.signal
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка! Статус: ${response.status}`);
            }

            const result = await response.json();
            setData(result);

        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Ошибка при загрузке данных');
                console.error('API Error:', err);
            }
        } finally {
            setLoading(false);
        }
    }, [url, JSON.stringify(options)]);

    useEffect(() => {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        if (url) {
            fetchData(abortController);
        }

        return () => {
            abortController.abort();
        };
    }, [url, fetchData]);

    const refetch = useCallback(() => {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        fetchData(abortController);
        
        return () => abortController.abort();
    }, [fetchData]);

    const mutate = useCallback(async (newData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
                signal: abortControllerRef.current?.signal
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка! Статус: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
            return result;

        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Ошибка при отправке данных');
                console.error('API Mutation Error:', err);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, [url]);

    return { 
        data, 
        loading, 
        error, 
        refetch,
        mutate,
        setData
    };
}

export default useApi;