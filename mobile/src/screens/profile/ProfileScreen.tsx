
import { useState, useEffect } from 'react';
import { Alert, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { AvatarComponent, ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { removeAuth } from '../../redux/reducers/authReducer';
import { useTranslation } from '../../../node_modules/react-i18next';
import { appColors } from '../../constants/appColors';
import { getProfile, removeUser, userSelector } from '../../redux/reducers/userReducer';
import { ArrowRight, Camera, PictureFrame, UserSquare, Verify, Shop } from 'iconsax-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileMenuModal } from '../../modals';
import { MenuItem } from '../../modals/ProfileMenuModal';
import { fontFamilies } from '../../constants/fontFamilies';

const ProfileScreen = ({ navigation }: any) => {
  const { t } = useTranslation(['profile', 'common']);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(getProfile() as any);
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const user = useSelector(userSelector);

  useEffect(() => {
    dispatch(getProfile() as any);
  }, []);

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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[appColors.primary]}
            tintColor={appColors.gray}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
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
          text={`${user.lastname} ${user.firstname} ` || t('common:profile')}
          title
          styles={{ textAlign: 'center' }}
        />

        {/* Seller Status Section replacing UUID */}
        <View style={{ marginVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
          {user.seller_request_status === 'pending' ? (
            <View style={{ alignItems: 'center' }}>
              <RowComponent>
                <Shop size={22} color={appColors.text} variant="Bold" />
                <SpaceComponent width={8} />
                <TextComponent text={user.store?.store_name || user.email || 'Cửa hàng'} font={fontFamilies.bold} size={18} color={appColors.text} />
              </RowComponent>
            </View>
          ) : (user.seller_request_status === 'approved' && user.store?.store_name) ? (
            <TouchableOpacity onPress={() => navigation.navigate('MyProducts')}>
              <RowComponent>
                <TextComponent
                  text={user.store.store_name}
                  font={fontFamilies.bold}
                  size={18}
                  color={appColors.text}
                />
                <SpaceComponent width={6} />
                <Verify size={20} color={appColors.primary} variant="Bold" />
              </RowComponent>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('SellerRegistrationScreen')}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: appColors.primary + '15',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: appColors.primary + '50'
              }}
            >
              <TextComponent text="Đăng ký nhà bán hàng" color={appColors.primary} font={fontFamilies.medium} />
            </TouchableOpacity>
          )}
        </View>

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

          {/* Removed redundant buttons as logic is moved up */}
          {user.seller_request_status === 'approved' && (
            <ButtonComponent
              type="link"
              text={t('profile:seller_dashboard', { defaultValue: 'Seller Dashboard' })}
              onPress={() => navigation.navigate('MyProducts')}
              styles={{ marginTop: 20 }}
            />
          )}
        </SectionComponent>
      </ScrollView>

      <ProfileMenuModal
        visible={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        menuItems={menuItemsProfileMenu}
      />
    </ContainerComponent>
  );
};


export default ProfileScreen;
