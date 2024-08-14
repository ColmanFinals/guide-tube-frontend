import api from "./serverApi"


export const fetchMyCompanies = async () => {
    const response = await api.get('/company/fetchMyCompanies');
    return response.data;
};

export const getCompanyById = async (companyId: string) => {
    const response = await api.get(`/company/getCompanyById/${companyId}`);
    return response.data;
};

export const addAdmin = async (companyId: string, userId: string) => {
    const response = await api.put(`/company/add-admin`, {companyId, adminId: userId});
    return response.data;
};

export const removeAdmin = async (companyId: string, userId: string) => {
    const response = await api.put(`/company/remove-admin`, {companyId, adminId: userId});
    return response.data;
};

export const removeUser = async (companyId: string, userId: string) => {
    const response = await api.put(`/company/removeUser`, {companyId, userId});
    return response.data;
};

export const addUser = async (companyId: string, userId: string) => {
    const response = await api.put(`/company/addUser`, {companyId, userId});
    return response.data;
};
