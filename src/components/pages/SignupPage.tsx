import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import api from "../../services/api";
import Logo from '../../assets/white_guidetube.png'

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      if (username.length < 5 || password.length < 5) {
        setError("Username and password must be at least 5 characters long.");
        return;
      }

      const response = await api.post(
        import.meta.env.VITE_SERVER_SIGNUP_PATH,
        { username, password, fullName },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data);

      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data?.error || "Unknown error occurred.";
        setError(serverError);
      } else if (error instanceof Error) {
        setError(`Signup failed: ${error.message}`);
      }
    }
  };



  return (
    <div>
        <Link to="/" className="flex justify-center">
          <img src={Logo} style={{width: 100, height: 100}}/>
        </Link>
      <div className="mb-5">
        <h2 className="mt-0 mx-0 p-0 text-white text-center text-2xl mt-[5vh] p-[15px] translate-x--1/2 translate-y--1/3">
          Join to GuideTube
        </h2>
        <h3 className="text-center">Create and share videos in seconds.</h3>
      </div>

      <div className="p-[30px] bg-[rgba(0,0,0,.6)] box-border mx-auto rounded-[10px]" style={{ width: '90%' }}>
        <form className="flex justify-center items-center flex-col gap-6">
          <TextField
            className="w-full md:w-96"
            label="Full Name"
            variant="outlined"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setFullName(event.target.value);
            }}
          />
          <TextField
            className="w-full md:w-96"
            label="Username"
            variant="outlined"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setUsername(event.target.value);
            }}
          />
          <TextField
            className="w-full md:w-96"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
          {error && <p className="text-red-700">{error}</p>}
          <Button
            className="w-full md:w-48"
            variant="contained"
            onClick={handleSignup}
            style={{ textTransform: 'none' }}

          >
            Sign up
          </Button>
          <Link
            dir="rtl"
            to={"../login"}
            className="text-blue-400 hover:underline"
          >
            Already have an account? Log in
          </Link>
          <span className="text-center">
            By joining GuideApp, you agree to our Terms of Service, Privacy Policy and Cookie Policy
          </span>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
