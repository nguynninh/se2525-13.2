import { useState } from 'react';
import { Alert } from 'react-native';
import { AvatarComponent, ButtonComponent, ContainerComponent, SectionComponent, TextComponent } from '../../components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { removeAuth } from '../../redux/reducers/authReducer';
import { useTranslation } from 'react-i18next';
import { appColors } from '../../constants/appColors';
import { removeUser, userSelector } from '../../redux/reducers/userReducer';
import { ArrowRight, Camera, PictureFrame, UserSquare } from 'iconsax-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileMenuModal } from '../../modals';
import { MenuItem } from '../../modals/ProfileMenuModal';

const ProfileScreen = ({ navigation }: any) => {
  const { t } = useTranslation(['profile', 'common']);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dispatch = useDispatch();

  const user = useSelector(userSelector);

  const handleChooseAvatar = async () => {
    try {
      setShowProfileMenu(false);
      await new Promise(resolve => setTimeout(resolve, 300));

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      });

      if (result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        navigation.push('AvatarPreview', { imageUri });
      }
    } catch (error) {
    }
  };

  const menuItemsProfileMenu: MenuItem[] = [
    {
      icon: <UserSquare size={20} color={appColors.white} variant="Bold" />,
      title: t('profile:avatar_view'),
      onPress: () => console.log('Xem ảnh đại diện'),
    },
    {
      icon: <PictureFrame size={20} color={appColors.white} />,
      title: t('profile:choose_avatar'),
      onPress: handleChooseAvatar,
    },
  ];
  return (
    <ContainerComponent isImageBackground>
      <AvatarComponent
        shape="circle"
        imageUrl={user.avatar}
        size={60}
        dot
        dotColor={appColors.white}
        dotPosition="bottom-right"
        dotIcon={<Camera size={16} color={appColors.gray} variant="Bold" />}
        border={[2, 'solid', appColors.gray2]}
        styles={{ alignSelf: 'center', marginTop: 20 }}
        onPress={() => setShowProfileMenu(true)}
      />
      <TextComponent
        text={`${user.lastname} ${user.firstname}` || t('common:profile')}
        title
        styles={{ textAlign: 'center' }}
      />
      <TextComponent
        text={`${user.id}` || t('common:profile')}
        styles={{ textAlign: 'center', marginVertical: 20 }}
      />
      <SectionComponent>
        <ButtonComponent
          type="primary"
          text={t('auth:btn_log_out')}
          onPress={async () => {
            await GoogleSignin.signOut();
            await LoginManager.logOut();
            await AsyncStorage.removeItem('auth');
            dispatch(removeAuth({}));
            dispatch(removeUser({}));
          }}
          icon={<ArrowRight size={20} color={appColors.white} />}
          iconFlex="right"
        />

        {user.seller_request_status === 'none' && (
          <ButtonComponent
            type="link"
            text={t('profile:request_seller', { defaultValue: 'Register as Seller' })}
            onPress={async () => {
              try {
                const userApi = require('../../apis/userApi').default;
                await userApi.requestSeller();
                // Optional: Update user state or show success
                Alert.alert(t('profile:request_sent', { defaultValue: 'Request sent successfully' }));
              } catch (e) {
                console.log(e);
              }
            }}
            styles={{ marginTop: 20 }}
          />
        )}
        {user.seller_request_status === 'pending' && (
          <TextComponent
            text={t('profile:seller_pending', { defaultValue: 'Seller Request Pending' })}
            styles={{ textAlign: 'center', marginTop: 10, color: appColors.warning }}
          />
        )}
        {user.seller_request_status === 'approved' && (
          <ButtonComponent
            type="link"
            text={t('profile:seller_dashboard', { defaultValue: 'Seller Dashboard' })}
            onPress={() => navigation.navigate('MyProducts')}
            styles={{ marginTop: 20 }}
          />
        )}
      </SectionComponent>

      <ProfileMenuModal
        visible={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        menuItems={menuItemsProfileMenu}
      />
    </ContainerComponent>
  );
};

export default ProfileScreen;
