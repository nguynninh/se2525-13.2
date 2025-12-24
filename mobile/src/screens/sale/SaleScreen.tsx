import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import productApi from '../../apis/productApi';
import { Product } from '../../models/Product';
import { Add, ArrowLeft } from 'iconsax-react-native';
import { ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { globalStyles } from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';

const SaleScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await productApi.getProducts('page=1&limit=20');
      console.log('API Response:', JSON.stringify(res));

      let items: Product[] = [];

      if (res) {
        if (Array.isArray(res)) {
          items = res;
        } else if (res.data && Array.isArray(res.data)) {
          items = res.data;
        } else if (res.products && Array.isArray(res.products)) {
          items = res.products;
        } else if (res.data?.products && Array.isArray(res.data.products)) {
          items = res.data.products;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          items = res.data.data;
        }
      }

      setProducts(items);
    } catch (error) {
      console.log('Error fetching sale products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const imageUrl = (item.images && item.images.length > 0) ? item.images[0] : (item.shop?.image || 'https://via.placeholder.com/150');
    // Note: API might return images as strings or objects. Handling both just in case, but model says string[].
    // If Model says string[], then item.images[0] is string.

    // Check if imageUrl is an object (common in some APIs) or string
    const finalUri = typeof imageUrl === 'object' && (imageUrl as any).image_url ? (imageUrl as any).image_url : imageUrl;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
        style={{
          flex: 1,
          margin: 6,
          marginBottom: 12,
        }}>
        <View style={[globalStyles.shadow, { borderRadius: 12, backgroundColor: appColors.white, padding: 0 }]}>
          <Image
            source={{ uri: finalUri || 'https://via.placeholder.com/150' }}
            style={{ width: '100%', height: 140, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            resizeMode="cover"
          />
          <View style={{ padding: 10 }}>
            <TextComponent text={item.name} numberOfLine={2} size={14} font={fontFamilies.medium} color={appColors.text} />
            <SpaceComponent height={4} />
            <RowComponent justify="space-between">
              <TextComponent text={`${item.price ? parseInt(item.price.toString()).toLocaleString('vi-VN') : '0'}đ`} size={16} font={fontFamilies.bold} color={appColors.primary} />
              <View style={{ backgroundColor: appColors.primary, borderRadius: 20, padding: 4 }}>
                <Add size={16} color={appColors.white} />
              </View>
            </RowComponent>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F4F8' }}>
      <View style={{
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: appColors.white,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
      }}>
        <TextComponent text="Sản phẩm khuyến mãi" title size={20} font={fontFamilies.bold} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
              <TextComponent text="Không có sản phẩm nào" color={appColors.gray5} />
            </View>
          }
        />
      )}
    </View>
  );
};

export default SaleScreen;
