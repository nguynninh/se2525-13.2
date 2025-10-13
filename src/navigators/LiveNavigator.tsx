import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { LiveScreen } from '../screens';

const LiveNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LiveScreen" component={LiveScreen} />
    </Stack.Navigator>
  );
};

export default LiveNavigator;
