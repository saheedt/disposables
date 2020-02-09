import React, { useState } from 'react';

import { Input } from './';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // TODO: A useEffect lifecycle method,
    // watching for changes on email & password
    // to update parent component state as needed.
    return (
        <form className="login-container">
            <div className="form-item-holder">
                <Input
                    placeholder="Email"
                    label="Email"
                    type="email"
                    autoComplete="username"
                    required={true}
                    extractValue={setEmail}
                />
            </div>
            <div className="form-item-holder">
                <Input
                    placeholder="Password"
                    label="Password"
                    extractValue={setPassword}
                    autoComplete="current-password"
                    required={true}
                    type="password"
                />
            </div>
            <div className="form-item-holder">
                <Input
                    label="Login"
                    type="submit"
                />
            </div>
        </form>
    );
 };

export default Login;