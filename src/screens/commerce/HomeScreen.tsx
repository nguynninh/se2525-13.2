import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, StatusBar, Platform, Image, ScrollView, ImageBackground, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { AvatarComponent, InputComponent, RowComponent, SpaceComponent, TextComponent, GlassView } from '../../components';
import { appColors } from '../../constants/appColors';
import { Add, HambergerMenu, Notification, ScanBarcode, SearchNormal1, ShoppingCart, Sort } from 'iconsax-react-native';
import { useTranslation } from '../../../node_modules/react-i18next';
import { useDrawerStatus } from '@react-navigation/drawer';
import handleApi from '../../apis/handleApi';
import { Banner } from '../../models/Banner';
import { appInfo } from '../../constants/appInfos';
import categoryApi from '../../apis/categoryApi';
import productApi from '../../apis/productApi';
import { fontFamilies } from '../../constants/fontFamilies';

import { useDispatch, useSelector } from 'react-redux';
import { cartCountSelector, getCart } from '../../redux/reducers/cartReducer';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const cartCount = useSelector(cartCountSelector);
  const { t } = useTranslation();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [banner, setBanner] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    dispatch(getCart() as any);
  }, [dispatch]);

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

  const bgImage = { uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop' };

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [catRes, prodRes, bannerRes] = await Promise.all([
        categoryApi.getList(),
        productApi.getProducts(),
        handleApi('/banners', {}, 'get')
      ]);

      if (catRes && catRes.data && catRes.data.categories) {
        setCategories(catRes.data.categories);
      }

      if (prodRes && prodRes.data && prodRes.data.products) {
        setProducts(prodRes.data.products);
      }

      if (bannerRes && bannerRes.data && bannerRes.data.banners) {
        setBanner(bannerRes.data.banners);
      }

    } catch (error) {
      console.log('Error fetching home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

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

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => console.log('Category press:', item.name)} style={{ marginRight: 12 }}>
      <GlassView style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
        {item.image_url && <Image source={{ uri: item.image_url }} style={{ width: 20, height: 20, marginRight: 8, borderRadius: 4 }} />}
        <TextComponent text={item.name} color={appColors.white} size={14} font={fontFamilies.regular} />
      </GlassView>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
      style={{
        flex: 1,
        margin: 6,
        marginBottom: 12,
      }}>
      <GlassView style={{ borderRadius: 16, padding: 0 }}>
        <Image
          source={{ uri: item.image || item.image_url || ((item.variants && item.variants[0]) ? item.variants[0].image_url : '') || 'https://via.placeholder.com/150' }}
          style={{ width: '100%', height: 140, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          resizeMode="cover"
        />
        <View style={{ padding: 10 }}>
          <TextComponent text={item.name} numberOfLine={2} size={14} font={fontFamilies.medium} color={appColors.white} />
          <SpaceComponent height={4} />
          <RowComponent justify="space-between">
            <TextComponent text={`${item.variants && item.variants.length > 0 ? parseInt(item.variants[0].price).toLocaleString('vi-VN') : '0'}đ`} size={16} font={fontFamilies.bold} color={appColors.primary} />
            <View style={{ backgroundColor: appColors.primary, borderRadius: 20, padding: 4 }}>
              <Add size={16} color={appColors.white} />
            </View>
          </RowComponent>
        </View>
      </GlassView>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={bgImage} style={{ flex: 1 }} resizeMode="cover" blurRadius={Platform.OS === 'ios' ? 10 : 3}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={[globalStyles.container, { backgroundColor: 'rgba(0,0,0,0.2)', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 52 }]}>

        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <RowComponent justify="space-between">
            <AvatarComponent
              shape="circle"
              size={40}
              styles={{ backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
              icon={useDrawerStatus() === 'open' ? <View style={{ transform: [{ rotate: '45deg' }] }}><Add size={24} color={appColors.white} /></View> : <HambergerMenu size={24} color={appColors.white} />}
              onPress={() => navigation.openDrawer()}
            />
            <RowComponent gap={12}>
              <AvatarComponent
                icon={<ShoppingCart variant="Bold" size={20} color={appColors.white} />}
                size={40}
                count={cartCount}
                styles={{ backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
                onPress={() => navigation.navigate('CartScreen')}
              />
              <AvatarComponent
                icon={<Notification variant="Bold" size={20} color={appColors.white} />}
                size={40}
                count={3}
                styles={{ backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
                onPress={() => navigation.navigate('NotificationScreen')}
              />
            </RowComponent>
          </RowComponent>

          <SpaceComponent height={20} />

          <GlassView style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 48, borderRadius: 12 }}>
            {searchIcon ? (
              <SearchNormal1 size={20} color={appColors.gray2} />
            ) : (
              <ScanBarcode size={20} color={appColors.gray2} onPress={() => navigation.navigate('ScannerScreen')} />
            )}
            <TextComponent text={searchPlaceholder} color={appColors.gray2} flex={1} styles={{ marginLeft: 10 }} />
            {!searchIcon && <ScanBarcode size={20} color={appColors.white} onPress={() => navigation.navigate('ScannerScreen')} />}
          </GlassView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          <View style={{ marginBottom: 20, alignItems: 'center' }}>
            {banner && banner.length > 0 && (
              <GlassView style={{ width: appInfo.sizes.WIDTH - 32, height: 180, borderRadius: 12, padding: 0 }}>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal={true}
                  pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  onScroll={(event) => {
                    const contentOffset = event.nativeEvent.contentOffset;
                    const index = Math.round(contentOffset.x / (appInfo.sizes.WIDTH - 32));
                    setCurrentBannerIndex(index);
                  }}
                  scrollEventThrottle={16}>
                  {banner.map((item: Banner, index: number) => (
                    <View key={`banner-${item.id || index}`} style={{ width: appInfo.sizes.WIDTH - 32, height: 180 }}>
                      {item.image_url ? (
                        <Image source={{ uri: item.image_url }} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
                      ) : (
                        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }}>
                          <TextComponent text="Banner" color={appColors.gray5} />
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
                {banner.length > 1 && (
                  <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {banner.map((_, index) => (
                      <View
                        key={`dot-${index}`}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          marginHorizontal: 4,
                          backgroundColor: index === currentBannerIndex ? appColors.primary : 'rgba(255,255,255,0.5)',
                        }}
                      />
                    ))}
                  </View>
                )}
              </GlassView>
            )}
          </View>

          <View>
            <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
              <TextComponent text={t('home:categories')} size={18} font={fontFamilies.bold} color={appColors.white} />
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>

          <SpaceComponent height={24} />

          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <View style={{ paddingHorizontal: 6, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextComponent text={t('home:popular_products')} size={18} font={fontFamilies.bold} color={appColors.white} />
              <TouchableOpacity>
                <TextComponent text={t('common:see_all')} size={12} color={appColors.primary} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color={appColors.primary} style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                scrollEnabled={false}
                numColumns={2}
                data={products}
                renderItem={renderProductItem}
                keyExtractor={item => item.id}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
              />
            )}
          </View>

        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;
