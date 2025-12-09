import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartScreen, HomeScreen, NotificationScreen, ScannerScreen, SearchScreen, ProductDetail, AddressList, AddNewAddress } from '../screens';

const CommerceNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="AddressList" component={AddressList} />
      <Stack.Screen name="AddNewAddress" component={AddNewAddress} />
    </Stack.Navigator>
  );
};

export default CommerceNavigator;
