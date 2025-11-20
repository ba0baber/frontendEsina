import { useState } from 'react';
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';

function App() {
    const [technologies, setTechnologies] = useState([
        { 
            id: 1, 
            title: 'React Components', 
            description: 'Изучение функциональных и классовых компонентов, работа с props и state', 
            status: 'not-started' 
        },
        { 
            id: 2, 
            title: 'JSX Syntax', 
            description: 'Освоение синтаксиса JSX, условного рендеринга и работы со списками', 
            status: 'not-started' 
        },
        { 
            id: 3, 
            title: 'State Management', 
            description: 'Работа с состоянием компонентов, изучение хуков useState и useEffect', 
            status: 'not-started' 
        },
        { 
            id: 4, 
            title: 'React Router', 
            description: 'Настройка маршрутизации в React-приложениях', 
            status: 'not-started' 
        },
        { 
            id: 5, 
            title: 'API Integration', 
            description: 'Работа с внешними API, использование fetch и axios', 
            status: 'not-started' 
        }
    ]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedTechId, setSelectedTechId] = useState(null);
    const handleStatusChange = (id, newStatus) => {
        setTechnologies(prevTech => 
            prevTech.map(tech => 
                tech.id === id ? { ...tech, status: newStatus } : tech
            )
        );

        setSelectedTechId(null);
    };
    const handleMarkAllCompleted = () => {
        setTechnologies(prevTech => 
            prevTech.map(tech => ({ ...tech, status: 'completed' }))
        );
        setSelectedTechId(null);
    };

    const handleResetAll = () => {
        setTechnologies(prevTech => 
            prevTech.map(tech => ({ ...tech, status: 'not-started' }))
        );
        setSelectedTechId(null);
    };

    const handleRandomSelect = () => {

        const notCompletedTech = technologies.filter(
            tech => tech.status !== 'completed'
        );
        
        if (notCompletedTech.length === 0) {
            alert('🎉 Все технологии уже изучены!');
            setSelectedTechId(null);
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * notCompletedTech.length);
        const randomTech = notCompletedTech[randomIndex];
        
        setTechnologies(prevTech => 
            prevTech.map(tech => 
                tech.id === randomTech.id 
                    ? { ...tech, status: 'in-progress' } 
                    : tech
            )
        );

        setSelectedTechId(randomTech.id);
        setTimeout(() => {
            const element = document.getElementById(`tech-${randomTech.id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
        

        alert(`🎲 Выбрана технология: ${randomTech.title}\nСтатус изменен на "В процессе"`);
    };


    const filteredTechnologies = technologies.filter(tech => {
        if (activeFilter === 'all') return true;
        return tech.status === activeFilter;
    });

    return (
        <div className="App">
            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                onMarkAllCompleted={handleMarkAllCompleted}
                onResetAll={handleResetAll}
                onRandomSelect={handleRandomSelect}
            />

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
                        <TechnologyCard
                            key={tech.id}
                            id={tech.id}
                            title={tech.title}
                            description={tech.description}
                            status={tech.status}
                            onStatusChange={handleStatusChange}
                            isSelected={tech.id === selectedTechId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;