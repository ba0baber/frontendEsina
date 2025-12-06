
import React, { useState } from 'react';
import ProgressHeader from '../components/ProgressHeader';
import QuickActions from '../components/QuickActions';
import DetailedStatistics from '../components/DetailedStatistics';
import FilterButtons from '../components/FilterButtons';
import TechnologyCard from '../components/TechnologyCard';
import TechnologyNotes from '../components/TechnologyNotes';
import useTechnologies from '../hooks/useTechnologies';

function Home() {
    const { 
        technologies, 
        updateStatus, 
        updateNotes, 
        markAllCompleted, 
        resetAll, 
        randomSelect,
        progress 
    } = useTechnologies();

    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedTechId, setSelectedTechId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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
        }
    };

    const filteredTechnologies = technologies.filter(tech => {
        const statusMatch = activeFilter === 'all' || tech.status === activeFilter;
        const searchMatch = searchQuery === '' || 
            tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tech.description.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
    });

    return (
        <div className="home-page">
            <ProgressHeader technologies={technologies} />
            
            <DetailedStatistics technologies={technologies} />
            
            <QuickActions 
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAll}
                onRandomSelect={handleRandomSelect}
                technologies={technologies}
            />

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="search-results">Найдено: {filteredTechnologies.length}</span>
            </div>

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

export default Home;