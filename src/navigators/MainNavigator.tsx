import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import { useDispatch } from 'react-redux';
import handleAPI from '../apis/handleApi';
import { addUser } from '../redux/reducers/userReducer';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  const dispatch = useDispatch();

  useEffect(() => {
    getMyInfo();
  }, []);

  const getMyInfo = async () => {
    try {
      const res = await handleAPI('/users/me', {}, 'get');

      res && dispatch(addUser(res.data.user));
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
