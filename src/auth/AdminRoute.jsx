import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const MustBeAdmin = ({ component: Component, shouldBeLoggedIn, redirect='/', shouldBeAdmin = false }) => {
    const { isLoggedIn } = useAuth();
    const [role, setRole] = useState(null);

    useEffect(() => { 
        const checkRole = async () => {
            const userRole = localStorage.getItem('role');
            setRole(userRole);
        };
        checkRole();
        // console.log(isLoggedIn, shouldBeLoggedIn)
    }, [isLoggedIn])
    
    if (role === null) {
        // Роль еще не загружена, пока ждем...
        return null;
    }
    if (shouldBeAdmin === false) {
        if ( isLoggedIn ) {
            return <Component />
        }
    } else {
        if (role === 'ROLE_ADMIN' && isLoggedIn ) {
            return <Component />
        }
    }

    
    if (!isLoggedIn && shouldBeLoggedIn) {
        return <Navigate to="/login" />
    }

    

    return <Navigate to={redirect ? redirect : '/'} />
}
export default MustBeAdmin;