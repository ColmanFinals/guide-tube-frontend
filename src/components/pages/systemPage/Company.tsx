import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../services/api';

interface Company {
    _id: string;
    name: string;
    users: string[];
    admin: string[];
    videos: string[];
}

const CompanyManager = () => {
    const [newCompany, setNewCompany] = useState<Partial<Company>>({ name: '', users: [], admin: [], videos: [] });
    const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        // Fetch companies on component mount
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/company/getAll'); // Endpoint to fetch all companies
                setCompanies(response.data.companies);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    const handleCreateCompany = async () => {
        try {
            await api.post('/company/create', newCompany);
            toast.success('Company created successfully!');
            // Fetch updated list of companies
            const response = await api.get('/company/getAll');
            setCompanies(response.data.companies);
        } catch (error) {
            console.error('Error creating company:', error);
            toast.error('Error creating company.');
        }
    };

    const handleUpdateCompany = async (id: string) => {
        if (!currentCompany) return; // Ensure currentCompany is not null
        try {
            await api.put(`/company/update`, { ...currentCompany, companyId: id });
            toast.success('Company updated successfully!');
            // Fetch updated list of companies
            const response = await api.get('/company/getAll');
            setCompanies(response.data.companies);
        } catch (error) {
            console.error('Error updating company:', error);
            toast.error('Error updating company.');
        }
    };

    const handleDeleteCompany = async (id: string) => {
        try {
            await api.delete(`/company/delete/${id}`); // Pass companyId as part of the URL
            toast.success('Company deleted successfully!');
            // Fetch updated list of companies
            const response = await api.get('/company/getAll');
            setCompanies(response.data.companies);
        } catch (error) {
            console.error('Error deleting company:', error);
            toast.error('Error deleting company.');
        }
    };
    

    return (
        <div className="p-[30px] bg-[rgba(0,0,0,.6)] box-border mx-auto rounded-[10px] text-white" style={{ width: '90%' }}>
            <h1 className="text-3xl font-bold text-center mb-5">Company Manager</h1>

            <div className="mb-5">
                <h2 className="text-2xl font-semibold mb-2">Create Company</h2>
                <input
                    type="text"
                    placeholder="Company Name"
                    value={newCompany.name || ''}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="p-2 rounded-md bg-white text-black w-full mb-3"
                />
                {/* Add inputs for users, admin, and videos */}
                <button onClick={handleCreateCompany} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                    Create Company
                </button>
            </div>

            <div className="mb-5">
                <h2 className="text-2xl font-semibold mb-2">Update Company</h2>
                {currentCompany && (
                    <div>
                        <input
                            type="text"
                            placeholder="Company Name"
                            value={currentCompany.name}
                            onChange={(e) => setCurrentCompany({ ...currentCompany, name: e.target.value })}
                            className="p-2 rounded-md bg-white text-black w-full mb-3"
                        />
                        {/* Add inputs for users, admin, and videos */}
                        <button onClick={() => currentCompany._id && handleUpdateCompany(currentCompany._id)} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">
                            Update Company
                        </button>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-2">Companies</h2>
                <ul>
                    {companies.map(company => (
                        <li key={company._id} className="mb-3 flex justify-between items-center">
                            {company.name}
                            <div>
                                <button onClick={() => setCurrentCompany(company)} className="bg-yellow-500 text-white p-1 rounded-md hover:bg-yellow-600 ml-2">
                                    Edit
                                </button>
                                <button onClick={() => company._id && handleDeleteCompany(company._id)} className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 ml-2">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <ToastContainer theme="dark" position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover />
        </div>
    );
};

export default CompanyManager;
