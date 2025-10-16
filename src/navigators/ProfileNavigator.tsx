import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { HelpAndFAQs, ProfileScreen, SettingScreen, ContactUs, LanguageScreen } from '../screens';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="HelpAndFAQs" component={HelpAndFAQs} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
