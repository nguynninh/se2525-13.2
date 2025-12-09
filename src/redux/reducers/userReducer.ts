import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../apis/userApi';

interface UserState {
    id: string;
    email: string;
    firstname?: string;
    lastname?: string;
    avatar?: string;
    seller_request_status?: string;
    store?: {
        store_name: string;
        status: string;
    };
}

const initialState: UserState = {
    id: '',
    email: '',
    firstname: '',
    lastname: '',
    avatar: '',
    seller_request_status: 'none'
};

export const getProfile = createAsyncThunk(
    'user/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userApi.getProfile();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

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
    extraReducers: (builder) => {
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.userData = action.payload.data.user;
        });
    }
});

export const userReducer = userSlice.reducer;
export const { addUser, removeUser } = userSlice.actions;

export const userSelector = (state: any) => state.userReducer.userData;
