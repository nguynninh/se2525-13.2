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
      const [catRes, prodRes, bannerRes]: any[] = await Promise.all([
        categoryApi.getList(),
        productApi.getProducts('page=1&limit=10'),
        handleApi('/banners', {}, 'get')
      ]);

      const fetchedCategories = catRes.categories || (Array.isArray(catRes) ? catRes : []);
      if (fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
      } else {
        setCategories([
          { id: '1', name: 'Thời trang', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200' },
          { id: '2', name: 'Đồ điện tử', image_url: 'https://images.unsplash.com/photo-1498049381960-a45bd3d135e7?w=200' },
          { id: '3', name: 'Giày dép', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
          { id: '4', name: 'Phụ kiện', image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' },
          { id: '5', name: 'Gia dụng', image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200' },
        ]);
      }

      const fetchedProducts = prodRes.products || (Array.isArray(prodRes) ? prodRes : []);
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      } else {
        // Fallback Mock Data as requested
        setProducts([
          {
            "id": "b68818dc-b938-4aef-b66f-962bc0898bf4",
            "name": "Nhà Giả Kim (Tái Bản)",
            "price": "79000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500" }]
          },
          {
            "id": "0a685995-ed05-470b-9856-087cd88d3e94",
            "name": "Áo Polo Nam Coolmate Basic",
            "price": "299000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500" }]
          },
          {
            "id": "f33a59b4-481e-44d8-8c42-8da9463a7a94",
            "name": "MacBook Air M2 2024",
            "price": "26990000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500" }]
          },
          {
            "id": "0d058232-f524-4c94-8555-cc566d28670c",
            "name": "Son Kem Lì 3CE Cloud Lip Tint",
            "price": "250000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500" }]
          },
          {
            "id": "e5877c97-55ac-4603-9404-22fb955a70ac",
            "name": "Combo 5 Gói Snack Lay's",
            "price": "45000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500" }]
          },
          {
            "id": "6",
            "name": "Tai Nghe Sony WH-1000XM5",
            "price": "6490000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500" }]
          },
          {
            "id": "7",
            "name": "Giày Nike Air Jordan 1",
            "price": "3500000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500" }]
          },
          {
            "id": "8",
            "name": "Đồng Hồ Apple Watch Series 9",
            "price": "9990000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500" }]
          },
          {
            "id": "9",
            "name": "Kính Mát Rayban Aviator",
            "price": "3200000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500" }]
          },
          {
            "id": "10",
            "name": "Cà Phê Highlands Phin Sữa Đá",
            "price": "29000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=500" }]
          },
          {
            "id": "11",
            "name": "Kem Chống Nắng Anessa",
            "price": "450000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500" }]
          },
          {
            "id": "12",
            "name": "Bàn Phím Cơ Keychron K2",
            "price": "1800000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=500" }]
          },
          {
            "id": "13",
            "name": "Bàn Phím Cơ Keychron K2",
            "price": "1800000.00",
            "images": [{ "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=500" }]
          }
        ]);
      }

      setBanner(bannerRes.banners || (Array.isArray(bannerRes) ? bannerRes : []));

    } catch (error) {
      console.log('Error fetching home data:', error);
      // Fallback on error too
      setCategories([
        { id: '1', name: 'Thời trang', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200' },
        { id: '2', name: 'Đồ điện tử', image_url: 'https://images.unsplash.com/photo-1498049381960-a45bd3d135e7?w=200' },
        { id: '3', name: 'Giày dép', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
        { id: '4', name: 'Phụ kiện', image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' },
        { id: '5', name: 'Gia dụng', image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200' },
      ]);
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
        {item.image_url && <Image source={{ uri: item.image_url }} style={{ width: 20, height: 20, marginRight: 8, borderRadius: 4 }} />}
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
