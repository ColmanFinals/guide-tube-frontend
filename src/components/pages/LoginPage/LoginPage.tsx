import {Link, useNavigate} from "react-router-dom";
import Logo from '../../../assets/white_guidetube.png'
import LoginForm from "./LoginForm.tsx";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {toast, ToastContainer} from 'react-toastify';
import {jwtDecode} from "jwt-decode";
import {useUser} from "../../../context/user-context";
import {IUser} from "../../../services/userService.tsx";
import {isAxiosError} from "axios";

const LoginPage = () => {
    const {signinViaGoogle} = useUser();
    const {login} = useUser();

    const navigate = useNavigate();
    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (credentialResponse.credential) {
                const decodedRes = jwtDecode(
                    credentialResponse.credential
                );
                await signinViaGoogle(decodedRes);
                navigate("/home")
            } else {
                toast.error("An error occured. Please try to login again")
            }
        } catch (e) {
            toast.error("An error occured. Please try to login again")
        }
    }

    const onGoogleLoginFailure = async () => {
        toast.error("An error occured. Please try to login again")
    }

    const handleLogin = async (username: string, password: string) => {
        const user: IUser = {username: username, password: password}
        try {
            await login(user)
            navigate("/home")
        } catch (e) {
            if (isAxiosError(e)) {
                toast.error(e.message)
            } else {
                toast.error("An error occured. Please try to login again")
            }
        }
    }
    return (
        <div>
            <Link to="/" className="flex justify-center">
                <img src={Logo} style={{width: 100, height: 100}} alt='logo'/>
            </Link>
            <h2 className="mx-0 text-white text-center text-2xl mt-[5vh] p-[15px] translate-x--1/2 translate-y--1/3">
                Log in to GuideTube
            </h2>
            <div className="p-[30px] bg-[rgba(0,0,0,.6)] box-border mx-auto rounded-[10px] " style={{width: '90%'}}>

                <LoginForm handleLogin={handleLogin}/>
                <div className="text-center mt-7 mb-7">OR</div>
                <div className="flex justify-center">
                    <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure}/>
                </div>
                <div>
                    <Link
                        dir="rtl"
                        to={"../signup"}
                        className="text-blue-400 hover:underline"
                    >
                        Don't have an account yet? Join GuideApp
                    </Link>
                </div>
            </div>
            <ToastContainer theme="dark" position="top-center" autoClose={5000} hideProgressBar={false}
                            newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover/>
        </div>
    );
};

export default LoginPage;
