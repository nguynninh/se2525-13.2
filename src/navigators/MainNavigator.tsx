import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import { useDispatch } from 'react-redux';
import handleAPI from '../apis/handleApi';
import { useTranslation } from 'react-i18next';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  const {t} = useTranslation('common');
  const dispatch = useDispatch();

  useEffect(() => {
    getMyInfo();
  }, []);

  const getMyInfo = async () => {
    try {
      const res = await handleAPI('/user/me', null, 'get');

      res && dispatch(res.data.user);
    } catch (error) {
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
