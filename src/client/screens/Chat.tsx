import React, { FC, useContext, useEffect, useState } from 'react';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import Media from 'react-media';

import { ChatList, ChatPane } from '../components';

import { LocalStorageKeys, ClientRoutes, UserEvents } from '../../constants';
import Helper from '../utils/helper';
import { SocketContext } from '../context/socketContext';

const Chat: FC<any> = ({ match }) => {
    const [message, setMessage] = useState('');
    const [friendRequests, setFriendRequests] = useState({
        friendRequests: [],
        newRequest: false
    });
    const [friendsList, setFriendsList] = useState([]);

    const history = useHistory();
    const context = useContext(SocketContext);
    useEffect(() => {
        const localUserData = Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA);
        !localUserData && history.push('/');

        context.send(UserEvents.FETCH_FRIENDS_LIST,
            Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA));

        const newFriendRequest = context.onNewFriendRequest();

        const onFriendRequestAccepted = context.onFriendRequestAccepted();
        const onFriendRequestError = context.onFriendRequestError();
        const onFriendsList = context.onFetchFriendsListSuccess();

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

        onFriendRequestAccepted.subscribe((response) => {
            console.log('friend request accepted: ', response);
            context.send(UserEvents.FETCH_FRIENDS_LIST,
                Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA));
        });
        /**implement toast notification for both (/\ \/) */
        onFriendRequestError.subscribe((response) => {
            console.log('friend request error: ', response);
            context.send(UserEvents.FETCH_FRIENDS_LIST, Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA))
         });

        onFriendsList.subscribe((friendsList) => {
            console.log('fetched friends list: ', friendsList);
            setFriendsList(friendsList.friendsList);
        });

    }, []);

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
                                    <Route exact path={`${match.url}`} render={(props) => <ChatList friendList={friendsList} {...props} />} />
                                </Switch>
                            )
                            :
                            (
                                <>
                                    <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={(props) => <ChatList friendList={friendsList} {...props} />} />
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