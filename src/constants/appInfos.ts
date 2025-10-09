import { Dimensions } from 'react-native';

export const appInfo = {
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    BASE_URL: 'https://api.test-demo-app.com',
};