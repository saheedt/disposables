import React, { FC, useContext, useEffect, useState } from 'react';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import Media from 'react-media';
import { useToasts } from 'react-toast-notifications';
import { Subscription } from 'rxjs';

import { ChatList, ChatPane } from '../components';

import { ClientRoutes, FrStatus, LocalStorageKeys, ToastAppearances, UserEvents } from '../../constants';
import Helper from '../utils/helper';
import { SocketContext } from '../context/socketContext';

const Chat: FC<any> = ({ match }) => {
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);
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
        clone,
        fetchLocalStorageItem,
        frMessage,
        genChatId,
        routeMediaQueries,
        addToMessageRepo
    } = Helper;
    const { CURRENT_CHAT_ID, FRIEND_LIST, FRIEND_REQUESTS, IMS, USER_DATA } = LocalStorageKeys;

    const selectChat = (friendId: string) => {
        const userData = fetchLocalStorageItem(USER_DATA);
        const chatId = genChatId(friendId, userData.data._id);
        const allIms = fetchLocalStorageItem(IMS);
        if (!allIms) {
            const newMessage: any = [{ [`${chatId}`]: [] }];
            addToLocalStorage(IMS, newMessage);
            setMessages(newMessage);
            setCurrentChat(newMessage[0][chatId]);
            setCurrentChatId(chatId);
            addToLocalStorage(CURRENT_CHAT_ID, chatId);
            setSelectedFriend(friendId);
            return;
        }
        const selected = allIms.find((item: any) => Object.keys(item)[0] === chatId);
        if (!selected) {
            const newMessage: any = { [`${chatId}`]: [] };
            const clonedMessages = clone(allIms);
            clonedMessages.push(newMessage);
            addToLocalStorage(IMS, clonedMessages);
            setMessages(newMessage);
            setCurrentChat(newMessage[chatId]);
            setCurrentChatId(chatId);
            addToLocalStorage(CURRENT_CHAT_ID, chatId);
            setSelectedFriend(friendId);
            return;
        }
        // console.log('selected chat: ', selected);
        setMessages(selected);
        setCurrentChat(selected[chatId]);
        setCurrentChatId(chatId);
        addToLocalStorage(CURRENT_CHAT_ID, chatId);
        setSelectedFriend(friendId);
    };

    useEffect(() => {
        const subscriptions: Subscription = new Subscription();
        const localUserData = fetchLocalStorageItem(USER_DATA);
        !localUserData && history.push('/');

        context.send(UserEvents.FETCH_FRIENDS_LIST, fetchLocalStorageItem(USER_DATA));

        const newFriendRequest = context.onNewFriendRequest();

        const friendRequestAccepted = context.onFriendRequestAccepted();
        const friendRequestRejected = context.onFriendRequestRejected();
        const friendRequestError = context.onFriendRequestError();
        const onFriendsList = context.onFetchFriendsListSuccess();
        const onMessage = context.onMessage();

        subscriptions.add(newFriendRequest.subscribe((details) => {
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
        }));

        subscriptions.add(friendRequestAccepted.subscribe((response) => {
            if (response.by) {
                addToast(frMessage(response.by, FrStatus.ACCEPTED), {
                    appearance: ToastAppearances.SUCCESS
                });
            }
            context.send(UserEvents.FETCH_FRIENDS_LIST, fetchLocalStorageItem(USER_DATA));
        }));

        subscriptions.add(friendRequestRejected.subscribe((response) => {
            if (response.by) {
                addToast(frMessage(response.by, FrStatus.REJECTED), {
                    appearance: ToastAppearances.ERROR
                });
            }
            context.send(UserEvents.FETCH_FRIENDS_LIST,
                fetchLocalStorageItem(USER_DATA));
        }));

        subscriptions.add(friendRequestError.subscribe((response) => {
            console.log('friend request error: ', response);
            addToast(response.message, { appearance: ToastAppearances.ERROR });
            context.send(UserEvents.FETCH_FRIENDS_LIST, fetchLocalStorageItem(USER_DATA))
        }));

        subscriptions.add(onFriendsList.subscribe((friendsList) => {
            console.log('fetched friends list: ', friendsList);
            setFriendsList(friendsList.friendsList);
            addToLocalStorage(FRIEND_LIST, friendsList.friendsList);
        }));

        subscriptions.add(onMessage.subscribe((im) => {
            console.log('incoming im: ', im);
            const chatId = genChatId(im.from, im.to);
            const localCurrentChatId = fetchLocalStorageItem(CURRENT_CHAT_ID);
            console.log('locally set currentChatId: ', localCurrentChatId);
            console.log('onMessage chatId: ', chatId);
            console.log('onMessage currentChatId: ', currentChatId);
            addToMessageRepo(im, chatId, IMS);
            if (localCurrentChatId === chatId) {
                // selectChat(im.from);
                setIncoming(im);
            }
            // setCurrentChatId(localCurrentChatId);
        }));
        return () => {
            subscriptions.unsubscribe();
        }
    }, []);

    return (
        <section className="chat-container">
            <Media query={routeMediaQueries.mobile}>
                {
                    mobile =>
                        mobile ?
                            (
                                <Switch>
                                    <Route path={`${match.url}`} render={(props) => <ChatList friendList={friendsList} selectChat={selectChat} selectedFriend={selectedFriend} {...props} />} />
                                    <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={
                                        (props) => <ChatPane chatId={currentChatId} friendRequests={friendRequests} incoming={incoming} selectedChat={currentChat} {...props} />}
                                    />
                                </Switch>
                            )
                            :
                            (
                                <>
                                    <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={(props) => <ChatList friendList={friendsList} selectChat={selectChat} selectedFriend={selectedFriend}{...props} />} />

                                    {!selectedFriend ?
                                        <section className="chat-pane-container">Reminder: Sleep is good for you..</section>
                                        :
                                        <Route path={`${match.url}${ClientRoutes.CHATPANE}`} render={
                                            (props) => <ChatPane chatId={currentChatId} friendRequests={friendRequests} incoming={incoming} selectedChat={currentChat} {...props} />}
                                        />
                                }
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