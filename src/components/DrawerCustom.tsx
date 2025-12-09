import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import React from 'react';
import { AvatarComponent, RowComponent, TextComponent } from '.';
import { useDispatch, useSelector } from 'react-redux';
import { removeAuth } from '../redux/reducers/authReducer';
import { appColors } from '../constants/appColors';
import {
  Logout,
  Message2,
  MessageQuestion,
  Moon,
  Notification,
  Setting2,
  Sms,
  SunFog,
  User,
} from 'iconsax-react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userSelector } from '../redux/reducers/userReducer';
import { useTranslation } from 'react-i18next';
import { fontFamilies } from '../constants/fontFamilies';

const DrawerCustom = ({ navigation }: any) => {
  const { t } = useTranslation();

  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return t('home:morning');
    } else if (currentHour >= 12 && currentHour < 17) {
      return t('home:afternoon');
    } else if (currentHour >= 17 && currentHour < 21) {
      return t('home:evening');
    } else {
      return t('home:night');
    }
  };

  const size = 20;
  const color = appColors.white; // Changed to white for glass theme
  const profileMenu = [
    {
      key: 'MyProfile',
      title: t('common:my_profile'),
      icon: <User size={size} color={color} />,
    },
    {
      key: 'Message',
      title: t('common:messages'),
      icon: <Message2 size={size} color={color} />,
    },
    {
      key: 'Notifications',
      title: t('common:notifications'),
      icon: <Notification size={size} color={color} />,
    },
    {
      key: 'Settings',
      title: t('common:settings'),
      icon: <Setting2 size={size} color={color} />,
    },
    {
      key: 'HelpAndFAQs',
      title: t('common:help_fqa'),
      icon: <MessageQuestion size={size} color={color} />,
    },
    {
      key: 'ContactUs',
      title: t('common:contact_us'),
      icon: <Sms size={size} color={color} />,
    },
    {
      key: 'SignOut',
      title: t('common:sign_out'),
      icon: <Logout size={size} color={color} />,
    },
  ];

  const handleSignOut = async () => {
    await GoogleSignin.signOut();
    await LoginManager.logOut();
    dispatch(removeAuth({}));
    await AsyncStorage.clear();
  };

  // Same background image as HomeScreen
  const bgImage = { uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop' };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={bgImage} style={{ flex: 1 }} resizeMode="cover" blurRadius={Platform.OS === 'ios' ? 10 : 3}>
        <View style={[localStyles.container, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <TouchableOpacity
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('TabNavigator', {
                screen: 'Profile',
              });
            }}>
            <AvatarComponent
              shape="circle"
              imageUrl={user.photoUrl}
              size={60}
              styles={[localStyles.avatar, { borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' }]}
            />
            <View style={{ gap: 4, marginTop: 10 }}>
              <RowComponent justify="flex-start" styles={{ alignItems: 'center', gap: 6 }}>
                <TextComponent text={getTimeBasedGreeting()} font={fontFamilies.medium} color={appColors.gray2} size={14} />
                {new Date().getHours() < 12
                  ? <SunFog variant="Bold" size={16} color={appColors.warning} />
                  : <Moon variant="Bold" size={16} color={appColors.white} />}
              </RowComponent>
              <TextComponent text={`${user.lastname} ${user.firstname}` || t('home:new_user')} title color={appColors.white} size={20} font={fontFamilies.bold} />
            </View>
          </TouchableOpacity>

          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 20 }} />

          <FlatList
            showsVerticalScrollIndicator={false}
            data={profileMenu}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[localStyles.listItem]}
                onPress={
                  item.key === 'MyProfile'
                    ? () => {
                      navigation.closeDrawer();
                      navigation.navigate('TabNavigator', {
                        screen: 'Profile',
                        params: { screen: 'ProfileScreen' },
                      });
                    } : item.key === 'Notifications'
                      ? () => {
                        navigation.closeDrawer();
                        navigation.navigate('TabNavigator', {
                          screen: 'Home',
                          params: { screen: 'NotificationScreen' },
                        });
                      } : item.key === 'Message'
                        ? () => {
                          navigation.closeDrawer();
                          navigation.navigate('TabNavigator', {
                            screen: 'Home',
                            params: { screen: 'NotificationScreen' },
                          });
                        } : item.key === 'Settings'
                          ? () => {
                            navigation.closeDrawer();
                            navigation.navigate('TabNavigator', {
                              screen: 'Profile',
                              params: { screen: 'SettingScreen' },
                            });
                          } : item.key === 'HelpAndFAQs'
                            ? () => {
                              navigation.closeDrawer();
                              navigation.navigate('TabNavigator', {
                                screen: 'Profile',
                                params: { screen: 'HelpAndFAQs' },
                              });
                            } : item.key === 'ContactUs'
                              ? () => {
                                navigation.closeDrawer();
                                navigation.navigate('TabNavigator', {
                                  screen: 'Profile',
                                  params: { screen: 'ContactUs' },
                                });
                              } : item.key === 'SignOut'
                                ? () => handleSignOut()
                                : () => {
                                  navigation.closeDrawer();
                                }
                }>
                <RowComponent justify="flex-start" styles={{ alignItems: 'center' }}>
                  {item.icon}
                  <TextComponent
                    text={item.title}
                    styles={localStyles.listItemText}
                    color={appColors.white}
                    size={16}
                  />
                </RowComponent>
              </TouchableOpacity>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default DrawerCustom;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },

  avatar: {
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    paddingVertical: 14,
    justifyContent: 'flex-start',
  },

  listItemText: {
    paddingLeft: 12,
  },
});
