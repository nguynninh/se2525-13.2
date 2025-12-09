import { View, StatusBar, Platform, Image, ScrollView } from 'react-native';
import { useEffect, useState, useMemo, useRef } from 'react';
import { globalStyles } from '../../styles/globalStyles';
import { AvatarComponent, InputComponent, RowComponent, SpaceComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { Add, HambergerMenu, Notification, ScanBarcode, SearchNormal1, ShoppingCart, Sort } from 'iconsax-react-native';
import { useTranslation } from 'react-i18next';
import { useDrawerStatus } from '@react-navigation/drawer';
import handleApi from '../../apis/handleApi';
import { Banner } from '../../models/Banner';
import { appInfo } from '../../constants/appInfos';

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  const [banner, setBanner] = useState<Banner[]>([]);
  const fetchBanners = async () => {
    try {
      const response = await handleApi(
        '/banners',
        {},
        'get'
      );

      response && setBanner(response.data.banners);
    } catch (error) {
      setBanner([]);
    }
  };
  useEffect(() => {
    fetchBanners();
  }, []);

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (banner.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banner.length;
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              x: nextIndex * (appInfo.sizes.WIDTH - 32),
              animated: true,
            });
          }
          return nextIndex;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [banner.length]);

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
      <View style={customStyle.content}>
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
            onPress={() => navigation.openDrawer()} />
          <RowComponent styles={customStyle.headerAccountRight}>
            <AvatarComponent
              icon={<ShoppingCart variant="Bold" size={24} color={appColors.gray5} />}
              size={40}
              dot
              dotColor={appColors.success}
              onPress={() => navigation.navigate('CartScreen')}
            />
            <AvatarComponent
              icon={<Notification variant="Bold" size={26} color={appColors.gray5} />}
              size={40}
              count={3}
              onPress={() => navigation.navigate('NotificationScreen')}
            />
          </RowComponent>
        </RowComponent>
        <SpaceComponent height={2} />
        <RowComponent styles={customStyle.searchContainer}>
          <InputComponent
            value={''}
            placeholder={searchPlaceholder}
            onChange={() => { }}
            height={45}
            affix={
              searchIcon ? (
                <SearchNormal1 size={18} color={appColors.gray5} />
              ) : (
                <ScanBarcode size={18} color={appColors.gray5}
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
        <SpaceComponent height={10} />
        <View style={customStyle.swiperContainer}>
          {banner && banner.length > 0 && (
            <>
              <ScrollView
                ref={scrollViewRef}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                style={customStyle.fallbackSwiper}
                onScroll={(event) => {
                  const contentOffset = event.nativeEvent.contentOffset;
                  const index = Math.round(contentOffset.x / (appInfo.sizes.WIDTH - 32));
                  setCurrentBannerIndex(index);
                }}
                scrollEventThrottle={16}>
                {banner.map((item: Banner, index: number) => {
                  return (
                    <View
                      key={`banner-${item.id || index}`}
                      style={customStyle.bannerItem}>
                      {item.image_url ? (
                        <Image
                          source={{ uri: item.image_url }}
                          style={customStyle.bannerImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={customStyle.placeholderImage} />
                      )}
                    </View>
                  );
                })}
              </ScrollView>
              {banner.length > 1 && (
                <View style={customStyle.paginationContainer}>
                  {banner.map((_, index) => (
                    <View
                      key={`dot-${index}`}
                      style={[
                        customStyle.paginationDot,
                        {
                          backgroundColor: index === currentBannerIndex ? appColors.primary : appColors.gray8,
                        },
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as const,

  searchInput: {
    flex: 1,
  } as const,

  searchFilter: {
    backgroundColor: appColors.gray9,
    paddingHorizontal: 12,
    paddingVertical: 8,
  } as const,

  swiperContainer: {
    width: appInfo.sizes.WIDTH - 32,
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: appColors.gray9,
  } as const,

  swiperStyle: {
    height: 180,
  } as const,

  paginationStyle: {
    bottom: 10,
  } as const,

  bannerItem: {
    width: appInfo.sizes.WIDTH - 32,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  } as const,

  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  } as const,

  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.gray5,
  } as const,

  placeholderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: appColors.gray5,
    justifyContent: 'center',
    alignItems: 'center',
  } as const,

  content: {
    paddingHorizontal: 16,
  } as const,

  fallbackSwiper: {
    height: 180,
  } as const,

  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as const,

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  } as const,

  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: appColors.gray9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  } as const,
};

export default HomeScreen;
