import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    id: string;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}

const initialState: AuthState = {
    id: '',
    accessToken: '',
    refreshToken: '',
    expiresIn: 0,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authData: initialState,
    },
    reducers: {
        addAuth: (state, action) => {
            state.authData = action.payload;
        },

        removeAuth: (state, _action) => {
            state.authData = initialState;
        },
    },
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.authData;