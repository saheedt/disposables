export enum IoStatusEvents {
    CONNECTION = 'connection',
    DISCONNECT = 'disconnect',
    RECONNECT = 'reconnect',
}


export enum UserEvents {
    CREATE_USER = 'create_user',
    CREATE_USER_SUCCESS = 'create_user_success',
    CREATE_USER_ERROR = 'create_user_error',
    AUTH_USER = 'auth_user',
    AUTH_USER_SUCCESS = 'auth_user_success',
    AUTH_USER_ERROR = 'auth_user_error',
    FETCH_USER = 'fetch_user',
    // ADD_USER_TO_LIST = 'add_user_to_list',
    // ADD_USER_TO_LIST_SUCCESS = 'add_user_to_list_success',
    // ADD_USER_TO_LIST_ERROR = 'add_user_to_list_error',
    FETCH_FRIENDS_LIST = 'fetch_friendslist',
    FETCH_FRIENDS_LIST_SUCCESS = 'fetch_friends_list_success',
    FETCH_FRIENDS_LIST_ERROR = 'fetch_friends_list_error',
    USER_RECONNECT_DATA = 'user_reconnect_data',
    USER_UNAUTHORIZED = 'user_unauthorized',
    USER_AUTHORIZED = 'user_authorized',
    USER_SOCKET_SYNC_SUCCESS = 'user_socket_sync_success',
    USER_SOCKET_SYNC_ERROR = 'user_socket_sync_error',
    USER_SEARCH = 'user_search',
    USER_SEARCH_RESPONSE = 'user_search_response',
    SEND_FRIEND_REQUEST = 'send_friend_request',
    FRIEND_REQUEST_ERROR = 'friend_request_error',
    NEW_FRIEND_REQUEST = 'new_friend_request',
    FETCH_FRIEND_REQUESTS = 'fetch_friend_requests'
}

export enum UserErrorMesssages {
    USER_ERROR_CREDENTIALS = 'Invalid credentials supplied, please review',
    USER_ERROR_PASSWORD = 'Why password so short?, please review',
    CREATE_USER_ERROR_SERVER = 'Error creating user, try again soon',
    CREATE_USER_ERROR_DUPLICATE_EMAIL = 'Account exists for this email address',
    CREATE_USER_ERROR_DUPLICATE_USERNAME = 'Username already taken',
    AUTH_USER_ERROR_NON_EXISTENT = 'Casper?.. Account does not exist.',
    AUTH_INVALID_TOKEN = 'Invalid token',
    USER_UNAUTHORIZED = 'User unauthorized to perform action'
}

export enum StatusCodes {
    OK = 200,
    CREATED = 201,
    FOUND = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

export enum ChatEvents {
    MESSAGE = 'message'
}

export enum FormInputAsButton {
    SUBMIT = 'submit',
    BUTTON = 'button'
}

export enum DbCollections {
    users = 'users'
}

export enum LocalStorageKeys {
    USER_DATA = 'dspsbl__usr',
    FRIEND_REQUESTS = 'dspsbl__frndreqs'
}

export enum ClientRoutes {
    HOME = '/',
    CHAT = '/chat',
    CHATPANE = '/pane'
}