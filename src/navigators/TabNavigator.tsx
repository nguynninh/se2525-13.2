import { Platform } from 'react-native';
import { ReactNode } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import ProfileNavigator from './ProfileNavigator';
import { appColors } from '../constants/appColors';
import {
  Home2,
  Scanning,
  TrendUp,
  User,
  Video,
} from 'iconsax-react-native';
import { CircleComponent, TextComponent } from '../components';
import { globalStyles } from '../styles/globalStyles';
import SaleNavigator from './SaleNavigator';
import ScannerNavigator from './ScannerNavigator';
import LiveNavigator from './LiveNavigator';
import CommerceNavigator from './CommerceNavigator';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const { t } = useTranslation('common');

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return t('home');
      case 'Sale':
        return t('sale');
      case 'Scanner':
        return t('scanner');
      case 'Live':
        return t('live');
      case 'Profile':
        return t('profile');
      default:
        return routeName;
    }
  };

  const tabBarLabel = (routeName: string, focused: boolean) => {
    return routeName === 'Scanner' ? null : (
      <TextComponent
        text={getTabLabel(routeName)}
        flex={0}
        size={12}
        color={focused ? appColors.primary : appColors.gray5}
        styles={{
          marginBottom: Platform.OS === 'android' ? 12 : 0,
        }}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';
        const isProductDetail = routeName === 'ProductDetail' || routeName === 'CartScreen' || routeName === 'SearchScreen';

        return {
          headerShown: false,
          tabBarStyle: {
            display: isProductDetail ? 'none' : 'flex',
            height: Platform.OS === 'ios' ? 88 : 68,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.8)',
            position: 'absolute',
            bottom: 20,
            marginHorizontal: 12,
            borderRadius: 30,
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 10,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let icon: ReactNode;
            color = focused ? appColors.primary : appColors.gray4;
            size = 24;
            switch (route.name) {
              case 'Home':
                icon = <Home2 variant="Bold" size={size} color={color} />;
                break;

              case 'Sale':
                icon = <TrendUp variant="Bold" size={size} color={color} />;
                break;
              case 'Scanner':
                icon = (
                  <CircleComponent
                    size={52}
                    styles={[
                      globalStyles.shadow,
                      { marginTop: Platform.OS === 'ios' ? -50 : -60 },
                    ]}>
                    <Scanning size={24} color={appColors.white} variant="Bold" />
                  </CircleComponent>
                );
                break;
              case 'Live':
                icon = <Video variant="Bold" size={size} color={color} />;
                break;
              case 'Profile':
                icon = <User size={size} variant="Bold" color={color} />;
                break;
            }
            return icon;
          },
          tabBarIconStyle: {
            marginTop: 8,
          },
          tabBarLabel: ({ focused }) => tabBarLabel(route.name, focused),
        };
      }}>
      <Tab.Screen name="Home" component={CommerceNavigator} />
      <Tab.Screen name="Sale" component={SaleNavigator} />
      <Tab.Screen name="Scanner" component={ScannerNavigator} />
      <Tab.Screen name="Live" component={LiveNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
