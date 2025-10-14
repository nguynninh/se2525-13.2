import { Dimensions } from 'react-native';

export const appInfo = {
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    BASE_URL: 'http://172.16.6.15:3001/api/v1',
};
