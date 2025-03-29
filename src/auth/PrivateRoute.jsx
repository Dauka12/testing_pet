import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ component: Component, shouldBeLoggedIn, redirect, mustBeAdmin = false }) => {
    const { isLoggedIn } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    // Добавляем проверку для авторизации с задержкой
    useEffect(() => {
        // Даем небольшую задержку, чтобы состояние авторизации успело обновиться
        const timer = setTimeout(() => {
            setIsChecking(false);
            console.log("Auth state after delay:", { isLoggedIn, shouldBeLoggedIn });
        }, 300);

        return () => clearTimeout(timer);
    }, [isLoggedIn, shouldBeLoggedIn]);

    // Пока проверяем состояние, показываем загрузку или ничего
    if (isChecking) {
        return null; // или можно показать спиннер/лоадер
    }

    // Сначала проверяем ограничения на конкретные компоненты
    if (!mustBeAdmin && (Component.name === 'CreateCoursePage' || Component.name === 'EditCatalog')) {
        return <Navigate to={'/'} />
    }

    // Проверка на защищенные маршруты (требуется авторизация)
    if (shouldBeLoggedIn && !isLoggedIn) {
        return <Navigate to="/login" />
    }

    // Проверка для страниц, недоступных авторизованным пользователям
    if (!shouldBeLoggedIn && isLoggedIn) {
        return <Navigate to={redirect || '/'} />
    }

    // Если все проверки пройдены, отображаем компонент
    return <Component />
}

export default PrivateRoute;