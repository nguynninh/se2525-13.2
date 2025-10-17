import { createSlice } from '@reduxjs/toolkit';

interface UserState {
    id: string;
    email: string;
    firstname?: string;
    lastname?: string;
    photoUrl?: string;
}

const initialState: UserState = {
    id: '',
    email: '',
    firstname: '',
    lastname: '',
    photoUrl: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: initialState,
    },
    reducers: {
        addUser: (state, action) => {
            state.userData = action.payload;
        },

        removeUser: (state, _action) => {
            state.userData = initialState;
        },
    },
});

export const userReducer = userSlice.reducer;
export const { addUser, removeUser } = userSlice.actions;

export const userSelector = (state: any) => state.userReducer.userData;
