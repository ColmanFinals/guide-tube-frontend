import {Language} from "../interfaces/ELanguage";
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
    picture?: string,
    language?: Language
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
}

interface ILoginUserRes {
    userData?: {
        _id?: string;
        picture?: string;
        username?: string;
        password?: string;
        fullName?: string;
        role?: string;
        __v?: number;
        language?: Language;
    };
    _id?: string;
    accessToken?: string;
    refreshToken?: string;
}

function castLoginUserResToIUser(loginUserRes: ILoginUserRes): IUser {
    return {
        _id: loginUserRes._id ?? loginUserRes.userData?._id,
        username: loginUserRes.userData?.username,
        fullName: loginUserRes.userData?.fullName,
        role: loginUserRes.userData?.role,
        password: loginUserRes.userData?.password,
        picture: loginUserRes.userData?.picture,
        accessToken: loginUserRes.accessToken,
        refreshToken: loginUserRes.refreshToken,
        language: loginUserRes.userData?.language,
        userData: {_id: loginUserRes.userData?._id}
    };
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
            const user = castLoginUserResToIUser(response.data);
            resolve(user);
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
            const user = castLoginUserResToIUser(response.data);
            resolve(user);
        }).catch((error) => {
            reject(error);
        });
    });
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
        headers: {'authorization': `Bearer ${accessToken}`}
    });
    return response.data.isAdmin;
};

export const updateLanguage = async (newLanguage: string) => {
    api.put("/user/updateLanguage", {"language": newLanguage}).then((response) => {
        return response.data
    }).catch(e => {
        return e
    })
}