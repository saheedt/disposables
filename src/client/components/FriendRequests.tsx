import React, { FC } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DropDown, Button } from '.';
import Helper from '../utils/helper';
import { LocalStorageKeys } from '../../constants';

interface PropType {
    friendRequests?: { friendRequests: any[], newRequest: boolean }
};
const FriendRequests: FC<PropType> = ({ friendRequests }) => {


    const renderFriendRequests = () => {
        console.log('friendRequests.friendRequests: ', friendRequests.friendRequests)
        const requests = Helper.fetchLocalStorageItem(LocalStorageKeys.FRIEND_REQUESTS);
        if (requests && requests.length > 0) {
            return requests.map((item: any, index: number) => (
                <li key={`frdrqst_-_${index}`}>
                    <span>{item.userName}</span>
                    <Button externalStyle="accept">Accept</Button>
                    <Button externalStyle="reject">Reject</Button>
                </li>
            ));
        }
        return <></>;
    };

    return (
        <DropDown icon={<FontAwesomeIcon icon={['far', 'bell']}
            className={`general-icon-font ${friendRequests.newRequest ? 'new_friend_request' : ''}`} />} >
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
