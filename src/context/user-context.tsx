import {createContext, ReactNode, useContext, useState} from 'react';
import {googleSignIn, IUser, loginUser, logoutUser, updateLanguage} from "../services/userService";
import {JwtPayload} from 'jwt-decode';
import {Language} from '../interfaces/ELanguage';

interface IUserContext {
    user: IUser | null;
    login: (user: IUser) => Promise<void>;
    logout: () => void;
    signInViaGoogle: (credentials: JwtPayload) => Promise<void>;
    updateUserLanguage: (newLanguage: Language) => Promise<void>;
}

const defaultUserContextVal = undefined
export const UserContext = createContext<IUserContext | undefined>(defaultUserContextVal);

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (user: IUser) => {
        try {
            const response: IUser = await loginUser(user);
            console.log("login via app - ", response)
            localStorage.setItem('accessToken', response.accessToken!);
            localStorage.setItem('refreshToken', response.refreshToken!);
            localStorage.setItem('user', JSON.stringify(response));
            setUser(response);
        } catch (e) {
            throw e;
        }
    };

    const signInViaGoogle = async (credentials: JwtPayload) => {
        try {
            const response: IUser = await googleSignIn(credentials);
            console.log("login via google - ", response)
            localStorage.setItem('accessToken', response.accessToken!);
            localStorage.setItem('refreshToken', response.refreshToken!);
            localStorage.setItem('user', JSON.stringify(response));
            setUser(response);
        } catch (e) {
            throw e
        }
    };

    const updateUserLanguage = async (newLanguage: Language) => {
        try {
            await updateLanguage(newLanguage);
            var newUser = {...user}
            newUser.language = newLanguage;
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        } catch (e) {
            console.log(e)
        }
    }
    const logout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('googleOauth2AccessToken');
            setUser(null);
        } catch (e) {
            console.log(e)
        }
    };
    return (
        <UserContext.Provider value={{user, login, signInViaGoogle, logout, updateUserLanguage}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};