import React, { FC, useContext, useEffect, useState } from 'react';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import Media from 'react-media';
import { useToasts } from 'react-toast-notifications'

import { ChatList, ChatPane } from '../components';

import { ClientRoutes, FrStatus, LocalStorageKeys, ToastAppearances, UserEvents } from '../../constants';
import Helper from '../utils/helper';
import { SocketContext } from '../context/socketContext';

const Chat: FC<any> = ({ match }) => {
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [friendRequests, setFriendRequests] = useState({
        friendRequests: [],
        newRequest: false
    });
    const [friendsList, setFriendsList] = useState([]);
    const [incoming, setIncoming] = useState();

    const history = useHistory();
    const context = useContext(SocketContext);
    const { addToast } = useToasts();
    const {
        addToLocalStorage,
        fetchLocalStorageItem,
        frMessage,
        genChatId,
        routeMediaQueries,
        addToMessageRepo
    } = Helper;
    const { FRIEND_LIST, FRIEND_REQUESTS, IMS, USER_DATA } = LocalStorageKeys;

    useEffect(() => {
        const localUserData = fetchLocalStorageItem(USER_DATA);
        !localUserData && history.push('/');

        context.send(UserEvents.FETCH_FRIENDS_LIST, fetchLocalStorageItem(USER_DATA));

        const newFriendRequest = context.onNewFriendRequest();

        const friendRequestAccepted = context.onFriendRequestAccepted();
        const friendRequestRejected = context.onFriendRequestRejected();
        const friendRequestError = context.onFriendRequestError();
        const onFriendsList = context.onFetchFriendsListSuccess();
        const onMessage = context.onMessage();

        newFriendRequest.subscribe((details) => {
            console.log('new friend reqeust: ', details);
            const pendingRequests = fetchLocalStorageItem(FRIEND_REQUESTS);
            if (!pendingRequests) {
                const newRequest = [details];
                addToLocalStorage(FRIEND_REQUESTS, newRequest);
                setFriendRequests({ friendRequests: newRequest, newRequest: true})
                return;
            }
            pendingRequests.unshift(details);
            addToLocalStorage(FRIEND_REQUESTS, pendingRequests);
            setFriendRequests({ friendRequests: pendingRequests, newRequest: true });
            addToast(frMessage(details.userName, FrStatus.NEW), {appearance: ToastAppearances.INFO});
        });

        friendRequestAccepted.subscribe((response) => {
            console.log('friend request accepted: ', response);
            if (response.by) {
                addToast(frMessage(response.by, FrStatus.ACCEPTED), {
                    appearance: ToastAppearances.SUCCESS
                });
            }
            context.send(UserEvents.FETCH_FRIENDS_LIST, fetchLocalStorageItem(USER_DATA));
        });

        friendRequestRejected.subscribe((response) => {
            console.log('friend request rejected: ', response);
            if (response.by) {
                addToast(frMessage(response.by, FrStatus.REJECTED), {
                    appearance: ToastAppearances.ERROR
                });
            }
            context.send(UserEvents.FETCH_FRIENDS_LIST,
                fetchLocalStorageItem(USER_DATA));
        });

        friendRequestError.subscribe((response) => {
            console.log('friend request error: ', response);
            addToast(response.message, { appearance: ToastAppearances.ERROR });
            context.send(UserEvents.FETCH_FRIENDS_LIST, fetchLocalStorageItem(USER_DATA))
         });

        onFriendsList.subscribe((friendsList) => {
            console.log('fetched friends list: ', friendsList);
            setFriendsList(friendsList.friendsList);
            addToLocalStorage(FRIEND_LIST, friendsList.friendsList);
        });

        onMessage.subscribe((im) => {
            console.log('incoming im: ', im);
            const chatId = genChatId(im.from, im.to);
            console.log('onMessage chatId: ', chatId)
            addToMessageRepo(im, chatId, IMS);
            setIncoming(im);
        });
    }, []);

    const selectChat = (firstUserId: string, SecondUserId: string) => {
        const chatId = genChatId(firstUserId, SecondUserId);
        const allIms = fetchLocalStorageItem(IMS);
        if (!allIms) {
            const newMessage: any = [{ [`${chatId}`]: [] }];
            addToLocalStorage(IMS, newMessage);
            setMessages(newMessage);
            setCurrentChat(newMessage[0][chatId]);
            setCurrentChatId(chatId);
            return;
        }
        const selected = allIms.find((item: any) => Object.keys(item)[0] === chatId);
        console.log('selected chat: ', selected);
        setCurrentChat(selected[chatId]);
        setCurrentChatId(chatId);
    };

    return (
        <section className="chat-container">
            <Media query={routeMediaQueries.mobile}>
                {
                    mobile =>
                        mobile ?
                            (
                                <Switch>
                                    <Route path={`${match.url}`} render={(props) => <ChatList friendList={friendsList} selectChat={selectChat} {...props} />} />
                                    <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={
                                        (props) => <ChatPane chatId={currentChatId} friendRequests={friendRequests} incoming={incoming} selectedChat={currentChat} {...props} />}
                                    />
                                </Switch>
                            )
                            :
                            (
                                <>
                                    <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={(props) => <ChatList friendList={friendsList} selectChat={selectChat} {...props} />} />
                                    <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={
                                        (props) => <ChatPane chatId={currentChatId} friendRequests={friendRequests} incoming={incoming} selectedChat={currentChat} {...props} />}
                                    />
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