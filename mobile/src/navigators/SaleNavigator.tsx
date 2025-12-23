import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SaleScreen } from '../screens';

const SaleNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SaleScreen" component={SaleScreen} />
    </Stack.Navigator>
  );
};

export default SaleNavigator;
