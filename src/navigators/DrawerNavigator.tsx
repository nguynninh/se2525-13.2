import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerCustom } from '../components';
import TabNavigator from './TabNavigator';

const DrawerNavigator = () => {
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerPosition: 'left',
            }}
            drawerContent={props => <DrawerCustom {...props} />}>
            <Drawer.Screen name="TabNavigator" component={TabNavigator} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
