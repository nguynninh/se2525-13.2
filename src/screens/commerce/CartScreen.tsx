import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Trash, Add, Minus, Bag2 } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { TextComponent, SpaceComponent, RowComponent, ButtonComponent, ContainerComponent, GlassView } from '../../components';
import { cartSelector, cartTotalSelector, getCart, updateCartItem, removeCartItem } from '../../redux/reducers/cartReducer';

const { width } = Dimensions.get('window');

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Selectors
  const cartItems = useSelector(cartSelector);
  const totalAmount = useSelector(cartTotalSelector);

  useEffect(() => {
    dispatch(getCart() as any);
  }, [dispatch]);

  const handleUpdateQuantity = (id: string, currentQty: number, type: 'plus' | 'minus') => {
    const newQty = type === 'plus' ? currentQty + 1 : currentQty - 1;
    if (newQty > 0) {
      dispatch(updateCartItem({ id, quantity: newQty }) as any);
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeCartItem(id) as any);
  };

  const renderItem = ({ item }: { item: any }) => {
    const product = item.product || {};
    const variant = item.variant || {};

    // Use server-provided resolved URL
    const imageUrl = item.imageUrl;

    const price = variant.price || product.price || 0;
    const name = product.name || t('common:product_not_found');

    let variantInfo = '';
    if (item.variant_id && variant) {
      variantInfo = variant.name ? `${t('common:item_variant')}: ${variant.name}` : ``;
    }

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => (navigation as any).navigate('ProductDetail', { id: item.product_id })}
          style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}
        >
          <Image
            source={imageUrl ? { uri: imageUrl } : require('../../assets/images/splash-img.png')}
            style={styles.productImage}
            resizeMode="cover"
          />
          <SpaceComponent width={12} />
          <View style={{ flex: 1, height: 80, justifyContent: 'space-between' }}>
            <View>
              <TextComponent text={name} size={14} font={fontFamilies.medium} numberOfLine={2} />
              {variantInfo ? <TextComponent text={variantInfo} size={12} color={appColors.gray} /> : null}
            </View>
            <TextComponent text={`${parseInt(price).toLocaleString()}đ`} size={15} font={fontFamilies.bold} color={appColors.primary} />
          </View>
        </TouchableOpacity>

        {/* Quantity & Delete */}
        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: 80 }}>
          <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
            <Trash size={20} color={appColors.gray} />
          </TouchableOpacity>

          <View style={styles.qtyContainer}>
            <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.quantity, 'minus')} style={styles.qtyBtn}>
              <Minus size={16} color={appColors.text} />
            </TouchableOpacity>
            <TextComponent text={item.quantity.toString()} size={14} font={fontFamilies.medium} />
            <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.quantity, 'plus')} style={styles.qtyBtn}>
              <Add size={16} color={appColors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ContainerComponent isImageBackground back title={t('common:my_cart')}>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            ItemSeparatorComponent={() => <SpaceComponent height={16} />}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer */}
          <GlassView
            style={styles.footer}
            backgroundColor="rgba(255, 255, 255, 0.85)"
            borderColor="#E0E0E0"
          >
            <RowComponent justify="space-between">
              <TextComponent text={`${t('common:total')}:`} size={16} color={appColors.gray} />
              <TextComponent text={`${totalAmount.toLocaleString()}đ`} size={20} font={fontFamilies.bold} color={appColors.primary} />
            </RowComponent>
            <SpaceComponent height={16} />
            <ButtonComponent
              text={t('common:checkout')}
              type="primary"
              styles={{ borderRadius: 12 }}
              onPress={() => console.log('Checkout')}
            />
          </GlassView>
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.emptyIconContainer}>
            <Bag2 size={48} color={appColors.gray} variant="Bold" />
          </View>
          <TextComponent text={t('common:empty_cart')} size={16} color={appColors.gray} />
          <SpaceComponent height={20} />
          <ButtonComponent
            text={t('common:shop_now')}
            type="primary"
            onPress={() => (navigation as any).navigate('Home')}
            styles={{ width: 150, borderRadius: 20 }}
          />
        </View>
      )}
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E0E0E0'
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 20,
    padding: 4,
    gap: 8
  },
  qtyBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.white,
    borderRadius: 12,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: appColors.white
  }
});

export default CartScreen;
