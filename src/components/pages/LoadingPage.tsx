import HashLoader from "react-spinners/HashLoader";

const LoadingPage = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <HashLoader
            color={"#C6878F"}
            loading={true}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"/>
            <h2 className="text-white text-2xl font-semibold animate-pulse p-4">Loading...</h2>
        </div>
    );
}

export default LoadingPage;
