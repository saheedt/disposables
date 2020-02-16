import React, { FC, Fragment, useEffect, useState } from 'react';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import Media from 'react-media';

import { ChatList, ChatPane } from '../components';

import { LocalStorageKeys, ClientRoutes } from '../../constants';
import Helper from '../utils/helper';

const Chat: FC<any> = ({ match }) => {
    const [message, setMessage] = useState('');
    const history = useHistory();
    useEffect(() => {
        const localUserData = localStorage.getItem(LocalStorageKeys.USER_DATA);
        !localUserData && history.push('/');
    }, []);
    const dummyFriendList = [
        { userName: 'aubama-bloodclot-yang' },
        { userName: 'Lacazette' },
        { userName: 'Hectizee' },
        { userName: 'M10Mesut' },
        { userName: 'kolasinac' },
    ];

    // const handleItemCLick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    //     event.preventDefault();
    //     setChatView(!chatView);
    // };

    return (
        <section className="chat-container">
            <Media query={Helper.routeMediaQueries.mobile}>
                {
                    mobile =>
                        mobile ?
                            (
                                <Switch>
                                    <Route
                                        exact
                                        path={`${match.url}${ClientRoutes.CHATPANE}`}
                                        render={(props) => <ChatPane incomingMessage={null} messageHistory={null} {...props} /> }
                                    />
                                    <Route exact path={`${match.url}`} render={(props) => <ChatList friendList={dummyFriendList} {...props} />} />
                                </Switch>
                            )
                            :
                            (
                                <>
                                    <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={(props) => <ChatList friendList={dummyFriendList} {...props} />} />
                                    <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={ (props) => <ChatPane incomingMessage={null} messageHistory={null} {...props} /> } />
                                    <Redirect from={`${match.url}`} to={`${match.url}${ClientRoutes.CHATPANE}`} />
                                </>
                            )

                }
            </Media>
        </section>
    );
 };

export default Chat;


/**
 * const timeCreated = new Date();
 * const timeCreatedUtc = timeCreated.toISOString();
 * const tz = timeCreated.getTimezoneOffset();
 * const sign = tz > 0 ? '-': '+';
 * const tzOffsetHr = (Math.floor(Math.abs(tz)/60);
 * const tzOffsetMin = (Math.abs(tz)%60);
 * const tzOffset = sign + hours + ":" + minutes;
 */