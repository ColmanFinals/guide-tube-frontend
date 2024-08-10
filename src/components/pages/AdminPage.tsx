import React, { useState, useEffect } from 'react';
import { Box, Grid, FormControl, InputLabel, CircularProgress, IconButton, TextField, MenuItem, Select, Autocomplete, InputAdornment } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import api, { fetchMyCompanies, getCompanyById, removeUser, fetchAllUsers, addUser } from '../../services/serverApi'; // Adjust the path as necessary
import PageTopTitle from '../PageTopTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface IUser {
    _id: string;
    username: string;
    fullName: string;
    imgUrl: string;
    role: string;
}

interface ICompany {
    _id: string;
    name: string;
}

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
                    setUsers(companyData.users || []);
                    setFilteredUsers(companyData.users || []);
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


    const columns: GridColDef[] = [
        {
            field: 'imgUrl',
            headerName: 'Picture',
            width: 100,
            renderCell: (params) => (
                <img
                    src={params.value || 'https://via.placeholder.com/40'}
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
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'fullName', headerName: 'Full Name', width: 200 },
        { field: 'role', headerName: 'Role', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            renderCell: (params) => (
                <IconButton color="error" onClick={() => handleDeleteUser(params.row._id)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100%',
                paddingTop: '35px',
            }}
        >
            <PageTopTitle pageTitle="Admin Dashboard" />
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
                                sx={{ minWidth: 200 }}
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
                            sx={{ width: '100%' }}
                            freeSolo
                            options={filteredUsers}
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
                                                <AddIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    disabled={!selectedCompany} // Disable until company is selected
                                />
                            )}
                            onChange={(event, value) => {
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
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            autoHeight
                            disableSelectionOnClick
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
