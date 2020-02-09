import React, { useState } from 'react';

import { Input } from './'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(false);

    const isPasswordMatch = (incoming: string): void => {
        setPasswordMatch(password === incoming);
    };
    // TODO: A useEffect lifecycle method,
    // watching for changes on email & password
    // to update parent component state as needed.
    // Also implement a <span> to announce password
    // match status.
    return (
        <form className="signup-container">
            <div className="form-item-holder">
                <Input
                    placeholder="Email"
                    label="Email"
                    type="email"
                    autoComplete="username"
                    extractValue={setEmail}
                    required={true}
                />
            </div>
            <div className="form-item-holder">
                <Input
                    placeholder="Password"
                    label="Password"
                    extractValue={setPassword}
                    autoComplete="new-password"
                    required={true}
                    minLength={6}
                    type="password"
                />
            </div>
            <div className="form-item-holder">
                <Input
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    extractValue={isPasswordMatch}
                    autoComplete="new-password"
                    required={true}
                    minLength={6}
                    type="password"
                />
            </div>
            <div className="form-item-holder">
                <Input
                    label="Sign Up"
                    type="submit"
                    disabled={!passwordMatch}
                />
            </div>
        </form>
    );
};

export default SignUp;