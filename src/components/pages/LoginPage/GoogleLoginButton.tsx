import { redirect } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";
import api from "../../../api/api.tsx";
import { useNavigate } from "react-router-dom";

interface GoogleLoginButtonProps {
    handelLoginResponse: (response: any) => void;
  }

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ handelLoginResponse }) => {
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
    return(
        <div className="flex justify-center p-2">
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
    )
}

export default GoogleLoginButton;