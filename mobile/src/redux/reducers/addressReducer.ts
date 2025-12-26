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
    shippingAddresses: any[];
}

const initialState: AddressState = {
    selectedAddress: null,
    shippingAddresses: [],
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
        setAddresses: (state, action) => {
            state.addressData.shippingAddresses = action.payload;
        },
    },
});

export const addressReducer = addressSlice.reducer;
export const { addAddress, removeAddress, setAddresses } = addressSlice.actions;

export const addressSelector = (state: any) => state.addressReducer.addressData.selectedAddress;
export const listAddressSelector = (state: any) => state.addressReducer.addressData.shippingAddresses;
