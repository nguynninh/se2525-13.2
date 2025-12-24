import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, StatusBar, Platform, Image, ScrollView, ImageBackground, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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
import { Category } from '../../models/Category';

import { useDispatch, useSelector } from 'react-redux';
import { cartCountSelector, getCart } from '../../redux/reducers/cartReducer';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const cartCount = useSelector(cartCountSelector);
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
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

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [catRes, prodRes, bannerRes]: any[] = await Promise.all([
        categoryApi.getList().catch(error => { console.log('Category API error:', error); return { categories: [] }; }),
        productApi.getProducts('page=1&limit=10').catch(error => { console.log('Product API error:', error); return { products: [] }; }),
        handleApi('/banners', {}, 'get').catch(error => { console.log('Banner API error:', error); return { banners: [] }; })
      ]);

      const fetchedCategories = catRes.categories || (Array.isArray(catRes) ? catRes : []);
      if (fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
      } else {
        setCategories([]);
      }

      const fetchedProducts = prodRes.products || (Array.isArray(prodRes) ? prodRes : []);
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      } else {
        setProducts([]);
      }

      setBanner(bannerRes.banners || (Array.isArray(bannerRes) ? bannerRes : []));

    } catch (error: any) {
      console.log('Error fetching home data:', error);
      Alert.alert('Error fetching data', error?.message || 'Unknown error');
      // Fallback on error too
      setCategories([]);
      setProducts([
        { id: "1", name: "Nhà Giả Kim (Tái Bản)", price: "79000", images: [{ image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500" }] },
        { id: "2", name: "Áo Polo Nam", price: "299000", images: [{ image_url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500" }] },
        { id: "6", name: "Tai Nghe Sony", price: "6490000", images: [{ image_url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500" }] },
        { id: "7", name: "Giày Nike Jordan", price: "3500000", images: [{ image_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500" }] },
        { id: "8", name: "Apple Watch", price: "9990000", images: [{ image_url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500" }] },
        { id: "9", name: "Apple M2", price: "9990000", images: [{ image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500" }] },
      ]);
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
      <View style={[globalStyles.shadow, { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, flexDirection: 'row', alignItems: 'center', backgroundColor: appColors.white, marginBottom: 4, marginLeft: 4 }]}>
        {item.icon_url && <Image source={{ uri: item.icon_url }} style={{ width: 20, height: 20, marginRight: 8, borderRadius: 4 }} />}
        <TextComponent text={item.name} color={appColors.text} size={14} font={fontFamilies.medium} />
      </View>
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
      <View style={[globalStyles.shadow, { borderRadius: 12, backgroundColor: appColors.white, padding: 0 }]}>
        <Image
          source={{ uri: (item.images && item.images.length > 0 ? item.images[0].image_url : '') || item.image || item.image_url || 'https://via.placeholder.com/150' }}
          style={{ width: '100%', height: 140, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
          resizeMode="cover"
        />
        <View style={{ padding: 10 }}>
          <TextComponent text={item.name} numberOfLine={2} size={14} font={fontFamilies.medium} color={appColors.text} />
          <SpaceComponent height={4} />
          <RowComponent justify="space-between">
            <TextComponent text={`${item.price ? parseInt(item.price).toLocaleString('vi-VN') : '0'}đ`} size={16} font={fontFamilies.bold} color={appColors.primary} />
            <View style={{ backgroundColor: appColors.primary, borderRadius: 20, padding: 4 }}>
              <Add size={16} color={appColors.white} />
            </View>
          </RowComponent>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <View style={{ marginBottom: 20, alignItems: 'center' }}>
        {banner && banner.length > 0 && (
          <View style={{ width: appInfo.sizes.WIDTH - 32, height: 180, borderRadius: 12, overflow: 'hidden' }}>
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
                    <View style={{ flex: 1, backgroundColor: appColors.gray2, justifyContent: 'center', alignItems: 'center' }}>
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
          </View>
        )}
      </View>

      <View>
        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <TextComponent text={t('home:categories')} size={18} font={fontFamilies.bold} color={appColors.text} />
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

      <View style={{ paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextComponent text={t('home:popular_products')} size={18} font={fontFamilies.bold} color={appColors.text} />
        <TouchableOpacity>
          <TextComponent text={t('common:see_all')} size={12} color={appColors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: appColors.white2 }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={[globalStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 52 }]}>

        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <RowComponent justify="space-between">
            <AvatarComponent
              shape="circle"
              size={40}
              styles={{ backgroundColor: appColors.secondary, borderWidth: 0 }}
              icon={useDrawerStatus() === 'open' ? <View style={{ transform: [{ rotate: '45deg' }] }}><Add size={24} color={appColors.text} /></View> : <HambergerMenu size={24} color={appColors.text} />}
              onPress={() => navigation.openDrawer()}
            />
            <RowComponent gap={12}>
              <AvatarComponent
                icon={<ShoppingCart variant="Bold" size={20} color={appColors.text} />}
                size={40}
                count={cartCount}
                styles={{ backgroundColor: appColors.secondary, borderWidth: 0 }}
                onPress={() => navigation.navigate('CartScreen')}
              />
              <AvatarComponent
                icon={<Notification variant="Bold" size={20} color={appColors.text} />}
                size={40}
                count={3}
                styles={{ backgroundColor: appColors.secondary, borderWidth: 0 }}
                onPress={() => navigation.navigate('NotificationScreen')}
              />
            </RowComponent>
          </RowComponent>

          <SpaceComponent height={20} />

          <GlassView style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 48, borderRadius: 12 }} backgroundColor={appColors.secondary} borderColor={appColors.secondary}>
            {searchIcon ? (
              <SearchNormal1 size={20} color={appColors.gray5} />
            ) : (
              <ScanBarcode size={20} color={appColors.gray5} onPress={() => navigation.navigate('ScannerScreen')} />
            )}
            <TextComponent text={searchPlaceholder} color={appColors.gray5} flex={1} styles={{ marginLeft: 10 }} />
            {!searchIcon && <ScanBarcode size={20} color={appColors.text} onPress={() => navigation.navigate('ScannerScreen')} />}
          </GlassView>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={appColors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            ListHeaderComponent={renderHeader}
            data={products}
            numColumns={2}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 10 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
