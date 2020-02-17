import React, { FC, useContext, useEffect, useState } from 'react';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import Media from 'react-media';

import { ChatList, ChatPane } from '../components';

import { LocalStorageKeys, ClientRoutes } from '../../constants';
import Helper from '../utils/helper';
import { SocketContext } from '../context/socketContext';

const Chat: FC<any> = ({ match }) => {
    const [message, setMessage] = useState('');
    const [friendRequests, setFriendRequests] = useState({
        friendRequests: [],
        newRequest: false
    });
    const history = useHistory();
    const context = useContext(SocketContext);
    useEffect(() => {
        const localUserData = Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA);
        !localUserData && history.push('/');

        const newFriendRequest = context.onNewFriendRequest();

        newFriendRequest.subscribe((details) => {
            console.log('new friend reqeust: ', details);
            const pendingRequests = Helper.fetchLocalStorageItem(LocalStorageKeys.FRIEND_REQUESTS);
            if (!pendingRequests) {
                const newRequest = [details];
                Helper.addToLocalStorage(LocalStorageKeys.FRIEND_REQUESTS, newRequest);
                setFriendRequests({ friendRequests: newRequest, newRequest: true})
                return;
            }
            pendingRequests.unshift(details);
            Helper.addToLocalStorage(LocalStorageKeys.FRIEND_REQUESTS, pendingRequests);
            setFriendRequests({ friendRequests: pendingRequests, newRequest: true })
        });
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
                                    <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={
                                        (props) => <ChatPane incomingMessage={null} messageHistory={null} friendRequests={friendRequests} {...props} />
                                    } />
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