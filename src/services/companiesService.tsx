import api from "./serverApi"

export const fetchMyCompanies = (): Promise<string> => {
    return new Promise((resolve,reject)=> {       
        api.post(import.meta.env.VITE_SERVER_FETCH_COMPANIES_PATH, null, {
        })
        .then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}