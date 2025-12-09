import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducer';
import { userReducer } from './reducers/userReducer';

import { addressReducer } from './reducers/addressReducer';

const store = configureStore({
    reducer: {
        authReducer,
        userReducer,
        addressReducer,
    },
});

export default store;
