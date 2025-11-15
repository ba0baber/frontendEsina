
import './App.css';
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
        }
    ];

    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="App">
            {}
            <div className="progress-header">
                <h1>Трекер изучения технологий</h1>
                <div className="stats">
                    <div className="stat">
                        <span className="number">{total}</span>
                        <span className="label">Всего</span>
                    </div>
                    <div className="stat">
                        <span className="number">{completed}</span>
                        <span className="label">Изучено</span>
                    </div>
                    <div className="stat">
                        <span className="number">{technologies.filter(tech => tech.status === 'in-progress').length}</span>
                        <span className="label">В процессе</span>
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">{progressPercentage}% выполнено</span>
                    </div>
                </div>
            </div>

            {}
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