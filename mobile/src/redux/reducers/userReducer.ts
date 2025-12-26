import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../apis/userApi';

interface UserState {
    id: string;
    email: string;
    firstname?: string;
    lastname?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    profile_url?: string;
    photoUrl?: string;
    seller_request_status?: string;
    store?: {
        store_name: string;
        status: string;
    };
    role: string;
}

const initialState: UserState = {
    id: '',
    email: '',
    firstname: '',
    lastname: '',
    avatar: '',
    seller_request_status: 'none',
    role: '',
};

export const getProfile = createAsyncThunk(
    'user/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userApi.getProfile();
            console.log('API Response in getProfile:', response);
            return response.data;
        } catch (error: any) {
            console.log('Error in getProfile:', error);
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
            state.userData = action.payload;
        });
    }
});

export const userReducer = userSlice.reducer;
export const { addUser, removeUser } = userSlice.actions;

export const userSelector = (state: any) => state.userReducer.userData;
