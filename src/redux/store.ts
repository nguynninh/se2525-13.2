import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducer';
import { userReducer } from './reducers/userReducer';

import { addressReducer } from './reducers/addressReducer';
import { cartReducer } from './reducers/cartReducer';

const store = configureStore({
    reducer: {
        authReducer,
        userReducer,
        addressReducer,
        cartReducer,
    },
});

export default store;
