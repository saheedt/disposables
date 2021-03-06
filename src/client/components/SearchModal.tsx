import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';

import { Subject, interval, Subscription } from 'rxjs';
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

const SearchModal = ({ isOpen, toggleModal }: any) => {
    Modal.setAppElement(document.getElementById('disposable'));
    const { fetchLocalStorageItem } = Helper;
    const { FRIEND_LIST } = LocalStorageKeys;
    const [response, setResponse] = useState([]);
    const currentUser = fetchLocalStorageItem(LocalStorageKeys.USER_DATA);
    const [cachedTerm, setCachedTerm] = useState('');
    const [clearInput, setClearInput] = useState('');
    let searchTerm: Subject<string> = new Subject<string>();
    const context = useContext(SocketContext);

    useEffect(() => {
        const subscriptions: Subscription = new Subscription();
        const searchResponse = context.onUserSearchResponse();
        subscriptions.add(searchResponse.subscribe((response) => {
            setResponse(response.response);
        }));

        return () => {
            subscriptions.unsubscribe();
            searchTerm.next();
            searchTerm.complete();
        }
    }, []);

    searchTerm.pipe(debounce(() => interval(800)))
        .subscribe((term) => {
            context.send('user_search', {
                user_id: currentUser.data._id,
                searchTerm: term
            });
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
            requestInitiator: fetchLocalStorageItem(LocalStorageKeys.USER_DATA)
        };
        context.send(UserEvents.SEND_FRIEND_REQUEST, data);
        setClearInput(uuidv4());
        setResponse([]);
        toggleModal();
    };

    const renderResponse = (response: any[]) => {
        console.log('chat response:', response);
        const friendsList = fetchLocalStorageItem(FRIEND_LIST);
        return response.map((item, index: number) => {
            const alreadyAdded = friendsList.find((friend: any) => friend._id === item._id);
            return (
                <li key={`${index}_usr_search`} className="search-modal-result-item">
                    <span>{item.userName}</span>
                    <Button handleClick={sendFriendRequest(item._id)} disabled={alreadyAdded ? true: false}>
                        Add
                    </Button>
                </li>
            )
        });
    };

    return (
        <Modal
            isOpen={isOpen} onRequestClose={() => { setResponse([]); toggleModal(); }}
            contentLabel="Add Friend Modal" style={customStyles}>
            <div className="search-modal-container">
                <h1>Search Friend</h1>
                <div className="search-modal-input-holder">
                    <form onSubmit={onSubmitHandler}>
                        <Input
                            clear={clearInput}
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
