import {createContext, ReactNode, useContext, useState} from 'react';
import {googleSignIn, IUser, loginUser, logoutUser} from "../services/userService";
import {JwtPayload} from 'jwt-decode';

interface IUserContext {
    user: IUser | null;
    login: (user: IUser) => Promise<void>;
    logout: () => void;
    signInViaGoogle: (credentials: JwtPayload) => Promise<void>;
    //updateUserDetails: (user: IUser) => Promise<void>;
}

const defaultUserContextVal = undefined
const UserContext = createContext<IUserContext | undefined>(defaultUserContextVal);

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

    // const updateUserDetails = async(user: IUser) => {
    //   const response: IUser = await updateUser(user);
    //   localStorage.setItem('user', JSON.stringify(response));
    //   setUser(response);
    // }
    return (
        <UserContext.Provider value={{user, login, signInViaGoogle, logout}}>
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