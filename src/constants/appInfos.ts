import { Dimensions } from 'react-native';

export const appInfo = {
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    BASE_URL: 'http://192.168.0.101:3001/api/v1',
};