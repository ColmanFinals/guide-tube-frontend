import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import api from "../../services/serverApi";
import {IGuide} from "../../interfaces/IGuide";
import {TextField} from '@mui/material';
import PageTopTitle from "../PageTopTitle.tsx";
import LoadingPage from "./LoadingPage.tsx";

const FeedPage: React.FC = () => {
    const {companyName} = useParams<{ companyName: string }>();
    const [guides, setGuides] = useState<IGuide[]>([]);
    const [filteredGuides, setFilteredGuides] = useState<IGuide[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await api.post<{ guides: IGuide[] }>('/guide/byCompany', {companyName});
                setGuides(response.data.guides);
                setFilteredGuides(response.data.guides);
            } catch (err) {
                setError('Failed to fetch guides.');
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, [companyName]);

    useEffect(() => {
        const filtered = guides.filter(guide =>
            guide.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredGuides(filtered);
    }, [searchQuery, guides]);

    if (loading)
        return <LoadingPage/>;
    if (error) return <div>{error}</div>;

    const handleNavigate = (guideId: string) => {
        navigate(`/video/${guideId}`);
    };

    return (
        <div className='h-full w-full'>
            <PageTopTitle pageTitle="Choose a Guide"/>
            <div className='sticky top-0 z-10 bg-[#212121] shadow py-2 px-4'>
                <TextField
                    label={`Search Playlists in ${companyName}`}
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='mb-4'
                />
            </div>
            <div className='mt-4 bg-[linear-gradient(#141e30, #243b55)] p-6'>
                <h1 className='text-3xl text-center text-white mb-8'>Playlists for {companyName}</h1>
                <div className='flex flex-wrap justify-center items-center'>
                    {filteredGuides.map((guide) => (
                        <div
                            key={guide._id}
                            className="m-5 group relative overflow-hidden text-center cursor-pointer"
                            onClick={() => handleNavigate(guide._id)}
                        >
                            <div className='w-[250px] h-[450px] rounded-2xl overflow-hidden'>
                                <img
                                    className="w-full h-full object-cover"
                                    src={`https://img.youtube.com/vi/${guide.videos[0]?.id}/frame0.jpg`}
                                    alt={guide.name}
                                />
                            </div>
                            <div className="text-white mt-4">
                                <h2 className="text-xl font-bold">{guide.name}</h2>
                                <p className="text-sm">Views: {guide.views}</p>
                                <p className="text-xs">Uploaded: {new Date(guide.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeedPage;
