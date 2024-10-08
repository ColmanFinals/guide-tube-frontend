import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import {changePassword, getUserData, updateProfilePicture} from '../../services/userService';
import {useUser} from '../../context/user-context';
import EditIcon from '@mui/icons-material/Edit';
import PageTopTitle from '../PageTopTitle';
import {toast, ToastContainer} from 'react-toastify';
import {Language} from '../../interfaces/ELanguage';

const UserProfile: React.FC = () => {
    const {user: contextUser, updateUserLanguage} = useUser();
    const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>(contextUser?.language);
    const [user, setUser] = useState(contextUser || {});
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                if (!contextUser?.userData?._id) return;
                const userData = await getUserData(contextUser.userData._id);
                setUser(userData);
                const pictureUrl: string = userData?.picture != null ? userData?.picture : '';
                console.log(userData?.picture);
                setImgUrl(`${pictureUrl}`);
                setSelectedLanguage(contextUser?.language)

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
            toast.error('Passwords do not match!');
            return;
        }
        try {
            await changePassword(currentPassword, newPassword);
            toast.success('Password changed successfully');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password. Please try again.'); // Show error notification
        }
    };

    const handleChange = async (event: SelectChangeEvent<Language>) => {
        const newLanguage = event.target.value as Language;
        await updateUserLanguage(newLanguage);
        setSelectedLanguage(newLanguage);
    };

    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                if (!contextUser?.userData?._id) return;
                await updateProfilePicture(contextUser.userData._id, file);
                toast.success('Profile picture updated successfully');
                setImgUrl(URL.createObjectURL(file));
            } catch (error) {
                console.error('Error updating profile picture:', error);
                toast.error('Failed to update profile picture. Please try again.');
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                width: '100%',
            }}
        >
            <PageTopTitle pageTitle="My Profile"/>
            <Box sx={{marginTop: 3, width: '100%', maxWidth: 600}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 3}}>
                    <Avatar
                        src={imgUrl}
                        sx={{width: 120, height: 120, marginRight: 2}}
                    />
                    <IconButton color="primary" component="label">
                        <EditIcon/>
                        <input type="file" hidden onChange={handleProfilePictureChange}/>
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
                <FormControl fullWidth margin="normal">
                    <InputLabel id="language-select-label">Language</InputLabel>
                    <Select
                        labelId="language-select-label"
                        value={selectedLanguage}
                        onChange={handleChange}
                        label="Language"
                        sx={{minWidth: 200}}
                    >
                        {Object.values(Language).map((language) => (
                            <MenuItem value={language} key={language}>
                                {language}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{marginTop: 4}}>
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
                        sx={{marginTop: 2}}
                        fullWidth
                    >
                        Update Password
                    </Button>
                </Box>
            </Box>
            <ToastContainer theme="dark" position="top-center" autoClose={5000} hideProgressBar={false}
                            newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover/>
        </Box>
    );
};

export default UserProfile;
