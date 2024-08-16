import React, {ChangeEvent, useState} from "react";
import {Button, TextField} from "@mui/material";


interface LoginFormProps {
    handleLogin: (username: string, password: string) => void
}

const LoginForm: React.FC<LoginFormProps> = ({handleLogin}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
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
                variant="contained"
                onClick={() => handleLogin(username, password)}
                style={{textTransform: 'none'}}

            >
                Log in
            </Button>
        </form>
    )
}
export default LoginForm;