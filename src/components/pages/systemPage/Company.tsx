import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../services/api';

interface Company {
    _id: string;
    name: string;
    users: string[];
    admin: string[]; // Ensure admin IDs are strings
    videos: string[];
}

const CompanyManager = () => {
    const [newCompany, setNewCompany] = useState<Partial<Company>>({ name: '', admin: [], videos: [] });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [adminId, setAdminId] = useState<string>('');
    const [showAddAdminInput, setShowAddAdminInput] = useState<string | null>(null); // Store companyId when showing input

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

    const handleAddAdmin = async (companyId: string) => {
        try {
            // Ensure adminId is a string
            if (typeof adminId === 'string' && adminId.trim() !== '') {
                await api.put('/company/addAdmin', { companyId, adminId });
                toast.success('Admin added successfully!');
                setAdminId(''); // Clear the input field
                setShowAddAdminInput(null); // Hide the input field
                // Fetch updated list of companies
                const response = await api.get('/company/getAll');
                setCompanies(response.data.companies);
            } else {
                toast.error('Invalid Admin ID.');
            }
        } catch (error) {
            console.error('Error adding admin:', error);
            toast.error('Error adding admin.');
        }
    };

    const handleRemoveAdmin = async (companyId: string, adminId: string) => {
        try {
            await api.put('/company/removeAdmin', { companyId, adminId });
            toast.success('Admin removed successfully!');
            // Fetch updated list of companies
            const response = await api.get('/company/getAll');
            setCompanies(response.data.companies);
        } catch (error) {
            console.error('Error removing admin:', error);
            toast.error('Error removing admin.');
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
                {/* Add inputs for videos */}
                <button onClick={handleCreateCompany} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                    Create Company
                </button>
            </div>

            <div className="mb-5">
                <h2 className="text-2xl font-semibold mb-2">Companies</h2>
                <ul>
                    {companies.map(company => (
                        <li key={company._id} className="mb-3 flex flex-col border border-gray-700 p-4 rounded-md">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xl">{company.name}</span>
                                <button onClick={() => handleDeleteCompany(company._id)} className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                            {showAddAdminInput === company._id ? (
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Admin ID"
                                        value={adminId}
                                        onChange={(e) => setAdminId(e.target.value)}
                                        className="p-2 rounded-md bg-white text-black w-full mb-2"
                                    />
                                    <button onClick={() => handleAddAdmin(company._id)} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                                        Add Admin
                                    </button>
                                    <button onClick={() => setShowAddAdminInput(null)} className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 ml-2">
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setShowAddAdminInput(company._id)} className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600">
                                    Add Admin
                                </button>
                            )}
                            <div>
                                {company.admin.map(admin => (
                                    <div key={admin._id} className="flex items-center mb-2">
                                        <span className="mr-2">Admin Username: {admin.username}</span>
                                        <button onClick={() => handleRemoveAdmin(company._id, admin._id)} className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600">
                                            Remove Admin
                                        </button>
                                    </div>
                                ))}
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
