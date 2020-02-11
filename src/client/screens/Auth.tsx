import React, { Fragment, useState, useContext, useEffect } from 'react';

import { SocketContext } from '../context/socketContext';
import { Login, SignUp, SubContainer, Button } from '../components';


const Auth = () => {
    const [authType, setAuthType] = useState('Login');
    const [buttonText, setButtonText] = useState('Sign Up');

    const context = useContext(SocketContext);

    useEffect(() => {
        const successObservable = context.onSIgnUpSuccess();
        const errorObservable = context.onSignUpError();
        successObservable.subscribe((userData: any) => {
            console.log('Al hamdulillah, we are now here..', userData);
        });
        errorObservable.subscribe((error: any) => {
            console.log('Error user: ', error);
        })

    }, []);
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
        console.log('auth context', context);
        if (authType === 'Login') {
            return (<Login doLogin={(event: string, data: any) => context.send(event, data) }/>)
        }
        if (authType === 'Sign Up') {
            return (<SignUp doSignUp={(event: string, data: any) => context.send(event, data)}/>)
        }
    };

    return (
        <div className="auth-wrapper">
            <SubContainer wrapper="section" externalStyle="auth-intro-text">
                <h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>
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
        </div>
    );
};

export default Auth;