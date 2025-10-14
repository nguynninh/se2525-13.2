import { Dimensions } from 'react-native';
import { BASE_URL, PRODUCTION, EMVIRONMENT } from '@env';

export const appInfo = {
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    BASE_URL: EMVIRONMENT === 'dev' ? BASE_URL : PRODUCTION,
};
