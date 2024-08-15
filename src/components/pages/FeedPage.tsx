import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import api from "../../services/serverApi.tsx";

interface IVideo {
    id: string;
}

interface IGuide {
    _id: string;
    name: string;
    views: number;
    createdAt: string;
    videos: IVideo[];
}

const FeedPage: React.FC = () => {
    const {companyName} = useParams<{ companyName: string }>();
    const [guides, setGuides] = useState<IGuide[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await api.post<{ guides: IGuide[] }>('/guide/byCompany', {companyName});
                setGuides(response.data.guides);
            } catch (err) {
                setError('Failed to fetch guides.');
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, [companyName]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleNavigate = (guideId: string) => {
        navigate(`/video/${guideId}`);
    };

    return (
        <div className='h-full'>
            <div className='bg-[linear-gradient(#141e30, #243b55)] p-6'>
                <h1 className='text-3xl text-center text-white mb-8'>Playlists for {companyName}</h1>
                <div className='flex flex-wrap justify-center items-center'>
                    {guides.map((guide) => (
                        <div
                            key={guide._id}
                            className="m-5 group relative overflow-hidden text-center cursor-pointer"
                            onClick={() => handleNavigate(guide._id)}
                        >
                            <div className='w-[250px] h-[450px] rounded-2xl overflow-hidden'>
                                <img
                                    className="w-full h-full object-cover"
                                    src={`https://i.ytimg.com/vi_webp/${guide.videos[0]?.id}/maxresdefault.webp`}
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
