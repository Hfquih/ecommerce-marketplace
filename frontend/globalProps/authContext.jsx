import React from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = React.useState(
        localStorage.getItem('token')
    );

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login , logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;