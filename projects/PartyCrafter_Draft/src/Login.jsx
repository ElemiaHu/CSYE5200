import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";

function Login({ onLogin, error }) {
    const [ username, setUsername ] = useState('');

    return (
        <div className="login-container">
            Please enter your username to login.
            <div>
                <input type="text" placeholder="Enter Username" 
                value={username} onInput={(e) => setUsername(e.target.value)}/>
                <Button onClick={() => {
                    onLogin(username);
                    setUsername('');
                }} variant="btn btn-outline-primary">Login</Button>
            </div>
            <div>{error}</div>
        </div>
    )
}

export default Login;