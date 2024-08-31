import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    Switch,
    Typography
} from "@mui/material";
import React from "react";
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import CloseIcon from '@mui/icons-material/Close';

export interface PlaylistConfigurationProps {
    isPrivate: boolean,
    setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>,
    setCompany: React.Dispatch<React.SetStateAction<string>>,
    userCompanies: string[],
    open: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleSave: () => void,
    company: string
}

const PlaylistConfiguration: React.FC<PlaylistConfigurationProps> = ({
                                                                         isPrivate,
                                                                         setIsPrivate,
                                                                         setCompany,
                                                                         userCompanies,
                                                                         open,
                                                                         setIsOpen,
                                                                         handleSave,
                                                                         company
                                                                     }) => {
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPrivate(event.target.checked);
    };
    const handleCompanyChange = (event: SelectChangeEvent) => {
        setCompany(event.target.value)
    }
    const handleUpload = () => {
        setIsOpen(false);
        handleSave();
    }
    const handleClose = () => {
        setIsOpen(false);
    }
    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="h-full w-full flex justify-center items-center min-w-fit"
        >
            <Box className="flex justify-center items-center flex-col min-w-fit"
                 sx={{backgroundColor: "black", width: '30vw', height: '40vh'}}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontSize: '1em'}}>
                    Almost finished...
                </Typography>
                <FormControl required sx={{m: 1, minWidth: 120}}>
                    <InputLabel id="demo-simple-select-required-label">company</InputLabel>
                    <Select
                        labelId="demo-simple-select-required-label"
                        id="demo-simple-select-required"
                        value={company}
                        label="company *"
                        onChange={handleCompanyChange}
                    >
                        {userCompanies.map(company => (
                            <MenuItem value={company} key={company}>{company}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    <Switch
                        checked={isPrivate}
                        onChange={handleSwitchChange}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                    <span>Guide will be {isPrivate ? "Private" : "Public"}</span>
                </Typography>
                <Typography className="flex w-full justify-between">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleUpload}
                        sx={{maxWidth: '300px', margin: 'auto', width: '7em'}}
                    >
                        <FileUploadRoundedIcon/>
                        Done
                    </Button>
                    <Button
                        variant="outlined"
                        aria-label="close"
                        onClick={handleClose}
                        sx={{maxWidth: '300px', margin: 'auto', width: '7em'}}
                    >
                        <CloseIcon/>
                        Cancel
                    </Button>
                </Typography>
            </Box>
        </Modal>
    );
}

export default PlaylistConfiguration;
