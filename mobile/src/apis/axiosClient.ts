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
            token = auth.accessToken || auth.access_token;
        } catch (error) {
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
        return res;
    },
    async error => {
        const { config, response } = error;
        if (response && response.status === 401 && !config._retry) {
            config._retry = true;
            try {
                const authData = await AsyncStorage.getItem('auth');
                if (authData) {
                    const auth = JSON.parse(authData);
                    const refreshToken = auth.refreshToken;

                    if (refreshToken) {
                        const res = await axios.post('https://api.hiki.io.vn/api/auth/refresh', {
                            refreshToken
                        });

                        if (res.data && res.data.data) {
                            // Update storage with new tokens
                            const newAuthData = {
                                ...auth,
                                accessToken: res.data.data.accessToken || res.data.data.access_token,
                                // Update refreshToken if returned, otherwise keep old?? 
                                // API usually rotates refresh tokens too, but user didn't specify. 
                                // Assuming we merge whatever is returned.
                                ...res.data.data
                            };
                            await AsyncStorage.setItem('auth', JSON.stringify(newAuthData));

                            // Update header and retry
                            config.headers.Authorization = `Bearer ${res.data.data.accessToken || res.data.data.access_token}`;
                            return axiosClient(config);
                        }
                    }
                }
            } catch (err) {
                return Promise.reject(err);
            }
        }
        throw new Error(error.response?.data.message || error.message);
    },
);

export default axiosClient;
