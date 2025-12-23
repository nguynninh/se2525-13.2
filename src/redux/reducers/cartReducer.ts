import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../apis/cartApi';

interface CartItem {
    id: string;
    product_id: string;
    variant_id: string | null;
    quantity: number;
    product?: any;
    variant?: any;
}

interface CartState {
    items: CartItem[];
    loading: boolean;
    error: any;
}

const initialState: CartState = {
    items: [],
    loading: false,
    error: null,
};

export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartApi.handleCart('/', null, 'get');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (data: { product_id: string; variant_id?: string; quantity: number }, { rejectWithValue, dispatch }) => {
        try {
            const response = await cartApi.handleCart('/add-to-cart', data, 'post');
            dispatch(getCart());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async (data: { id: string; quantity: number }, { rejectWithValue, dispatch }) => {
        try {
            await cartApi.handleCart('/update-item', data, 'put');
            dispatch(getCart());
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            await cartApi.handleCart('/remove-item', { id }, 'delete');
            dispatch(getCart());
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        syncCart: (state, action) => {
            state.items = action.payload;
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCart.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCart.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload?.items || [];
        });
        builder.addCase(getCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const cartReducer = cartSlice.reducer;
export const { syncCart, clearCart } = cartSlice.actions;

export const cartSelector = (state: any) => state.cartReducer.items;
export const cartTotalSelector = (state: any) => state.cartReducer.items.reduce((total: number, item: any) => total + (item.variant?.price || item.product?.price || 0) * item.quantity, 0);
export const cartCountSelector = (state: any) => state.cartReducer.items.reduce((total: number, item: any) => total + item.quantity, 0);
