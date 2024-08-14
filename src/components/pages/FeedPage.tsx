import {useNavigate} from 'react-router-dom';

const FeedPage = () => {
    const videoIds = ['SSn1g1micfs', 'fnEPYg2cb1g', 'eyDk9MZ-odk', 'SSn1g1micfs', 'fnEPYg2cb1g', 'eyDk9MZ-odk', 'SSn1g1micfs', 'fnEPYg2cb1g', 'eyDk9MZ-odk', 'SSn1g1micfs', 'fnEPYg2cb1g', 'eyDk9MZ-odk',];
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/home');
    };

    return (
        <div className='h-full'>
            <div className='bg-[linear-gradient(#141e30, #243b55)] flex flex-wrap justify-center items-center'>
                {videoIds.map((videoId, index) => (
                    <div key={index} className="m-5 group relative overflow-hidden text-center" onClick={handleClick}>
                        <div className='w-[250px] h-[450px] rounded-2xl overflow-hidden'>
                            <img className="w-full h-full object-cover"
                                 src={"https://i.ytimg.com/vi_webp/" + videoId + "/maxresdefault.webp"}
                                 alt='Video Thumbnail'/>
                        </div>
                        <label>sample header</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedPage;
