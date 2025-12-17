import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { ScannerScreen } from '../screens';

const ScannerNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
    </Stack.Navigator>
  );
};

export default ScannerNavigator;
