import { ChangeEvent, useState } from "react";
import { useAuthenticationDispatch } from "../../store/hook/useAuthentication.ts";
import { Link, redirect, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { useUserDataDispatch } from "../../store/hook/useUserData.ts";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from "jwt-decode";
import api from "../../api/api.tsx";
import { AxiosResponse } from "axios";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const userDataDispatch = useUserDataDispatch();
    const authenticationDispatch = useAuthenticationDispatch();
    const navigate = useNavigate();

    const handelGoogleLogin = async (credentials: JwtPayload) => {
        try {
            // Send a POST request to your backend login endpoint
            const response = await api.post(
                import.meta.env.VITE_SERVER_GOOGLE_LOGIN_PATH,
                { credentials },
                { headers: { "Content-Type": "application/json" } }
            );
            handelLoginResponse(response);
        } catch (error) {
            if (error instanceof Error) {
                navigate("error");
                throw Error(`Login failed: ${error.message}`);
            }
        }
    };

    const handleLogin = async () => {
        try {
            // Send a POST request to your backend login endpoint
            const response = await api.post(
                import.meta.env.VITE_SERVER_LOGIN_PATH,
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            handelLoginResponse(response);
        } catch (error) {
            if (error instanceof Error) {
                navigate("error");
                throw Error(`Login failed: ${error.message}`);
            }
        }
    };

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

        navigate("/dashboard");
    };

    const handelIconClick = () => {
        navigate("/");
    };

    return (
        <div>
          <div>
            <button
              onClick={handelIconClick}
              className="bg-blue-500 mt-4 ml-3 text-white py-2 px-4 rounded-lg"
            >
              GuideTube
            </button>
          </div>
          <div>
            <h2 className="mt-0 mx-0 p-0 text-white text-center text-2xl mt-[5vh] p-[15px] translate-x--1/2 translate-y--1/3">
              Log in to GuideTube
            </h2>
          </div>
          <div className="p-[30px] bg-[rgba(0,0,0,.6)] box-border mx-auto rounded-[10px]" style={{ width: '90%'}}>
            <div  className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    const decodedRes = jwtDecode(
                      credentialResponse.credential
                    );
                    handelGoogleLogin(decodedRes);
                  } else redirect("error");
                }}
                onError={() => {
                  console.log("login failed");
                }}
              />
            </div>
            
            <div className="text-center mt-7 mb-7">OR</div>
      
            <form className="flex justify-center items-center flex-col gap-6">
              <TextField
                className="w-full"
                label="Username"
                variant="outlined"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setUsername(event.target.value);
                }}
              />
              <TextField
                className="w-full"
                label="Password"
                type="password"
                autoComplete="current-password"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value);
                }}
              />
      
              <Link
                dir="rtl"
                to={"../signup"}
                className="text-blue-400 hover:underline"
              >
                Forget your password?
              </Link>
              <Button
                className="w-full"
                variant="contained"
                onClick={handleLogin}
                style={{ textTransform: 'none' }}

              >
                Log in with an email
              </Button>
      
              <Link
                dir="rtl"
                to={"../signup"}
                className="text-blue-400 hover:underline"
              >
                Don't have an account yet? Join GuideApp
              </Link>
            </form>
          </div>
        </div>
      );
      
};

export default LoginPage;
