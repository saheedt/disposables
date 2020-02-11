import React, { useState, FC } from 'react';

import { UserEvents } from '../../constants';

import { Input } from './'

interface PropType {
    doSignUp(event: string, data: any): void
}
const SignUp: FC<PropType> = ({ doSignUp }) => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(false);

    const isPasswordMatch = (incoming: string): void => {
        setPasswordMatch(password === incoming);
    };

    const signUp = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const userDetails = { email, userName, password };
        doSignUp(UserEvents.CREATE_USER, userDetails);
    };
    // TODO:
    // Implement a <span> to announce password
    // match status.
    return (
        <form className="signup-container" onSubmit={signUp}>
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
                    placeholder="Username"
                    label="Username"
                    type="text"
                    autoComplete="username"
                    extractValue={setUserName}
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