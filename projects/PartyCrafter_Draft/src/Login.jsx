import React from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function Login({ onLogin, error }) {
    const [ username, setUsername ] = useState('');

    return (
        <div className="login-container">

            <div className="title">Party Crafter</div>

            <Form className="login-form">
                <Form.Group className="mb-3 mt-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter Username" className="input"
                        value={username} onInput={(e) => setUsername(e.target.value)}/>
                </Form.Group>
                <Button onClick={() => {
                    onLogin(username);
                    setUsername('');
                }} variant="btn btn-outline-primary">Login</Button>
            </Form>
        </div>
    )
}

export default Login;