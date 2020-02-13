export enum IoStatusEvents {
    CONNECTION = 'connection',
    DISCONNECT = 'disconnect',
    RECONNECT = 'reconnect'
}

export enum UserEvents {
    CREATE_USER = 'create_user',
    CREATE_USER_SUCCESS = 'create_user_success',
    CREATE_USER_ERROR = 'create_user_error',
    AUTH_USER = 'auth_user',
    AUTH_USER_SUCCESS = 'auth_user_success',
    AUTH_USER_ERROR = 'auth_user_error',
    FETCH_USER = 'fetch_user',
    ADD_USER_TO_LIST = 'add_user_to_list',
    ADD_USER_TO_LIST_SUCCESS = 'add_user_to_list_success',
    ADD_USER_TO_LIST_ERROR = 'add_user_to_list_error',
    FETCH_LIST = 'fetch_list',
    FETCH_LIST_SUCCESS = 'fetch_list_success',
    FETCH_LIST_ERROR = 'fetch_list_error',
    USER_RECONNECT_DATA = 'user_reconnect_data',
}

export enum UserErrors {
    USER_ERROR_CREDENTIALS = 'Invalid credentials supplied, please review',
    USER_ERROR_PASSWORD = 'Why password so short?, please review',
    CREATE_USER_ERROR_SERVER = 'Error creating user, try again soon',
    CREATE_USER_ERROR_DUPLICATE_EMAIL = 'Account exists for this email address',
    CREATE_USER_ERROR_DUPLICATE_USERNAME = 'Username already taken',
    AUTH_USER_ERROR_NON_EXISTENT = 'Casper?.. Account does not exist.'
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
    USER_DATA = 'dspsbl__usr'
}

export enum ClientRoutes {
    HOME = '/',
    CHAT = '/chat'
}