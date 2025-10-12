import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { HomeScreen } from '../screens';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
