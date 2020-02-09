import React, { Fragment, useState } from 'react';

import { Login, SignUp, SubContainer, Button } from '../components';


const Auth = () => {
    const [authType, setAuthType] = useState('Login');
    const [buttonText, setButtonText] = useState('Sign Up');

    const switchHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (authType === "Login") {
            setAuthType('Sign Up');
            setButtonText('Login');
        } else if (authType === "Sign Up") {
            setAuthType('Login');
            setButtonText('Sign Up')
        }
    };

    const whichComponent = (which: string) => {
        const text: { [key: string]: string } = {
            'Login': 'Got account?',
            'Sign Up': 'No account?'
        };
        return text[which];
    }

    const renderAuthComponent = () => {
        if (authType === 'Login') {
            return (<Login />)
        }
        if (authType === 'Sign Up') {
            return (<SignUp />)
        }
    };

    return (
        <Fragment>
            <SubContainer wrapper="section" externalStyle="auth-intro-text">
                <h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
            </h1>
            </SubContainer>
            <SubContainer wrapper="section" externalStyle="auth-input-area" title={authType} header="h1">
                <Fragment>
                    <div className="auth-input-holder">
                        {renderAuthComponent()}
                    </div>
                    <div className="auth-switch-holder">
                        <span>{whichComponent(buttonText)}</span> | <Button text={buttonText} handleClick={switchHandler} />
                    </div>
                </Fragment>
            </SubContainer>
        </Fragment>
    );
};

export default Auth;