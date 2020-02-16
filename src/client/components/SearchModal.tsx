import React, { useState, useContext } from 'react';
import Modal from 'react-modal';

import { Subject, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';

import { SocketContext } from '../context/socketContext';

import { Button, Input } from './';
import Helper from '../utils/helper';
import { LocalStorageKeys, UserEvents } from '../../constants';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        margin: 'auto',
        width: '70%',
        height: '50%',
        backgroundColor: '#edf2f7',
        maxWidth: '40rem',
    }
};

const SearchModal = ({ isOpen, toggleModal}: any) => {
    Modal.setAppElement(document.getElementById('disposable'));
    const [response, setResponse] = useState([]);
    const currentUser = Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA);
    const [cachedTerm, setCachedTerm] = useState('');
    const searchTerm = new Subject<string>();
    const context = useContext(SocketContext);

    searchTerm.pipe(debounce(() => interval(800)))
        .subscribe((term) => {
            console.log(term)
            context.send('user_search', {
                user_id: currentUser.data._id,
                searchTerm: term
            });
        });

    const searchResponse = context.onUserSearchResponse();
    searchResponse.subscribe((response) => {
        setResponse(response.response);
    });

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        searchHandler(cachedTerm);
    };

    const searchHandler = (term: string) => {
        setCachedTerm(term);
        searchTerm.next(term);
    };

    const sendFriendRequest = (userId: string) => () => {
        const data = {
            friendId: userId,
            requestInitiator: Helper.fetchLocalStorageItem(LocalStorageKeys.USER_DATA)
        };
        context.send(UserEvents.SEND_FRIEND_REQUEST, data);
        toggleModal();
    };

    const renderResponse = (response: any[]) => {
        return response.map((item, index: number) => (
            <li key={`${index}_usr_search`} className="search-modal-result-item">
                <span>{item.userName}</span>
                <Button text="Add" handleClick={sendFriendRequest(item._id)}/>
            </li>
        ));
    };

    return (
        <Modal
            isOpen={isOpen} onRequestClose={toggleModal}
            contentLabel="Add Friend Modal" style={customStyles}>
            <div className="search-modal-container">
                <h1>Search Friend</h1>
                <div className="search-modal-input-holder">
                    <form onSubmit={onSubmitHandler}>
                        <Input
                            label="Search friend new friend by username"
                            placeholder="Search friend"
                            extractValue={searchHandler}
                        />
                    </form>

                </div>
                <div className="search-modal-result-holder">
                    <ul>
                        {
                            response.length > 0 ?
                                renderResponse(response)
                            :
                                null
                        }
                    </ul>
                </div>
            </div>
        </Modal>
    );
};

export default SearchModal;
