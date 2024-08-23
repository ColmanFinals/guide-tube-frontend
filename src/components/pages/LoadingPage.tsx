const LoadingPage = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full bg-gradient-to-br from-gray-500 via-gray-800 to-black">
            <div className="w-16 h-16 border-4 border-t-white border-white/30 rounded-full animate-spin mb-6"></div>
            <h2 className="text-white text-2xl font-semibold animate-pulse">Loading...</h2>
        </div>
    );
}

export default LoadingPage;
