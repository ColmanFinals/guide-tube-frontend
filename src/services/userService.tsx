import api from "./api"
import { JwtPayload } from "jwt-decode"; 

export interface IUser {
    email?: string,
    username?: string,
    password?: string,
    imgUrl?: string,
    _id?: string,
    accessToken?: string,
    refreshToken?: string
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
}

export const registrUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        api.post("/auth/register", user).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export const loginUser =  (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        api.post(import.meta.env.VITE_SERVER_LOGIN_PATH,
            { username: user.username, password: user.password  },
            { headers: { "Content-Type": "application/json" } }
          ).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
  };
  
export const updateUser = (user: IUser) => {
    const accessToken = localStorage.getItem('accessToken');
    return new Promise<IUser>((resolve, reject) => {
        api.post("/user", user, {headers: {'authorization': `Bearer ${accessToken}`}
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}
export const googleSignin = (credentials: JwtPayload) => {
    return new Promise<IUser>((resolve, reject) => {
        api.post(import.meta.env.VITE_SERVER_GOOGLE_LOGIN_PATH,
            { credentials },
            { headers: { "Content-Type": "application/json" } }
          ).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

