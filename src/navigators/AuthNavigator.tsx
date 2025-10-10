import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    LoginScreen,
    OnboardingScreen,
    SignUpScreen,
} from '../screens';

const AuthNavigator = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
