import React, { Fragment, useState, useContext, useEffect } from 'react';

import { SocketContext } from '../context/socketContext';
import { Login, SignUp, SubContainer, Button } from '../components';
import Helper from '../utils/helper';

import { LocalStorageKeys } from '../../constants';

const Auth = () => {
    const [authType, setAuthType] = useState('Login');
    const [buttonText, setButtonText] = useState('Sign Up');
    const context = useContext(SocketContext);

    const handleAuthSuccess = (userData: any) => {
        console.log('Al hamdulillah, we are now here..', userData);
        try {
            const localData = localStorage.getItem(LocalStorageKeys.USER_DATA);
            if (localData) {
                localStorage.removeItem(LocalStorageKeys.USER_DATA);
            }
            const dataClone = Helper.clone(userData);
            delete dataClone.code;
            localStorage.setItem(LocalStorageKeys.USER_DATA, JSON.stringify(dataClone));
            // implement routing here
        } catch (error) {
            // Temporarily log error, but should implement
            // error notification and not route away from page.
            console.error('Error: ', error);
        }
    };
    const handleAuthError = (error: any) => {
        // Temporarily log error, but should implement
        // error notification and not route away from page.
        console.error('Error user: ', error);
    };
    useEffect(() => {
        const signUpSuccessObservable = context.onSIgnUpSuccess();
        const signUpErrorObservable = context.onSignUpError();

        const loginSuccessObservable = context.onLoginSuccess();
        const loginErrorObservable = context.onLoginError();
        // signup observables
        signUpSuccessObservable.subscribe(handleAuthSuccess);
        signUpErrorObservable.subscribe(handleAuthError);
        // login observables
        loginSuccessObservable.subscribe(handleAuthSuccess);
        loginErrorObservable.subscribe(handleAuthError);


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