
import { useAuthenticationDispatch } from "../../../store/hook/useAuthentication.ts";
import { Link, useNavigate } from "react-router-dom";
import { useUserDataDispatch } from "../../../store/hook/useUserData.ts";
import { AxiosResponse } from "axios";
import Logo from '../../../assets/white_guidetube.png'
import LoginForm from "./LoginForm.tsx";
import GoogleLoginButton from "./GoogleLoginButton.tsx";
const LoginPage = () => {

  const userDataDispatch = useUserDataDispatch();
  const authenticationDispatch = useAuthenticationDispatch();
  const navigate = useNavigate();
  
  const handelLoginResponse = (response: AxiosResponse) => {
    const userData = response.data.userData;
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    userDataDispatch({
      type: "set-userData",
      payload: {
        userId: userData._id,
        fullName: userData.fullName,
        imagePath: import.meta.env.VITE_SERVER + "/" + userData.picture,
      },
    });

    // Store the token in localStorage
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Update the authentication status
    authenticationDispatch({ type: "set-isAuthenticated", payload: true });

    navigate("/home");
  };

  return (
    <div>
      <Link to="/" className="flex justify-center">
        <img src={Logo} style={{ width: 100, height: 100 }} />
      </Link>
      <h2 className="mt-0 mx-0 p-0 text-white text-center text-2xl mt-[5vh] p-[15px] translate-x--1/2 translate-y--1/3">
        Log in to GuideTube
      </h2>
      <div className="p-[30px] bg-[rgba(0,0,0,.6)] box-border mx-auto rounded-[10px] " style={{ width: '90%' }}>
        <GoogleLoginButton handelLoginResponse={handelLoginResponse} />
        <LoginForm handelLoginResponse={handelLoginResponse} />
        <div className="text-center mt-7 mb-7">OR</div>
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
    </div>
  );

};

export default LoginPage;
