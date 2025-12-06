import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

function AddTechnology({ onAddTechnology }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        status: 'not-started',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('Пожалуйста, введите название технологии');
            return;
        }

        const newTech = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        onAddTechnology(newTech);
        alert('Технология успешно добавлена!');
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="page">
            <div className="page-content">
                <div className="page-header">
                    <button onClick={() => navigate('/')} className="back-link">
                        ← Назад
                    </button>
                    <h1>➕ Добавить новую технологию</h1>
                </div>

                <form onSubmit={handleSubmit} className="tech-form">
                    <div className="form-group">
                        <label htmlFor="title">Название технологии *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Например: React, Node.js, TypeScript..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Опишите, что это за технология, для чего используется..."
                            rows="4"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Категория</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="database">Базы данных</option>
                                <option value="tools">Инструменты</option>
                                <option value="devops">DevOps</option>
                                <option value="mobile">Мобильная разработка</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Начальный статус</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="not-started">Не начато</option>
                                <option value="in-progress">В процессе</option>
                                <option value="completed">Завершено</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Заметки</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Дополнительные заметки, ссылки на ресурсы..."
                            rows="3"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Добавить технологию
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTechnology;