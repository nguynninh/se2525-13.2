import { useState } from 'react';
import { AvatarComponent, ButtonComponent, ContainerComponent, SectionComponent, TextComponent } from '../../components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { useDispatch, useSelector } from 'react-redux';
import { removeAuth } from '../../redux/reducers/authReducer';
import { useTranslation } from 'react-i18next';
import { appColors } from '../../constants/appColors';
import { removeUser, userSelector } from '../../redux/reducers/userReducer';
import { ArrowRight, Camera, PictureFrame, UserSquare } from 'iconsax-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileMenuModal } from '../../modals';
import { MenuItem } from '../../modals/ProfileMenuModal';

const ProfileScreen = () => {
  const { t } = useTranslation(['profile', 'common']);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dispatch = useDispatch();

  const user = useSelector(userSelector);

  const menuItemsProfileMenu: MenuItem[] = [
    {
      icon: <UserSquare size={20} color={appColors.white} variant="Bold" />,
      title: t('profile:avatar_view'),
      onPress: () => console.log('Xem ảnh đại diện'),
    },
    {
      icon: <PictureFrame size={20} color={appColors.white} />,
      title: t('profile:choose_avatar'),
      onPress: () => console.log('Chọn ảnh'),
    },
  ];
  return (
    <ContainerComponent back isImageBackground>
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
