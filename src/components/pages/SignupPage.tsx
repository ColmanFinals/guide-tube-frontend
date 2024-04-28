import React, { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import api from "../../api/api";
import axios from "axios";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Validate username and password
      if (username.length < 5 || password.length < 5) {
        setError("Username and password must be at least 5 characters long.");
        return;
      }

      // Send a POST request to your backend login endpoint
      const response = await api.post(
        import.meta.env.VITE_SERVER_SIGNUP_PATH,
        { username, password, fullName },
        { headers: { "Content-Type": "application/json" } }
      );

      // Optionally, handle the response from the backend (e.g., show a success message)
      console.log(response.data);

      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error (error from the server)
        const serverError = error.response?.data?.error || "Unknown error occurred.";
        setError(serverError);
      } else if (error instanceof Error) {
        // Other errors
        setError(`Signup failed: ${error.message}`);
      }
    }
  };
  const handelIconClick = () => {
    navigate("/");
  };
  return (
    <div>
      <div>
          <button
              onClick={handelIconClick}
              className="bg-blue-500 mt-4 ml-3 text-white py-2 px-4 rounded-lg">
                GuideTube
          </button>
      </div>
      <div className="mb-5">
          <h2 className="mt-0 mx-0 p-0 text-white text-center text-2xl mt-[5vh] p-[15px] translate-x--1/2 translate-y--1/3">
              Join to GuideTube
          </h2>
          <h3 className="text-center">Create and share videos in seconds.</h3>
          
      </div>

      <div className="p-[30px] bg-[rgba(0,0,0,.6)] box-border m-auto rounded-[10px]">
        
        <form className="flex justify-center items-center flex-col gap-6">
          <TextField
            className="w-[400px]"
            label="Full Name"
            variant="outlined"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setFullName(event.target.value);
            }}
          />
          <TextField
            className="w-[400px]"
            label="Username"
            variant="outlined"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setUsername(event.target.value);
            }}
          />
          <TextField
            className="w-[400px]"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
          {error && <p className="text-red-700">{error}</p>}
          <Button className="w-[200px]" variant="contained" onClick={handleSignup}>
            הרשם
          </Button>
          <Link
              dir="rtl"
              to={"../login"}
              className="text-blue-400 hover:underline"
          >
              Already have an account? Log in
          </Link>
          <span className="text-center">
            By joining GuidApp, you agree to our Terms of Service, Privacy Policy and Cookie Policy
          </span>
        </form>
      </div>
    </div>
    
  );
};

export default SignupPage;
