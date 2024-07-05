import { ChangeEvent, useState } from "react";
import { Button, TextField } from "@mui/material";
import api from "../../../api/api.tsx";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  handelLoginResponse: (response: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handelLoginResponse }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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

    return(
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
        <Button
          className="w-full"
          variant="contained"
          onClick={handleLogin}
          style={{ textTransform: 'none' }}

        >
          Log in with an email
        </Button>
      </form>
    )
}
export default LoginForm;