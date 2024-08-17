import api from "./serverApi"
import {JwtPayload} from "jwt-decode";

export interface IUser {
    email?: string,
    username?: string,
    fullName?: string,
    role?: string,
    password?: string,
    userData?: { _id?: string },
    _id?: string,
    accessToken?: string,
    refreshToken?: string,
    picture?: string
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
}

export const registerUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        api.post("/auth/register", user).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export const loginUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        api.post(import.meta.env.VITE_SERVER_LOGIN_PATH,
            {username: user.username, password: user.password},
            {headers: {"Content-Type": "application/json"}}
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
        api.post("/user", user, {
            headers: {'authorization': `Bearer ${accessToken}`}
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}
export const googleSignIn = (credentials: JwtPayload) => {
    return new Promise<IUser>((resolve, reject) => {
        api.post(import.meta.env.VITE_SERVER_GOOGLE_LOGIN_PATH,
            {credentials},
            {headers: {"Content-Type": "application/json"}}
        ).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export const logoutUser = () => {
    return new Promise((resolve, reject) => {
        api.post(import.meta.env.VITE_SERVER_LOGOUT_PATH, null, {})
            .then((response) => {
                resolve(response.data)
            }).catch((error) => {
            reject(error)
        })
    })
}

export const changePassword = (currentPassword: string, newPassword: string) => {
    const accessToken = localStorage.getItem('accessToken');
    return new Promise<void>((resolve, reject) => {
        api.post(
            "/auth/changePassword",
            {currentPassword, newPassword},
            {headers: {'authorization': `Bearer ${accessToken}`}}
        ).then((response) => {
            console.log(response)
            resolve();
        }).catch((error) => {
            console.log(error)
            reject(error)
        });
    });
}

export const getUserData = (userId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    return new Promise<IUser>((resolve, reject) => {
        api.get(`/user/getUserData/${userId}`, {
            headers: {'authorization': `Bearer ${accessToken}`}
        }).then((response) => {
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        });
    });
}

export const updateProfilePicture = (userId: string, file: File) => {
    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("file", file);

    return new Promise<IUser>((resolve, reject) => {
        api.put("/user/updatePicture", formData, {
            headers: {
                'authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        });
    });
}

export const fetchAllUsers = async () => {
    const response = await api.get('/user/fetch');
    return response.data;
};

export const getIsAdmin = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await api.get(`/user/isAdmin`, {
            headers: {'authorization': `Bearer ${accessToken}`}});
    return response.data.isAdmin;
}