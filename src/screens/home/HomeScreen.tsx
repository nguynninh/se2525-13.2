import { View, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { AvatarComponent, RowComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { Notification, ShoppingCart } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/userReducer';
import { fontFamilies } from '../../constants/fontFamilies';
import { useTranslation } from 'react-i18next';

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const user = useSelector(userSelector);

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

  return (
    <View style={[globalStyles.container, customStyle.container]}>
      <View style={{ paddingHorizontal: 16 }}>
        <RowComponent styles={customStyle.headerAccount}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <RowComponent styles={customStyle.headerLeft}>
              <AvatarComponent imageUrl={user.avatar} size={40} border={[2, 'solid', appColors.gray]} />
              <View style={{ gap: 3 }}>
                <TextComponent text={getTimeBasedGreeting()} font={fontFamilies.semiBold} color={appColors.gray} size={14} />
                <TextComponent text={user.name || t('home:new_user')} font={fontFamilies.bold} color={appColors.text} size={16} />
              </View>
            </RowComponent>
          </TouchableOpacity>
          <RowComponent styles={customStyle.headerAccountRight}>
            <AvatarComponent
              icon={<ShoppingCart variant="Bold" size={24} color={appColors.gray} />}
              size={36}
              dot
              dotColor={appColors.success}
            />
            <AvatarComponent
              icon={<Notification variant="Bold" size={24} color={appColors.gray} />}
              size={36}
              count={3}
            />
          </RowComponent>
        </RowComponent>
      </View>
    </View>
  );
};

const customStyle = {
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 52,
  } as const,

  headerAccount: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  } as const,

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as const,

  headerAccountRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as const,

  headerAccountDot: {
    backgroundColor: '#02E9FE',
    width: 10,
    height: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbcaf7',
    position: 'absolute',
    top: -2,
    right: -2,
  } as const,
};

export default HomeScreen;
