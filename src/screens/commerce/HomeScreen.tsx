import { View, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { globalStyles } from '../../styles/globalStyles';
import { AvatarComponent, InputComponent, RowComponent, SpaceComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { Add, HambergerMenu, Notification, ScanBarcode, SearchNormal1, ShoppingCart, Sort } from 'iconsax-react-native';
import { useTranslation } from 'react-i18next';
import { useDrawerStatus } from '@react-navigation/drawer';

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

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
          <AvatarComponent
            shape="square"
            size={45}
            icon={useDrawerStatus() === 'open' ? (
              <View style={{ transform: [{ rotate: '45deg' }] }}>
                <Add size={32} color={appColors.text} />
              </View>
            ) : (
              <HambergerMenu size={26} color={appColors.text} />
            )}
            onPress={() => navigation.openDrawer()}/>
          <RowComponent styles={customStyle.headerAccountRight}>
            <AvatarComponent
              icon={<ShoppingCart variant="Bold" size={24} color={appColors.gray} />}
              size={40}
              dot
              dotColor={appColors.success}
              onPress={() => navigation.navigate('CartScreen')}
            />
            <AvatarComponent
              icon={<Notification variant="Bold" size={26} color={appColors.gray} />}
              size={40}
              count={3}
              onPress={() => navigation.navigate('NotificationScreen')}
            />
          </RowComponent>
        </RowComponent>
        <SpaceComponent height={1} />
        <RowComponent styles={customStyle.searchContainer}>
          <InputComponent
            value={''}
            placeholder={searchPlaceholder}
            onChange={() => { }}
            height={45}
            affix={
              searchIcon ? (
                <SearchNormal1 size={18} color={appColors.gray} />
              ) : (
                <ScanBarcode size={18} color={appColors.gray}
                  onPress={() => navigation.navigate('ScannerScreen')} />
              )
            }
            disabled
            onPress={() => navigation.navigate('SearchScreen')}
            style={customStyle.searchInput}
          />
          <AvatarComponent
            shape="square"
            icon={<Sort size={20} color={appColors.text} />}
            size={45}
            styles={customStyle.searchFilter}
            onPress={() =>
              navigation.navigate('SearchScreen', {
                isFilter: true,
              })
            }
          />
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as const,

  searchInput: {
    flex: 1,
  } as const,

  searchFilter: {
    backgroundColor: appColors.gray5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  } as const,
};

export default HomeScreen;
