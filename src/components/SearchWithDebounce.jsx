
import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import './SearchWithDebounce.css';

function SearchWithDebounce({ onSearch, initialValue = '', placeholder = "Поиск технологий...", delay = 500 }) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);
    const isMountedRef = useRef(true);
    const performSearch = useCallback((term) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setIsSearching(true);
        
        onSearch(term, abortControllerRef.current.signal)
            .catch(err => {
                if (err.name !== 'AbortError' && isMountedRef.current) {
                    console.error('Search error:', err);
                }
            })
            .finally(() => {
                if (isMountedRef.current) {
                    setIsSearching(false);
                }
            });
    }, [onSearch]);
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchTerm.trim() === '') {
            performSearch('');
            return;
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(searchTerm);
        }, delay);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, delay, performSearch]);
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleClear = () => {
        setSearchTerm('');
        performSearch('');
    };

    return (
        <div className="search-with-debounce">
            <div className="search-input-container">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    aria-label="Поиск технологий"
                    disabled={isSearching}
                />
                
                <div className="search-controls">
                    {isSearching && (
                        <div className="search-loading-indicator" aria-hidden="true">
                            <div className="search-spinner"></div>
                        </div>
                    )}
                    
                    {searchTerm && !isSearching && (
                        <button 
                            className="clear-search-button" 
                            onClick={handleClear}
                            aria-label="Очистить поиск"
                            type="button"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
            
            <div className="search-stats">
                {isSearching ? (
                    <span className="searching-text">Поиск...</span>
                ) : searchTerm ? (
                    <span className="search-term-info">
                        Поиск по: <strong>"{searchTerm}"</strong>
                    </span>
                ) : null}
            </div>
        </div>
    );
}

export default SearchWithDebounce;