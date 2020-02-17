import React, { FC, useContext, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DropDown, Button } from '.';
import Helper from '../utils/helper';
import { LocalStorageKeys, UserEvents } from '../../constants';
import { SocketContext } from '../context/socketContext';

interface PropType {
    newFriendRequests?: { friendRequests: any[], newRequest: boolean }
};
const FriendRequests: FC<PropType> = ({ newFriendRequests }) => {
    const [allRequests, setAllRequests] = useState([])
    const [visualNotification, setVisualNotification] = useState(false);
    const context = useContext(SocketContext);

    const acceptRequest = (friendId: string) => {
        const data = {
            friendId,
            userData: Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA)
        };
        context.send(UserEvents.ACCEPT_FRIEND_REQUEST, data);
        const requests = Helper.fetchLocalStorageItem(LocalStorageKeys.FRIEND_REQUESTS);
        const rest = requests.filter((request: any) => request.friendId !== friendId);
        Helper.addToLocalStorage(LocalStorageKeys.FRIEND_REQUESTS, rest);
        setAllRequests(rest);
        setVisualNotification(!visualNotification);
    };

    useEffect(() => {
        console.log('fetching friend requests...')
        const onFriendRequestsFetch = context.onFetchFriendRequestsSuccess();

        context.send(UserEvents.FETCH_FRIEND_REQUESTS,
            Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA));

        onFriendRequestsFetch.subscribe((requests) => {
            setAllRequests(requests);
         });
    }, []);

    useEffect(() => {
        if (newFriendRequests.friendRequests.length > 0) {
            const requests = Helper.fetchLocalStorageItem(LocalStorageKeys.FRIEND_REQUESTS);
            setAllRequests(requests);
            setVisualNotification(newFriendRequests.newRequest);
        };
    }, [newFriendRequests.friendRequests]);

    const renderFriendRequests = () => {
        console.log('newFriendRequests.friendRequests: ', newFriendRequests.friendRequests)
        const requests = allRequests;
            // Helper.fetchLocalStorageItem(LocalStorageKeys.FRIEND_REQUESTS);
        if (requests && requests.length > 0) {
            return requests.map((item: any, index: number) => (
                <li key={`frdrqst_-_${index}`}>
                    <span>{item.userName}</span>
                    <Button externalStyle="accept" handleClick={() => acceptRequest(item.friendId)}>
                        Accept
                    </Button>
                    <Button externalStyle="reject">
                        Reject
                    </Button>
                </li>
            ));
        }
        return <></>;
    };

    return (
        <DropDown icon={<FontAwesomeIcon icon="bell"
            className={`general-icon-font ${visualNotification ? 'new_friend_request' : ''}`} />} >
            <div className="friend-requests-holder">
                <h1>Friend Requests</h1>
                <ul>
                    {renderFriendRequests()}
                </ul>
            </div>
        </DropDown>
    );
};

export default FriendRequests;
