import {useEffect, useState} from "react";
import {Box, Button, Grid, IconButton, TextField, Typography, useTheme,Autocomplete,InputAdornment} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../services/serverApi";
import {fetchCompanies} from "../../../services/companiesService";
import PageTopTitle from "../../PageTopTitle";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { IUser } from "../../../interfaces/IUser";
import { fetchAllUsers } from "../../../services/userService";


interface ICompanyCreator {
    _id: string;
    name: string;
    logo: string;
    users: string[];
    admins: { _id: string; username: string }[];
    videos: string[];
}




const CompanyManager = () => {


    const theme = useTheme();
    const [newCompany, setNewCompany] = useState<Partial<ICompanyCreator>>({
        name: "",
        logo: "",
        admins: [],
        videos: [],
    });
    const [companies, setCompanies] = useState<ICompanyCreator[]>([]);
    const [, setAdminId] = useState<string>("");
    const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
    const [, setFilteredUsers] = useState<IUser[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showAddAdminInput, setShowAddAdminInput] = useState<string | null>(
        null
    ); // Store companyId when showing input

    useEffect(() => {
        // Fetch companies on component mount
        const loadCompanies = async () => {
            try {
                const response = await fetchCompanies() // Endpoint to fetch all companies
                setCompanies(response.companies);
                console.log(response.companies);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };

        loadCompanies();
    }, []);

    const handleCreateCompany = async () => {
        try {
            await api.post("/company/create", newCompany);
            toast.success("Company created successfully!");
            // Fetch updated list of companies
            const response = await api.get("/company/getAll");
            setCompanies(response.data.companies);
        } catch (error) {
            console.error("Error creating company:", error);
            toast.error("Error creating company.");
        }
    };

    useEffect(() => {
        const loadAvailableUsers = async () => {
            try {
                const allUsers: IUser[] = await fetchAllUsers();
                setAvailableUsers(allUsers || []);
            } catch (error) {
                console.error("Error fetching available users:", error);
            }
        };
        loadAvailableUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            (availableUsers || []).filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, availableUsers]);

    const handleDeleteCompany = async (id: string) => {
        try {
            console.log(id);
            
            await api.delete(`/company/delete/${id}`); // Pass companyId as part of the URL
            toast.success("Company deleted successfully!");
            // Fetch updated list of companies
            const response = await api.get("/company/getAll");
            setCompanies(response.data.companies);
        } catch (error) {
            console.error("Error deleting company:", error);
            toast.error("Error deleting company.");
        }
    };

    const handleAddAdmin = async (companyId: string, username:string) => {
        try {
            if (username.trim() !== "") {
                console.log("asdasdasdasd");
                            
                await api.put("/company/addAdmin", {companyId, username});
                toast.success("Admin added successfully!");
                setAdminId(""); // Clear the input field
                setShowAddAdminInput(null); // Hide the input field
                // Fetch updated list of companies
                const response = await api.get("/company/getAll");
                setCompanies(response.data.companies);
            } else {
                toast.error("Invalid Admin ID.");
            }
        } catch (error) {
            console.error("Error adding admin:", error);
            toast.error("Error adding admin.");
        }
    };

    const handleRemoveAdmin = async (companyId: string, adminId: string) => {
        try {
            await api.put("/company/removeAdmin", { companyId, adminId });
            toast.success("Admin removed successfully!");
            // Fetch updated list of companies
            const response = await api.get("/company/getAll");
            setCompanies(response.data.companies);
        } catch (error) {
            console.error("Error removing admin:", error);
            toast.error("Error removing admin.");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            <PageTopTitle pageTitle="Companies manager"/>
            <Box
                sx={{
                    flex: 1,
                    padding: 2,
                }}
            >
                <Box sx={{marginTop: '5rem', marginBottom: '2rem'}}>
                    <Grid container spacing={2} alignItems="center"><Grid item xs={12} md={6}>
                            <TextField
                                label="Company Name"
                                fullWidth
                                value={newCompany.name || ""}
                                onChange={(e) =>
                                    setNewCompany({...newCompany, name: e.target.value})
                                }
                                variant="outlined"
                                sx={{mb: 1}}
                            />
                            <TextField
                                label="Company Logo URL"
                                fullWidth
                                value={newCompany.logo || ""}
                                onChange={(e) =>
                                    setNewCompany({...newCompany, logo: e.target.value})
                                }
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreateCompany}
                                startIcon={<AddIcon/>}
                                fullWidth
                            >
                                Create Company
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <Typography variant="h5" gutterBottom>
                        Companies
                    </Typography>
                    <Grid container spacing={2}>
                        {companies.map((company) => (
                            <Grid item xs={12} md={6} key={company._id}>
                                <Box
                                    sx={{
                                        border: '1px solid',
                                        borderColor: theme.palette.divider,
                                        borderRadius: 2,
                                        padding: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant="h6">{company.name}</Typography>
                                        <img src={company.logo} alt={`${company.name} logo`}
                                             className="h-10 w-10 rounded-full"/>
                                        <IconButton
                                            onClick={() => handleDeleteCompany(company._id)}
                                            color="error"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Box>

                                    {showAddAdminInput === company._id ? (
                                        <Autocomplete
                                            sx={{ width: '100%' }}
                                            freeSolo
                                            options={availableUsers}
                                            getOptionLabel={(option) => typeof option === 'string' ? option : `${option.username} (${option.fullName})`}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Search Users"
                                                    variant="outlined"
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AddIcon/>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                            onChange={(_event, value: string | IUser | null) => {
                                                if (value && typeof value === 'object' && 'username' in value) {
                                                    handleAddAdmin(company._id, value.username);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() =>
                                                
                                                setShowAddAdminInput(company._id)
                                            }
                                            fullWidth
                                        >
                                            Add Admin
                                        </Button>
                                    )}

                                    <Box>
                                        {company.admins.map((admin) => (
                                            <Box
                                                key={admin._id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginTop: 2,
                                                }}
                                            >
                                                <Typography>
                                                    Admin: {admin.username}
                                                </Typography>
                                                <IconButton
                                                    onClick={() =>
                                                        handleRemoveAdmin(
                                                            company._id,
                                                            admin._id
                                                        )
                                                    }
                                                    color="error"
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <ToastContainer
                    theme="dark"
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    pauseOnHover
                />
            </Box>
        </Box>
    );
};

export default CompanyManager;
