import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '.';
import { globalStyles } from '../styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const color = appColors.gray;
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

  return (
    <View style={[localStyles.container]}>
      <TouchableOpacity
        onPress={() => {
          navigation.closeDrawer();

          navigation.navigate('Profile', {
            screen: 'ProfileScreen',
          });
        }}>
        <AvatarComponent
          shape="circle"
          imageUrl={user.avatar}
          size={52}
          styles={localStyles.avatar}
        />
        <View style={{ gap: 3 }}>
          <RowComponent justify="flex-start" styles={{ alignItems: 'center', gap: 6 }}>
            <TextComponent text={getTimeBasedGreeting()} font={fontFamilies.semiBold} color={appColors.gray} size={14} />
            {new Date().getHours() < 12
              ? <SunFog variant="Bold" size={14} color={appColors.gray}/>
              : <Moon variant="Bold" size={14} color={appColors.gray}/>}
          </RowComponent>
          <TextComponent text={user.name || t('home:new_user')} title color={appColors.text} size={16} />
        </View>
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={profileMenu}
        style={{ flex: 1, marginVertical: 20 }}
        renderItem={({ item }) => (
          <RowComponent
            styles={[localStyles.listItem]}
            onPress={
              item.key === 'SignOut'
                ? () => handleSignOut()
                : () => {
                  console.log(item.key);
                  navigation.closeDrawer();
                }
            }>
            {item.icon}
            <TextComponent
              text={item.title}
              styles={localStyles.listItemText}
            />
          </RowComponent>
        )}
      />
      <RowComponent justify="flex-start">
        <TouchableOpacity
          style={[
            globalStyles.button,
            { backgroundColor: '#00F8FF33', height: 'auto' },
          ]}>
          <MaterialCommunityIcons name="crown" size={22} color={'#00F8FF'} />
          <SpaceComponent width={8} />
          <TextComponent color="#00F8FF" text="Upgrade Pro" />
        </TouchableOpacity>
      </RowComponent>
    </View>
  );
};

export default DrawerCustom;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },

  listItemText: {
    paddingLeft: 12,
  },
});
