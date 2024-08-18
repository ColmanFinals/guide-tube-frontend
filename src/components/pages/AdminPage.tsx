import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    Box,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {addUser, fetchMyCompanies, getCompanyById, removeUser} from '../../services/companiesService';
import {fetchAllUsers} from "../../services/userService";
import PageTopTitle from '../PageTopTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { IUser } from '../../interfaces/IUser';
import { ICompany } from '../../interfaces/IPartialCompany';


const AdminPage: React.FC = () => {
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
    const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const companyData: ICompany[] = await fetchMyCompanies();
                setCompanies(companyData);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
        loadCompanies();
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            const loadUsers = async () => {
                setLoading(true);
                try {
                    const companyData = await getCompanyById(selectedCompany);
                    setUsers(companyData.users.concat(companyData.admins) || []);
                    setFilteredUsers(companyData.users.concat(companyData.admins) || []);
                } catch (error) {
                    console.error("Error fetching users:", error);
                } finally {
                    setLoading(false);
                }
            };
            loadUsers();
        }
    }, [selectedCompany]);

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

    const handleDeleteUser = async (userId: string) => {
        try {
            await removeUser(selectedCompany, userId);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleAddUser = async (userId: string) => {
        try {
            const userExists = users.some(user => user._id === userId);
            if (userExists) {
                console.log("User already added.");
                return;
            }

            const userToAdd = availableUsers.find(user => user._id === userId);
            if (userToAdd) {
                await addUser(selectedCompany, userId);
                setUsers(prevUsers => [...prevUsers, userToAdd]);
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const backendUrl = import.meta.env.VITE_SERVER;
    const columns: GridColDef[] = [
        {
            field: 'picture',
            headerName: 'Picture',
            width: 100,
            renderCell: (params) => (
                <img
                    src={`${backendUrl}/${params.value}` || 'https://via.placeholder.com/40'}
                    alt="User"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                />
            ),
        },
        {field: 'username', headerName: 'Username', width: 150},
        {field: 'fullName', headerName: 'Full Name', width: 200},
        {field: 'role', headerName: 'Role', width: 150},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            renderCell: (params) => (
                <IconButton color="error" onClick={() => handleDeleteUser(params.row._id)}>
                    <DeleteIcon/>
                </IconButton>
            ),
        },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            <PageTopTitle pageTitle="Admin Dashboard"/>
            <Box
                sx={{
                    flex: 1,
                    padding: 2,
                }}
            >
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={4} alignItems="center">
                        <FormControl fullWidth>
                            <InputLabel>Select Company</InputLabel>
                            <Select
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value as string)}
                                label="Select Company"
                                sx={{minWidth: 200}}
                            >
                                {companies.map((company) => (
                                    <MenuItem key={company._id} value={company._id}>
                                        {company.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" marginTop={2} justifyContent="center">
                    <Grid item xs={12} md={4} container justifyContent="center">
                        <Autocomplete
                        disabled={!selectedCompany}
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
                                    disabled={!selectedCompany}
                                />
                            )}
                            onChange={(_event, value) => {
                                if (typeof value !== 'string') {
                                    handleAddUser(value?._id || '');
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" marginTop={2} justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <DataGrid
                            rows={users}
                            columns={columns}
                            paginationModel={{pageSize: 5, page: 0}}
                            autoHeight
                            disableRowSelectionOnClick
                            getRowId={(row) => row._id}
                            loading={loading}
                            sx={{
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#f5f5f5',
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default AdminPage;
