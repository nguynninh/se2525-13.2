import { createSlice } from '@reduxjs/toolkit';

interface AddressState {
    selectedAddress: {
        id: string;
        name: string;
        phone: string;
        address: string;
        type: string;
        isDefault: boolean;
    } | null;
}

const initialState: AddressState = {
    selectedAddress: null,
};

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        addressData: initialState,
    },
    reducers: {
        addAddress: (state, action) => {
            state.addressData.selectedAddress = action.payload;
        },
        removeAddress: (state, _action) => {
            state.addressData.selectedAddress = null;
        },
    },
});

export const addressReducer = addressSlice.reducer;
export const { addAddress, removeAddress } = addressSlice.actions;

export const addressSelector = (state: any) => state.addressReducer.addressData.selectedAddress;
