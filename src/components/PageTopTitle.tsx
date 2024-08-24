import React from 'react';
import {useNavigate} from 'react-router-dom';
import {IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from '../assets/white_guidetube.png';

interface PageTopTitleProps {
    pageTitle: string;
}

const PageTopTitle: React.FC<PageTopTitleProps> = ({pageTitle}) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className='sticky top-0 z-10 w-full'>
            <div className="flex justify-between items-center p-2 w-full" style={{background: '#171717'}}>
                <div className="flex items-center" style={{marginLeft: 20}}>
                    <IconButton onClick={handleBackClick} style={{color: 'white', marginRight: 10}}>
                        <ArrowBackIcon/>
                    </IconButton>
                    <div>{pageTitle}</div>
                </div>
                <img src={Logo} style={{width: 40, height: 40, marginRight: 5}} alt="Logo"/>
            </div>
        </div>
    );
};

export default PageTopTitle;
