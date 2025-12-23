import { Swipeable } from 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform, FlatList, Alert, ScrollView } from 'react-native';
import { ContainerComponent, TextComponent, RowComponent, SectionComponent, SpaceComponent, ButtonComponent, GlassView } from '../../components';
import { useTranslation } from '../../../node_modules/react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { cartSelector, getCart, updateCartItem, removeCartItem } from '../../redux/reducers/cartReducer';
import { addressSelector } from '../../redux/reducers/addressReducer';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { Add, Minus, TickCircle, Trash, ArrowRight2, Shop, Ticket, ArrowLeft, Location } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CartScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartItems = useSelector(cartSelector);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(getCart() as any);
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItems(cartItems.map((item: any) => item.id));
    }
  }, [cartItems]);

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: { storeName: string, items: any[] } } = {};
    cartItems.forEach((item: any) => {
      const store = item.product?.seller?.store;
      const storeId = store?.id || 'unknown';
      const storeName = store?.store_name || 'Hiki System';

      if (!groups[storeId]) {
        groups[storeId] = { storeName, items: [] };
      }
      groups[storeId].items.push(item);
    });
    return Object.values(groups);
  }, [cartItems]);

  const handleUpdateQuantity = (item: any, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({
      id: item.id,
      quantity: newQuantity
    }) as any);
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      t('common:confirm'),
      t('common:delete_confirm'),
      [
        { text: t('common:cancel'), style: 'cancel' },
        { text: t('common:delete'), style: 'destructive', onPress: () => dispatch(removeCartItem(id) as any) }
      ]
    );
  };

  const toggleSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item: any) => item.id));
    }
  };

  const totalSelectedAmount = useMemo(() => {
    return cartItems
      .filter((item: any) => selectedItems.includes(item.id))
      .reduce((total: number, item: any) => {
        const price = item.variant?.price || item.product?.price || 0;
        return total + price * item.quantity;
      }, 0);
  }, [cartItems, selectedItems]);

  const selectedAddress = useSelector(addressSelector);

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = selectedItems.includes(item.id);
    const price = item.variant?.price || item.product?.price || 0;

    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Trash size={24} color={appColors.white} />
        <TextComponent text="Xoá" color={appColors.white} size={12} />
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.itemWrapper}>
          <RowComponent styles={{ alignItems: 'flex-start' }} justify="flex-start">
            {isEdit && (
              <TouchableOpacity onPress={() => toggleSelection(item.id)} style={{ padding: 4 }}>
                <TickCircle
                  size={24}
                  color={isSelected ? appColors.danger : appColors.gray8}
                  variant={isSelected ? "Bold" : "Linear"}
                />
              </TouchableOpacity>
            )}

            {isEdit && <SpaceComponent width={8} />}

            <Image
              source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/images/splash-img.png')}
              style={styles.productImage}
            />

            <SpaceComponent width={12} />

            {/* Info */}
            <View style={{ flex: 1 }}>
              <TextComponent text={item.product?.name} size={13} numberOfLine={2} styles={{ lineHeight: 18 }} />
              <SpaceComponent height={4} />
              <View style={styles.variantTag}>
                <TextComponent text={item.variant?.name || 'Default'} size={10} color={appColors.gray5} />
                <ArrowRight2 size={10} color={appColors.gray5} />
              </View>
              <SpaceComponent height={8} />
              <RowComponent justify="space-between" styles={{ flexWrap: 'wrap', gap: 8 }}>
                <TextComponent
                  text={`${price.toLocaleString()}đ`}
                  color={appColors.danger}
                  font={fontFamilies.bold}
                  size={14}
                />
                <RowComponent styles={styles.qtyContainer}>
                  <TouchableOpacity onPress={() => handleUpdateQuantity(item, item.quantity - 1)} style={styles.qtyBtn}>
                    <Minus size={14} color={appColors.text} />
                  </TouchableOpacity>
                  <TextComponent text={item.quantity.toString()} styles={{ minWidth: 20, textAlign: 'center' }} size={13} />
                  <TouchableOpacity onPress={() => handleUpdateQuantity(item, item.quantity + 1)} style={styles.qtyBtn}>
                    <Add size={14} color={appColors.text} />
                  </TouchableOpacity>
                </RowComponent>
              </RowComponent>
            </View>
          </RowComponent>
        </View>
      </Swipeable>
    );
  };

  return (
    <ContainerComponent isImageBackground>
      <View style={{ flex: 1 }}>
        <RowComponent justify="space-between" styles={{ paddingHorizontal: 16, paddingVertical: 10, paddingTop: Platform.OS === 'android' ? 40 : 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={appColors.text} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <TextComponent text={`Giỏ hàng (${cartItems.length})`} font={fontFamilies.bold} size={16} />
            <RowComponent onPress={() => (navigation as any).navigate('AddressList')}>
              <Location size={12} color={appColors.gray5} variant="Bold" />
              <SpaceComponent width={4} />
              <TextComponent
                text={selectedAddress ? selectedAddress.address : 'Chọn địa chỉ'}
                size={12} color={appColors.gray5} numberOfLine={1} styles={{ maxWidth: 200 }}
              />
              <ArrowRight2 size={12} color={appColors.gray5} />
            </RowComponent>
          </View>
          <TouchableOpacity onPress={() => setIsEdit(!isEdit)}>
            <TextComponent text={isEdit ? "Xong" : "Chỉnh sửa"} size={14} color={appColors.text} />
          </TouchableOpacity>
        </RowComponent>


        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
          {groupedItems.map((group, index) => (
            <GlassView key={`group-${index}`} style={styles.shopSection}>
              <RowComponent styles={styles.shopHeader} justify="flex-start">
                {isEdit && (
                  <RowComponent onPress={() => {
                    const allIds = group.items.map(i => i.id);
                    const isAllSelected = allIds.every(id => selectedItems.includes(id));
                    if (isAllSelected) {
                      setSelectedItems(prev => prev.filter(id => !allIds.includes(id)));
                    } else {
                      const missing = allIds.filter(id => !selectedItems.includes(id));
                      setSelectedItems(prev => [...prev, ...missing]);
                    }
                  }}>
                    <TickCircle
                      size={24}
                      color={group.items.every(i => selectedItems.includes(i.id)) ? appColors.danger : appColors.gray8}
                      variant={group.items.every(i => selectedItems.includes(i.id)) ? "Bold" : "Linear"}
                    />
                    <SpaceComponent width={8} />
                  </RowComponent>
                )}
                <Shop size={20} color={appColors.text} variant="Bold" />
                <SpaceComponent width={8} />
                <TextComponent text={group.storeName} font={fontFamilies.bold} size={14} />
                <SpaceComponent width={4} />
                <ArrowRight2 size={14} color={appColors.gray5} />
              </RowComponent>

              <View style={styles.divider} />

              {group.items.map((item: any) => (
                <View key={item.id}>
                  {renderItem({ item })}
                  <View style={styles.itemDivider} />
                </View>
              ))}

              <RowComponent styles={{ paddingVertical: 12, paddingHorizontal: 16 }} justify="flex-start">
                <Ticket size={18} color={appColors.danger} />
                <SpaceComponent width={8} />
                <TextComponent text="Giảm ₫10k" size={12} color={appColors.danger} />
                <View style={{ flex: 1 }} />
                <TextComponent text="Vui lòng chọn voucher" size={12} color={appColors.primary} />
              </RowComponent>
            </GlassView>
          ))}

          {cartItems.length === 0 && (
            <SectionComponent styles={{ alignItems: 'center', marginTop: 40 }}>
              <TextComponent text={t('common:empty_cart')} color={appColors.gray} />
            </SectionComponent>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Voucher Bar */}
          <TouchableOpacity style={styles.voucherBar}>
            <RowComponent justify="flex-start">
              <Ticket size={20} color={appColors.danger} variant="Bold" />
              <SpaceComponent width={8} />
              <TextComponent text="Hiki Voucher" font={fontFamilies.medium} size={13} />
            </RowComponent>
            <RowComponent>
              <TextComponent text="Chọn hoặc nhập mã" size={12} color={appColors.gray5} />
              <ArrowRight2 size={16} color={appColors.gray5} />
            </RowComponent>
          </TouchableOpacity>

          <RowComponent justify="space-between" styles={styles.checkoutBar}>
            <RowComponent justify="flex-start">
              {isEdit && (
                <>
                  <TouchableOpacity onPress={toggleSelectAll} style={{ padding: 4 }}>
                    <TickCircle
                      size={24}
                      color={selectedItems.length === cartItems.length && cartItems.length > 0 ? appColors.danger : appColors.gray8}
                      variant={selectedItems.length === cartItems.length && cartItems.length > 0 ? "Bold" : "Linear"}
                    />
                  </TouchableOpacity>
                  <SpaceComponent width={4} />
                  <TextComponent text="Tất cả" size={12} color={appColors.gray5} />
                </>
              )}
            </RowComponent>

            <View style={{ alignItems: 'flex-end', flex: 1, marginRight: 12 }}>
              <RowComponent>
                <TextComponent text="Tổng tiền: " size={13} />
                <TextComponent
                  text={`${totalSelectedAmount.toLocaleString()}đ`}
                  color={appColors.danger}
                  font={fontFamilies.bold}
                  size={15}
                />
              </RowComponent>
              <TextComponent text="Tiết kiệm: 0đ" size={10} color={appColors.orange} />
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: selectedItems.length > 0 ? appColors.danger : appColors.gray8 }]}
              disabled={selectedItems.length === 0}
              onPress={() => (navigation as any).navigate('CheckoutScreen')}
            >
              <TextComponent
                text={`Thanh toán (${selectedItems.length})`}
                color={appColors.white}
                font={fontFamilies.bold}
                size={13}
              />
            </TouchableOpacity>
          </RowComponent>
        </View>
      </View>
    </ContainerComponent >
  );
};

const styles = StyleSheet.create({
  shopSection: {
    margin: 12,
    marginTop: 0,
    backgroundColor: appColors.white,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  shopHeader: {
    padding: 12,
    paddingBottom: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0'
  },
  itemWrapper: {
    padding: 12,
    backgroundColor: appColors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  variantTag: {
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  qtyContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4
  },
  qtyBtn: {
    padding: 4,
    width: 24,
    alignItems: 'center'
  },
  itemDivider: {
    height: 0,
    backgroundColor: 'transparent',
    marginLeft: 12
  },
  footer: {
    backgroundColor: appColors.white,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 30 : 0
  },
  voucherBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  checkoutBar: {
    padding: 12,
    paddingVertical: 12
  },
  checkoutBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    minWidth: 120,
    alignItems: 'center'
  },
  deleteAction: {
    backgroundColor: appColors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '100%',
  }
});

export default CartScreen;
