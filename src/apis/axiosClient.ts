import axios from 'axios';
import queryString from 'query-string';
import { appInfo } from '../constants/appInfos';

import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosClient = axios.create({
    baseURL: appInfo.BASE_URL,
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
    const authData = await AsyncStorage.getItem('auth');
    let token = '';

    if (authData) {
        try {
            const auth = JSON.parse(authData);
            token = auth.access_token;
        } catch (error) {
            // If parse fails, it might be just the email string (based on LoginScreen logic), so valid token is missing
            console.log('Error parsing auth data', error);
        }
    }

    config.headers = {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: 'application/json',
        ...config.headers,
    };

    config.data;
    return config;
});

axiosClient.interceptors.response.use(
    res => {
        if (res.data && res.status < 400) {
            return res.data;
        }
        throw new Error('Error');
    },
    error => {
        throw new Error(error.response?.data.message || error.message);
    },
);

export default axiosClient;
