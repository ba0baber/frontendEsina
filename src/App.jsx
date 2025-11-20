import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';

function App() {
    const technologies = [
        { 
            id: 1, 
            title: 'React Components', 
            description: 'Изучение функциональных и классовых компонентов, работа с props и state', 
            status: 'completed' 
        },
        { 
            id: 2, 
            title: 'JSX Syntax', 
            description: 'Освоение синтаксиса JSX, условного рендеринга и работы со списками', 
            status: 'in-progress' 
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
            status: 'in-progress' 
        }
    ];

    return (
        <div className="App">
            {/* Используем отдельный компонент ProgressHeader */}
            <ProgressHeader technologies={technologies} />
            
            <div className="technologies-container">
                <h2>Технологии для изучения</h2>
                <div className="technologies-list">
                    {technologies.map(tech => (
                        <TechnologyCard
                            key={tech.id}
                            title={tech.title}
                            description={tech.description}
                            status={tech.status}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;