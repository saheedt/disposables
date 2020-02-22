import React, { Fragment, useState, useContext, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { Subscription } from 'rxjs';

import { SocketContext } from '../context/socketContext';
import { Login, SignUp, SubContainer, Button } from '../components';
import Helper from '../utils/helper';

import { ClientRoutes, LocalStorageKeys } from '../../constants';

const Home = () => {
    const [authType, setAuthType] = useState('Login');
    const [buttonText, setButtonText] = useState('Sign Up');
    const context = useContext(SocketContext);
    const history = useHistory();

    const handleAuthSuccess = (userData: any) => {
        try {
            const localData = Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA);
            if (localData) {
                Helper.removeLocalStorageItem(LocalStorageKeys.USER_DATA);
            }
            const dataClone = Helper.clone(userData);
            delete dataClone.code;
            Helper.addToLocalStorage(LocalStorageKeys.USER_DATA, dataClone);
            history.push(ClientRoutes.CHAT);
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
        const subscriptions: Subscription = new Subscription();
        const localUserData = localStorage.getItem(LocalStorageKeys.USER_DATA);
        localUserData && history.push('/chat');

        const signUpSuccessObservable = context.onSIgnUpSuccess();
        const signUpErrorObservable = context.onSignUpError();

        const loginSuccessObservable = context.onLoginSuccess();
        const loginErrorObservable = context.onLoginError();
        // signup observables
        subscriptions.add(signUpSuccessObservable.subscribe(handleAuthSuccess));
        subscriptions.add(signUpErrorObservable.subscribe(handleAuthError));
        // login observables
        subscriptions.add(loginSuccessObservable.subscribe(handleAuthSuccess));
        subscriptions.add(loginErrorObservable.subscribe(handleAuthError));
        return () => {
            subscriptions.unsubscribe();
        }
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
                        <span>{whichComponent(buttonText)}</span> | <Button handleClick={switchHandler}>{buttonText}</Button>
                    </div>
                </Fragment>
            </SubContainer>
        </div>
    );
};

export default Home;