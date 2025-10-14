import { View, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { globalStyles } from '../../styles/globalStyles';
import { AvatarComponent, CircleComponent, InputComponent, RowComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { Notification, ScanBarcode, SearchNormal1, ShoppingCart, Sort } from 'iconsax-react-native';
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

  const searchPlaceholders = useMemo(() => [
    t('home:search_placeholder'),
    t('home:search_placeholder1'),
    t('home:search_placeholder2'),
    t('home:search_placeholder3'),
    t('home:search_placeholder4'),
  ], [t]);
  const [searchPlaceholder, setSearchPlacehoder] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [searchIcon, setSearchIcon] = useState(true);
  useEffect(() => {
    const current = searchPlaceholders[phraseIndex];
    let charIndex = 0;

    const interval = setInterval(() => {
      setSearchPlacehoder(current.slice(0, charIndex + 1));
      charIndex++;

      if (charIndex === current.length) {
        clearInterval(interval);

        setTimeout(() => {
          setPhraseIndex(prev => (prev + 1) % searchPlaceholders.length);
          setSearchPlacehoder('');
        }, 1500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phraseIndex, searchPlaceholders]);

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setSearchIcon(prev => !prev);
    }, 5000);
    return () => clearInterval(iconInterval);
  }, []);

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
              onPress={() => navigation.navigate('CartScreen')}
            />
            <AvatarComponent
              icon={<Notification variant="Bold" size={24} color={appColors.gray} />}
              size={36}
              count={3}
              onPress={() => navigation.navigate('NotificationScreen')}
            />
          </RowComponent>
        </RowComponent>
        <SpaceComponent height={10} />
        <View style={customStyle.searchContainer}>
          <InputComponent
            value={''}
            placeholder={searchPlaceholder}
            onChange={() => { }}
            affix={
              searchIcon ? (
                <SearchNormal1 size={18} color={appColors.gray} />
              ) : (
                <ScanBarcode size={18} color={appColors.gray}
                  onPress={() => navigation.navigate('ScannerScreen')} />
              )
            }
            suffix={
              <RowComponent
                onPress={() =>
                  navigation.navigate('SearchScreen', {
                    isFilter: true,
                  })
                }
                styles={customStyle.searchFilter}>
                <CircleComponent size={20.3} color={appColors.white}>
                  <Sort size={12} color={appColors.text} />
                </CircleComponent>
                <SpaceComponent width={8} />
                <TextComponent text={t('home:search_filter')} font={fontFamilies.regular} color={appColors.text} size={14} />
              </RowComponent>
            }
            disabled
            onPress={() => navigation.navigate('SearchScreen')}
          />
        </View>
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

  searchContainer: {
    flex: 1,
  } as const,

  searchFilter: {
    backgroundColor: appColors.gray5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  } as const,
};

export default HomeScreen;
