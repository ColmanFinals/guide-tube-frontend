import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Avatar, IconButton } from '@mui/material';
import { getUserData, changePassword, updateProfilePicture } from '../../services/userService';
import { useUser } from '../../context/user-context';
import EditIcon from '@mui/icons-material/Edit';
import PageTopTitle from '../PageTopTitle';

const UserProfile: React.FC = () => {
    const { user: contextUser } = useUser();
    const [user, setUser] = useState(contextUser || {});
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await getUserData(contextUser?.userData._id!);
                setUser(userData);
                setImgUrl(`${import.meta.env.VITE_SERVER}/${userData.picture || ''}`);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        if (contextUser) {
            loadUserData();
        }
    }, [contextUser]);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            await changePassword(currentPassword, newPassword);
            alert('Password changed successfully');
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await updateProfilePicture(contextUser?.userData._id!, file);
                alert('Profile picture updated successfully');
                setImgUrl(URL.createObjectURL(file));
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                paddingTop: 8,
                marginTop: 3,
                padding: 2,
            }}
        >
            <PageTopTitle pageTitle="My Profile" />
            <Box sx={{ marginTop: 3, width: '100%', maxWidth: 600 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 3 }}>
                    <Avatar
                        src={imgUrl}
                        sx={{ width: 120, height: 120, marginRight: 2 }}
                    />
                    <IconButton color="primary" component="label">
                        <EditIcon />
                        <input type="file" hidden onChange={handleProfilePictureChange} />
                    </IconButton>
                </Box>
                <Typography variant="h5" gutterBottom>
                    {user.fullName || 'Full Name'}
                </Typography>
                <TextField
                    label="Full Name"
                    value={user.fullName || ''}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    label="Roles"
                    value={Array.isArray(user.role) ? user.role.join(', ') : user.role || ''}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h6">Change Password</Typography>
                    <TextField
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                    
                        variant="contained"
                        color="primary"
                        onClick={handlePasswordChange}
                        sx={{ marginTop: 2 }}
                        fullWidth
                    >
                        Update Password
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default UserProfile;
