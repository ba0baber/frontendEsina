import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение функциональных и классовых компонентов, работа с props и state',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 2,
        title: 'JSX Syntax',
        description: 'Освоение синтаксиса JSX, условного рендеринга и работы со списками',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 3,
        title: 'State Management',
        description: 'Работа с состоянием компонентов, изучение хуков useState и useEffect',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 4,
        title: 'React Router',
        description: 'Настройка маршрутизации в React-приложениях',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 5,
        title: 'API Integration',
        description: 'Работа с внешними API, использование fetch и axios',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    }
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('techTrackerData', initialTechnologies);

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

    return {
        technologies,
        setTechnologies,
        updateStatus,
        updateNotes,
        markAllCompleted,
        resetAll,
        randomSelect,
        progress: calculateProgress()
    };
}

export default useTechnologies;