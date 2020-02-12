import React, { useState, FC } from 'react';

import { Input } from './';

import { UserEvents } from '../../constants';

interface PropType {
    doLogin: Function
}

const Login: FC<PropType> = ({ doLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const loginDetails = { email, password };
        doLogin(UserEvents.AUTH_USER, loginDetails);
    };
    return (
        <form className="login-container" onSubmit={login}>
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