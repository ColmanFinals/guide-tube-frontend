import React, {useEffect, useState} from 'react';
import {ICompany} from '../../interfaces/ICompany';
import {useNavigate} from 'react-router-dom';
import {fetchCompanies} from "../../services/companiesService.tsx"
import {TextField} from '@mui/material';
import PageTopTitle from "../PageTopTitle.tsx";
import { useUser } from '../../context/user-context.tsx';
import LoadingPage from "./LoadingPage.tsx";

const CompaniesPage: React.FC = () => {
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<ICompany[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();
    const {user} = useUser();

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const response = await fetchCompanies()
                setCompanies(response.companies);
                setFilteredCompanies(response.companies);
            } catch (err) {
                setError('Failed to fetch companies.');
            } finally {
                setLoading(false);
            }
        };

        loadCompanies();
    }, []);

    useEffect(() => {
        const filtered = companies.filter(company =>
            company.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCompanies(filtered);
    }, [searchQuery, companies]);

    if (loading)
        return <LoadingPage/>;
    if (error) return <div>{error}</div>;

    const handleNavigate = (companyName: string) => {
        navigate(`/feed/${companyName}`);
    };

    return (
        <div className='h-full w-full'>
            <PageTopTitle pageTitle="Choose a Company"/>
            <div className='sticky top-0 z-10 bg-[#212121] shadow py-2 px-4'>
                <span className="bg-clip-text text-transparent bg-gradient-to-r" style={{fontSize:'2em', fontFamily: "Candara", backgroundImage: "linear-gradient(to right, #c17982, #C6878F, #969696, #67697C)",}}>Hi {user?.fullName},</span>
                <br/>
                <span style={{fontSize: "1em", fontFamily: "Candara"}} className="text-white">What would you like to learn today?</span>
                <TextField
                    label="Search Companies"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='mb-4'
                />
            </div>
            <div className='mt-4 bg-[linear-gradient(#141e30, #243b55)] flex flex-wrap justify-center items-center'>
                {filteredCompanies.map((company) => (
                    <div
                        key={company._id}
                        className='m-5 group relative overflow-hidden text-center cursor-pointer'
                        onClick={() => handleNavigate(company.name)}
                    >
                        <div
                            className='w-[250px] h-[250px] rounded-2xl p-5 shadow-lg flex flex-col items-center' style={{backgroundColor:"#ffffff17"}}>
                            <img
                                src={company.logo}
                                alt={`${company.name} logo`}
                                className='w-20 h-20 mb-3 rounded-full border-2 border-white'
                            />
                            <h2 className='text-xl font-bold mb-2'>{company.name}</h2>
                            <h3 className='text-lg font-medium'>Creator: {company.creator.fullName}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompaniesPage;
