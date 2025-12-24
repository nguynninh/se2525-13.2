
import { useState, useEffect } from 'react';
import { Alert, View, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import { AvatarComponent, ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { removeAuth } from '../../redux/reducers/authReducer';
import { useTranslation } from '../../../node_modules/react-i18next';
import { appColors } from '../../constants/appColors';
import { getProfile, removeUser, userSelector } from '../../redux/reducers/userReducer';
import { ArrowRight, Camera, PictureFrame, UserSquare, Verify, Shop, Sms, Call, Location, Edit2, ArchiveBook, LogoutCurve, User } from 'iconsax-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileMenuModal } from '../../modals';
import { MenuItem } from '../../modals/ProfileMenuModal';
import { fontFamilies } from '../../constants/fontFamilies';
import userApi from '../../apis/userApi';

const ProfileScreen = ({ navigation }: any) => {
  const { t } = useTranslation(['profile', 'common']);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  console.log('User from selector:', user);
  if (user) {
    console.log('User role:', user.role);
  }

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

  useEffect(() => {
    dispatch(getProfile() as any);
  }, []);

  const handleChooseAvatar = async () => {
    try {
      setShowProfileMenu(false);
      await new Promise(resolve => setTimeout(resolve, 300));
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 1, selectionLimit: 1 });
      if (result.assets && result.assets[0]) {
        navigation.push('AvatarPreview', { imageUri: result.assets[0].uri });
      }
    } catch (error) { }
  };

  const menuItemsProfileMenu: MenuItem[] = [
    { icon: <UserSquare size={20} color={appColors.white} variant="Bold" />, title: t('profile:avatar_view'), onPress: () => console.log('View Avatar') },
    { icon: <PictureFrame size={20} color={appColors.white} />, title: t('profile:choose_avatar'), onPress: handleChooseAvatar },
  ];

  const renderInfoRow = (icon: React.ReactNode, label: string, value: string, isLast?: boolean) => (
    <RowComponent styles={{ marginBottom: isLast ? 0 : 16 }}>
      <View style={{
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center', alignItems: 'center'
      }}>
        {icon}
      </View>
      <SpaceComponent width={12} />
      <View style={{ flex: 1 }}>
        <TextComponent text={label} size={12} color={appColors.gray5} />
        <SpaceComponent height={4} />
        <TextComponent text={value || t('profile:not_updated')} size={15} color={appColors.text} font={fontFamilies.medium} />
      </View>
    </RowComponent>
  );

  const renderMenuRow = (icon: React.ReactNode, label: string, onPress: () => void, isLast?: boolean, color?: string) => (
    <TouchableOpacity onPress={onPress}>
      <RowComponent styles={{ paddingVertical: 12 }}>
        <View style={{
          width: 40, height: 40, borderRadius: 12,
          backgroundColor: color ? color + '15' : appColors.primary + '10', // Light background
          justifyContent: 'center', alignItems: 'center'
        }}>
          {icon}
        </View>
        <SpaceComponent width={12} />
        <TextComponent text={label} size={16} color={color || appColors.text} font={fontFamilies.medium} flex={1} />
        <ArrowRight size={18} color={appColors.gray5} />
      </RowComponent>
      {!isLast && <View style={{ height: 1, backgroundColor: '#F5F5F5', marginLeft: 52 }} />}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F4F8' }}>
      <View style={{ backgroundColor: appColors.white, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingTop: Platform.OS === 'android' ? 40 : 60, paddingHorizontal: 20 }}>
        <RowComponent justify='space-between'>
          <TextComponent text={t('common:profile')} title size={28} font={fontFamilies.bold} />
          <TouchableOpacity onPress={() => navigation.navigate('SettingScreen')} style={{ padding: 8, backgroundColor: '#F8F9FA', borderRadius: 12 }}>
            <Edit2 size={20} color={appColors.text} />
          </TouchableOpacity>
        </RowComponent>

        <SpaceComponent height={20} />

        <RowComponent>
          <AvatarComponent
            shape="circle"
            imageUrl={user?.avatar || user?.profile_url}
            size={80}
            onPress={() => setShowProfileMenu(true)}
          />
          <SpaceComponent width={16} />
          <View style={{ flex: 1 }}>
            <TextComponent
              text={`${user?.last_name || ''} ${user?.first_name || ''}`}
              title
              size={20}
              font={fontFamilies.bold}
            />
            <SpaceComponent height={4} />
            <TextComponent text={user?.email || 'email@example.com'} color={appColors.gray5} size={14} />
          </View>
        </RowComponent>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[appColors.primary]} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* Info Card */}
        <View style={{
          backgroundColor: appColors.white,
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
          marginBottom: 16
        }}>
          <TextComponent text={t('profile:personal_info')} size={16} font={fontFamilies.bold} styles={{ marginBottom: 16 }} />
          {renderInfoRow(<Sms size={20} color={appColors.primary} />, t('profile:email'), user?.email)}
          {renderInfoRow(<Call size={20} color={appColors.orange} />, t('profile:phone_number'), user?.phone || '')}
          {renderInfoRow(<Location size={20} color={'#2ecc71'} />, t('profile:address'), user?.address || '', true)}
        </View>

        {/* Menu Card */}
        <View style={{
          backgroundColor: appColors.white,
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
        }}>
          <TextComponent text={t('profile:settings')} size={16} font={fontFamilies.bold} styles={{ marginBottom: 8 }} />

          {/* Seller Check */}
          {user?.seller_request_status === 'approved' ? (
            renderMenuRow(<Shop size={22} color={appColors.primary} variant='Bold' />, t('profile:seller_dashboard', { defaultValue: 'Cửa hàng của tôi' }), () => navigation.navigate('MyProducts'))
          ) : (
            renderMenuRow(<Shop size={22} color={appColors.primary} />, t('profile:register_seller', { defaultValue: 'Đăng ký bán hàng' }), () => navigation.navigate('SellerRegistrationScreen'))
          )}

          {renderMenuRow(<Shop size={22} color={appColors.link} />, user?.role === 'seller' ? t('profile:convert_to_personal') : t('profile:convert_to_seller'), async () => {
            if (user?.role === 'seller') {
              Alert.alert(t('common:notification'), t('profile:not_authorized_feature'));
            } else {
              Alert.alert(t('profile:confirm'), t('profile:confirm_register_seller'), [
                { text: t('common:cancel'), style: 'cancel' },
                {
                  text: t('common:agree'), onPress: async () => {
                    try {
                      const res = await userApi.registerSellerApplication();
                      if (res) {
                        Alert.alert('Thành công', 'Đăng ký thành công!');
                        dispatch(getProfile() as any);
                      }
                    } catch (error: any) {
                      console.log(error);
                      Alert.alert('Lỗi', error.message || 'Gửi yêu cầu thất bại');
                    }
                  }
                }
              ]);
            }
          })}

          {renderMenuRow(<ArchiveBook size={22} color={'#FF9F43'} variant='Bold' />, t('profile:favorites', { defaultValue: 'Yêu thích' }), () => { })}

          {renderMenuRow(
            <LogoutCurve size={22} color={appColors.danger} variant='Bold' />,
            t('auth:btn_log_out'),
            async () => {
              Alert.alert(t('auth:confirm_logout'), t('auth:logout_message'), [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Logout', style: 'destructive', onPress: async () => {
                    await GoogleSignin.signOut();
                    await LoginManager.logOut();
                    await AsyncStorage.removeItem('auth');
                    dispatch(removeAuth({}));
                    dispatch(removeUser({}));
                  }
                }
              ]);
            },
            true,
            appColors.danger
          )}
        </View>

      </ScrollView>

      <ProfileMenuModal visible={showProfileMenu} onClose={() => setShowProfileMenu(false)} menuItems={menuItemsProfileMenu} />
    </View>
  );
};


export default ProfileScreen;
