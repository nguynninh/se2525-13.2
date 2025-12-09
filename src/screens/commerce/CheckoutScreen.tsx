import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Platform, FlatList, Alert, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { cartSelector, cartTotalSelector, clearCart, updateCartItem } from '../../redux/reducers/cartReducer';
import { addressSelector, addAddress } from '../../redux/reducers/addressReducer';
import addressApi from '../../apis/addressApi';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { ContainerComponent, TextComponent, RowComponent, SpaceComponent, SectionComponent, ButtonComponent, InputComponent } from '../../components';
import { Location, ArrowRight2, ShieldTick, Ticket, InfoCircle, Bank, Shop } from 'iconsax-react-native';

const CheckoutScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();
    const { items }: any = route.params || {};

    const dispatch = useDispatch();

    const cartItemsSelector = useSelector(cartSelector);
    const [localCartItems, setLocalCartItems] = useState<any[]>([]);

    useEffect(() => {
        if (items) {
            setLocalCartItems(items);
        } else {
            setLocalCartItems(cartItemsSelector);
        }
    }, [items, cartItemsSelector]);

    const cartTotal = useMemo(() => {
        return localCartItems.reduce((sum: number, item: any) => sum + ((item.variant?.price || item.product?.price || 0) * item.quantity), 0);
    }, [localCartItems]);

    const handleUpdateQuantity = (item: any, type: 'minus' | 'plus') => {
        const newQty = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
        if (newQty < 1) return;

        if (items) {
            const newItems = localCartItems.map(i =>
                (i.product?.id === item.product?.id && i.variant?.id === item.variant?.id)
                    ? { ...i, quantity: newQty } : i
            );
            setLocalCartItems(newItems);
        } else {
            dispatch(updateCartItem({ id: item.id, quantity: newQty }) as any);
        }
    };

    const selectedAddress = useSelector(addressSelector);

    useEffect(() => {
        if (!selectedAddress) {
            getAddress();
        }
    }, [selectedAddress]);

    const getAddress = async () => {
        try {
            const res = await addressApi.getAllAddresses();
            if (res && res.data && res.data.length > 0) {
                const defaultItem = res.data.find((i: any) => i.is_default) || res.data[0];
                dispatch(addAddress(defaultItem));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const formatCurrency = (value: number) => {
        return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
    };

    const [paymentMethod, setPaymentMethod] = useState('cod');

    const originalPrice = cartTotal * 1.2;
    const productDiscount = originalPrice - cartTotal;
    const sellerVoucher = 4760;
    const hikiVoucher = 7140;
    const shippingFee = 0;

    const finalTotal = cartTotal - sellerVoucher - hikiVoucher + shippingFee;
    const totalDiscount = productDiscount + sellerVoucher + hikiVoucher;
    const savePercentage = Math.round((totalDiscount / originalPrice) * 100);

    const groupedItems = useMemo(() => {
        const groups: { [key: string]: any[] } = {};
        localCartItems.forEach((item: any) => {
            const shopName = item.product?.shop?.name || 'SYSTEM STORE';
            if (!groups[shopName]) {
                groups[shopName] = [];
            }
            groups[shopName].push(item);
        });
        return groups;
    }, [localCartItems]);

    const handlePlaceOrder = () => {
        dispatch(clearCart());
        (navigation as any).navigate('OrderSuccessScreen');
    };

    const renderAddressLabel = (item: any) => {
        try {
            const ward = item.ward ? (typeof item.ward === 'string' ? JSON.parse(item.ward) : item.ward) : null;
            const province = item.province ? (typeof item.province === 'string' ? JSON.parse(item.province) : item.province) : null;
            return [item.address, ward?.name, province?.name].filter(Boolean).join(', ');
        } catch (error) {
            return item.address;
        }
    };

    return (
        <ContainerComponent
            back
            title={
                <View style={{ alignItems: 'center' }}>
                    <TextComponent text="Tổng quan đơn hàng" font={fontFamilies.bold} size={16} />
                    <RowComponent>
                        <ShieldTick size={14} color={appColors.success} variant="Bold" />
                        <SpaceComponent width={4} />
                        <TextComponent text="Đảm bảo thanh toán an toàn" size={12} color={appColors.success} />
                    </RowComponent>
                </View>
            }>
            <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2' }} contentContainerStyle={{ paddingBottom: 140 }}>
                <SectionComponent styles={styles.section}>
                    <TouchableOpacity onPress={() => (navigation as any).navigate('AddressList')}>
                        <RowComponent justify="flex-start" styles={{ alignItems: 'flex-start' }}>
                            <Location size={20} color={appColors.gray} style={{ marginTop: 2 }} />
                            <SpaceComponent width={8} />
                            {selectedAddress ? (
                                <View style={{ flex: 1 }}>
                                    <TextComponent
                                        text={`${renderAddressLabel(selectedAddress)}`}
                                        color={appColors.gray} size={13}
                                        numberOfLine={2}
                                    />
                                    <SpaceComponent height={4} />
                                    <TextComponent
                                        text={`${selectedAddress.name} · ${selectedAddress.phone}`}
                                        font={fontFamilies.bold}
                                        size={14}
                                    />
                                </View>
                            ) : (
                                <TextComponent text="Vui lòng chọn địa chỉ giao hàng" color={appColors.text} flex={1} />
                            )}
                            <ArrowRight2 size={16} color={appColors.gray} />
                        </RowComponent>
                    </TouchableOpacity>
                </SectionComponent>

                {Object.keys(groupedItems).map((shopName) => (
                    <SectionComponent key={shopName} styles={styles.section}>
                        <RowComponent styles={{ marginBottom: 12 }}>
                            {groupedItems[shopName][0]?.product?.shop?.image ? (
                                <Image source={{ uri: groupedItems[shopName][0]?.product?.shop?.image }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                            ) : (
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
                                    <Shop size={24} color={appColors.gray} variant="Bold" />
                                </View>
                            )}
                            <SpaceComponent width={12} />
                            <View style={{ flex: 1 }}>
                                <TextComponent text={shopName} font={fontFamilies.bold} size={16} />
                                <SpaceComponent height={4} />
                                <RowComponent justify='flex-start' styles={{ alignItems: 'center' }}>
                                    <TextComponent text="Online 2 giờ trước" size={12} color={appColors.gray} />
                                    <SpaceComponent width={6} />
                                    <TextComponent text="•" size={12} color={appColors.gray} />
                                    <SpaceComponent width={6} />
                                    <Shop size={14} color={appColors.primary} variant="Bold" />
                                    <SpaceComponent width={4} />
                                    <TextComponent text="Chính hãng" size={12} color={appColors.primary} />
                                </RowComponent>
                            </View>
                            <ArrowRight2 size={20} color={appColors.gray} />
                        </RowComponent>

                        {groupedItems[shopName].map((item: any, index: number) => (
                            <View key={item.id} style={{ marginBottom: 16 }}>
                                <RowComponent styles={{ alignItems: 'flex-start' }}>
                                    <Image
                                        source={{ uri: item.imageUrl || item.variant?.image_url || item.product?.image || 'https://via.placeholder.com/90' }}
                                        style={{ width: 90, height: 90, borderRadius: 4, marginRight: 12 }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <TextComponent text={item.product?.name} size={13} numberOfLine={2} styles={{ lineHeight: 18, marginBottom: 4 }} />

                                        <View style={{ alignSelf: 'flex-start', borderWidth: 1, borderColor: appColors.warning, paddingHorizontal: 4, borderRadius: 2, marginBottom: 8 }}>
                                            <TextComponent text="Trả hàng miễn phí" color={appColors.warning} size={10} />
                                        </View>

                                        <RowComponent justify="space-between" styles={{ alignItems: 'center' }}>
                                            <View>
                                                <TextComponent
                                                    text={formatCurrency(item.variant?.price || item.product?.price || 0)}
                                                    color={appColors.danger}
                                                    font={fontFamilies.bold}
                                                    size={15}
                                                />
                                                <RowComponent styles={{ marginTop: 2 }}>
                                                    <TextComponent
                                                        text={formatCurrency((item.variant?.price || item.product?.price || 0) * 1.2)}
                                                        color={appColors.gray}
                                                        size={12}
                                                        styles={{ textDecorationLine: 'line-through' }}
                                                    />
                                                    <SpaceComponent width={4} />
                                                    <TextComponent text="-3%" color={appColors.danger} size={12} />
                                                </RowComponent>
                                            </View>

                                            {/* Qty Stepper Visual */}
                                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 4, alignItems: 'center' }}>
                                                <TouchableOpacity onPress={() => handleUpdateQuantity(item, 'minus')} style={{ paddingHorizontal: 8, paddingVertical: 4, borderRightWidth: 1, borderRightColor: '#e0e0e0', backgroundColor: '#f9f9f9' }}>
                                                    <TextComponent text="-" color={appColors.gray} />
                                                </TouchableOpacity>
                                                <View style={{ paddingHorizontal: 12, paddingVertical: 4, justifyContent: 'center', backgroundColor: appColors.white }}>
                                                    <TextComponent text={`${item.quantity}`} />
                                                </View>
                                                <TouchableOpacity onPress={() => handleUpdateQuantity(item, 'plus')} style={{ paddingHorizontal: 8, paddingVertical: 4, borderLeftWidth: 1, borderLeftColor: '#e0e0e0', backgroundColor: '#f9f9f9' }}>
                                                    <TextComponent text="+" color={appColors.gray} />
                                                </TouchableOpacity>
                                            </View>
                                        </RowComponent>
                                    </View>
                                </RowComponent>
                            </View>
                        ))}

                        <RowComponent styles={{ paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', alignItems: 'center' }}>
                            <TextComponent text="Tin nhắn:" size={13} styles={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Lưu ý cho người bán..."
                                style={{ flex: 1, textAlign: 'right', padding: 0, fontSize: 13, color: appColors.text, fontFamily: fontFamilies.regular }}
                                placeholderTextColor={appColors.gray}
                            />
                        </RowComponent>

                        <View style={{ backgroundColor: '#e0f7fa', padding: 12, borderRadius: 4, marginTop: 4 }}>
                            <RowComponent justify="space-between" styles={{ alignItems: 'flex-start' }}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <TextComponent text="Đảm bảo giao vào 12–15 tháng 12" size={13} font={fontFamilies.medium} />
                                    <TextComponent text="Vận chuyển tiêu chuẩn" size={12} color={appColors.gray} styles={{ marginVertical: 2 }} />
                                    <TextComponent text="Nhận voucher ít nhất 15K₫ nếu đơn giao trễ" size={11} color={appColors.gray} />
                                </View>
                                <View>
                                    <TextComponent text="30.200đ" size={12} color={appColors.gray} styles={{ textDecorationLine: 'line-through', textAlign: 'right' }} />
                                    <TextComponent text="Miễn phí" size={12} color="#00bfa5" font={fontFamilies.bold} styles={{ textAlign: 'right' }} />
                                </View>
                            </RowComponent>
                        </View>
                    </SectionComponent>
                ))}

                <SectionComponent styles={[styles.section, { paddingVertical: 12 }]}>
                    <RowComponent justify="space-between">
                        <RowComponent>
                            <Ticket size={24} color={appColors.danger} variant="Bold" />
                            <SpaceComponent width={8} />
                            <TextComponent text="Giảm giá từ Hiki Shop" font={fontFamilies.semiBold} size={15} />
                        </RowComponent>

                        <RowComponent>
                            <View style={styles.badgeBlue}>
                                <TextComponent text="Freeship" size={10} color="#00bfa5" font={fontFamilies.medium} />
                            </View>
                            <SpaceComponent width={4} />
                            <TextComponent text={`-${formatCurrency(hikiVoucher)}`} size={10} color={appColors.danger} font={fontFamilies.medium} />
                            <SpaceComponent width={4} />
                            <ArrowRight2 size={16} color={appColors.gray} />
                        </RowComponent>
                    </RowComponent>
                </SectionComponent>

                <SectionComponent styles={styles.section}>
                    <TextComponent text="Tóm tắt đơn hàng" font={fontFamilies.bold} size={15} styles={{ marginBottom: 12 }} />

                    <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
                        <TextComponent text="Tổng phụ sản phẩm" size={14} />
                        <TextComponent text={formatCurrency(finalTotal)} size={14} />
                    </RowComponent>
                    <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
                        <TextComponent text="Giá gốc" size={14} color={appColors.gray} />
                        <TextComponent text={formatCurrency(originalPrice)} size={14} color={appColors.gray} styles={{ textDecorationLine: 'line-through' }} />
                    </RowComponent>
                    <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
                        <TextComponent text="Giảm giá sản phẩm" size={14} color={appColors.gray} />
                        <TextComponent text={`-${formatCurrency(productDiscount)}`} size={14} color={appColors.danger} />
                    </RowComponent>
                    <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
                        <TextComponent text="Voucher người bán" size={14} color={appColors.gray} />
                        <TextComponent text={`-${formatCurrency(sellerVoucher)}`} size={14} color={appColors.danger} />
                    </RowComponent>
                    <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
                        <TextComponent text="Voucher Hiki Shop" size={14} color={appColors.gray} />
                        <TextComponent text={`-${formatCurrency(hikiVoucher)}`} size={14} color={appColors.danger} />
                    </RowComponent>
                    <RowComponent justify="space-between" styles={{ marginBottom: 12 }}>
                        <TextComponent text="Tổng phụ vận chuyển" size={14} />
                        <TextComponent text="0đ" size={14} />
                    </RowComponent>

                    <View style={{ height: 1, backgroundColor: '#f0f0f0', marginBottom: 12 }} />

                    <RowComponent justify="space-between">
                        <TextComponent text="Tổng" font={fontFamilies.bold} size={16} />
                        <TextComponent text={formatCurrency(finalTotal)} font={fontFamilies.bold} size={16} />
                    </RowComponent>
                </SectionComponent>

                <SectionComponent styles={styles.section}>
                    <TextComponent text="Phương thức thanh toán" font={fontFamilies.bold} size={15} styles={{ marginBottom: 12 }} />

                    <TouchableOpacity onPress={() => setPaymentMethod('cod')} style={styles.paymentRow}>
                        <RowComponent>
                            <View style={styles.codIcon}>
                                <TextComponent text="COD" color={appColors.white} size={10} font={fontFamilies.bold} />
                            </View>
                            <SpaceComponent width={8} />
                            <TextComponent text="Thanh toán khi giao" size={14} />
                            <SpaceComponent width={4} />
                            <InfoCircle size={14} color={appColors.gray} />
                        </RowComponent>
                        <View style={[styles.radio, paymentMethod === 'cod' && styles.radioSelected]}>
                            {paymentMethod === 'cod' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setPaymentMethod('bank')} style={styles.paymentRow}>
                        <RowComponent>
                            <Bank size={24} color={appColors.primary} />
                            <SpaceComponent width={8} />
                            <TextComponent text="Chuyển khoản ngân hàng" size={14} />
                        </RowComponent>
                        <View style={[styles.radio, paymentMethod === 'bank' && styles.radioSelected]}>
                            {paymentMethod === 'bank' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    <SpaceComponent height={12} />
                    <TextComponent
                        text="Bằng cách đặt đơn hàng, bạn đồng ý với Điều khoản sử dụng và bán hàng của Hiki Shop và đồng ý rằng dữ liệu của bạn sẽ được xử lý theo Chính sách quyền riêng tư của Hiki."
                        size={12}
                        color={appColors.gray}
                        styles={{ lineHeight: 18 }}
                    />
                </SectionComponent>



            </ScrollView>

            <View style={styles.footer}>
                <RowComponent justify="space-between" styles={{ marginBottom: 12 }}>
                    <TextComponent text={`Tổng (${localCartItems.length} mặt hàng)`} font={fontFamilies.bold} size={16} />
                    <View style={{ alignItems: 'flex-end' }}>
                        <TextComponent text={formatCurrency(finalTotal)} font={fontFamilies.bold} size={16} color={appColors.danger} />
                        <TextComponent text={`Tiết kiệm ${savePercentage}%`} size={12} color={appColors.danger} />
                    </View>
                </RowComponent>

                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    style={{
                        backgroundColor: appColors.danger,
                        borderRadius: 8,
                        paddingVertical: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <TextComponent text="Đặt hàng" font={fontFamilies.bold} size={16} color={appColors.white} />
                    <TextComponent text="Voucher hết hạn sau 06:38:50 | Freeship" font={fontFamilies.regular} size={11} color={appColors.white} />
                </TouchableOpacity>
            </View>
        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: appColors.white,
        marginBottom: 8,
        padding: 12,
    },
    badgeBlue: {
        backgroundColor: '#e0f2f1',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 2
    },
    badgePink: {
        backgroundColor: '#fce4ec',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 2
    },
    codIcon: {
        backgroundColor: '#4caf50',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 2,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: appColors.gray,
        justifyContent: 'center',
        alignItems: 'center'
    },
    radioSelected: {
        borderColor: appColors.danger,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: appColors.danger
    },
    footer: {
        backgroundColor: appColors.white,
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    }
});

export default CheckoutScreen;
