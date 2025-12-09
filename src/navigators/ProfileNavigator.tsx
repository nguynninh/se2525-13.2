import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HelpAndFAQs, ProfileScreen, SettingScreen, ContactUs, LanguageScreen, AvatarPreview, SellerRegistrationScreen } from '../screens';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="AvatarPreview"
        component={AvatarPreview}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="HelpAndFAQs" component={HelpAndFAQs} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
      <Stack.Screen name="SellerRegistrationScreen" component={SellerRegistrationScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
