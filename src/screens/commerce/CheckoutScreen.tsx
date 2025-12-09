import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Platform, FlatList, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { cartSelector, cartTotalSelector, clearCart } from '../../redux/reducers/cartReducer';
import { addressSelector, addAddress } from '../../redux/reducers/addressReducer';
import addressApi from '../../apis/addressApi';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { ContainerComponent, TextComponent, RowComponent, SpaceComponent, SectionComponent, GlassView, ButtonComponent } from '../../components';
import { Location, ArrowRight2, Card, Moneys, Note, TruckFast } from 'iconsax-react-native';

const CheckoutScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const cartItems = useSelector(cartSelector);
    const cartTotal = useSelector(cartTotalSelector);
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

    const [paymentMethod, setPaymentMethod] = useState('cod');

    const SHIPPING_FEE: number = 0; // Free shipping logic already shown in ProductDetail
    const totalAmount = cartTotal + SHIPPING_FEE;

    const bgImage = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop';

    const renderAddressLabel = (item: any) => {
        try {
            const ward = item.ward ? (typeof item.ward === 'string' ? JSON.parse(item.ward) : item.ward) : null;
            const province = item.province ? (typeof item.province === 'string' ? JSON.parse(item.province) : item.province) : null;
            return [item.address, ward?.name, province?.name].filter(Boolean).join(', ');
        } catch (error) {
            return item.address;
        }
    };

    const handlePlaceOrder = () => {
        // Mock order placement
        Alert.alert(
            t('common:success') || 'Success',
            'Order placed successfully!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        dispatch(clearCart());
                        (navigation as any).navigate('HomeScreen');
                    }
                }
            ]
        );
    };

    return (
        <ContainerComponent
            isImageBackground
            imageBackgroundSource={bgImage}
            blurRadius={Platform.OS === 'ios' ? 10 : 3}
            back
            title={t('common:checkout') || 'Thanh toán'}
            isScroll
        >
            <SectionComponent styles={{ paddingBottom: 100 }}>
                {/* Address Section */}
                <GlassView style={styles.card}>
                    <RowComponent justify="space-between" styles={{ marginBottom: 12 }}>
                        <RowComponent>
                            <Location size={22} color={appColors.warning} variant="Bold" />
                            <SpaceComponent width={8} />
                            <TextComponent text={t('profile:delivery_address') || 'Địa chỉ nhận hàng'} font={fontFamilies.bold} size={16} />
                        </RowComponent>
                        <TouchableOpacity onPress={() => (navigation as any).navigate('AddressList')}>
                            <TextComponent text="Thay đổi" color={appColors.primary} font={fontFamilies.medium} />
                        </TouchableOpacity>
                    </RowComponent>

                    {selectedAddress ? (
                        <View>
                            <RowComponent>
                                <TextComponent text={selectedAddress.name} font={fontFamilies.bold} />
                                <View style={styles.divider} />
                                <TextComponent text={selectedAddress.phone} color={appColors.text} />
                            </RowComponent>
                            <SpaceComponent height={8} />
                            <TextComponent text={renderAddressLabel(selectedAddress)} color={appColors.gray} size={13} numberOfLine={2} />
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => (navigation as any).navigate('AddressList')}>
                            <TextComponent text="Vui lòng chọn địa chỉ giao hàng" color={appColors.gray} />
                        </TouchableOpacity>
                    )}
                </GlassView>

                <SpaceComponent height={20} />

                {/* Items Section */}
                <GlassView style={styles.card}>
                    <RowComponent styles={{ marginBottom: 12 }}>
                        <TruckFast size={22} color={appColors.primary} variant="Bold" />
                        <SpaceComponent width={8} />
                        <TextComponent text="Danh sách sản phẩm" font={fontFamilies.bold} size={16} />
                    </RowComponent>

                    {cartItems.map((item: any, index: number) => (
                        <View key={item.id}>
                            <RowComponent styles={{ alignItems: 'flex-start', paddingVertical: 12 }}>
                                <Image
                                    source={{ uri: item.imageUrl || item.variant?.image_url || item.product?.image || 'https://via.placeholder.com/80' }}
                                    style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#f0f0f0' }}
                                />
                                <SpaceComponent width={12} />
                                <View style={{ flex: 1 }}>
                                    <TextComponent text={item.product?.name} font={fontFamilies.medium} numberOfLine={1} />
                                    <SpaceComponent height={4} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TextComponent
                                            text={item.variant?.name ? item.variant.name : 'Default'}
                                            size={12} color={appColors.gray}
                                        />
                                        <TextComponent text={`x${item.quantity}`} size={12} font={fontFamilies.bold} />
                                    </View>
                                    <SpaceComponent height={4} />
                                    <TextComponent
                                        text={`${((item.variant?.price || item.product?.price || 0) * item.quantity).toLocaleString()}đ`}
                                        color={appColors.primary}
                                        font={fontFamilies.bold}
                                        size={13}
                                    />
                                </View>
                            </RowComponent>
                            {index < cartItems.length - 1 && <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />}
                        </View>
                    ))}
                </GlassView>

                <SpaceComponent height={20} />

                {/* Payment Method */}
                <GlassView style={styles.card}>
                    <RowComponent styles={{ marginBottom: 12 }}>
                        <Card size={22} color={appColors.success} variant="Bold" />
                        <SpaceComponent width={8} />
                        <TextComponent text="Phương thức thanh toán" font={fontFamilies.bold} size={16} />
                    </RowComponent>

                    <TouchableOpacity onPress={() => setPaymentMethod('cod')} style={styles.paymentOption}>
                        <RowComponent>
                            <Moneys size={24} color={appColors.primary} />
                            <SpaceComponent width={12} />
                            <TextComponent text="Thanh toán khi nhận hàng (COD)" flex={1} />
                            <View style={[styles.radio, paymentMethod === 'cod' && styles.radioSelected]}>
                                {paymentMethod === 'cod' && <View style={styles.radioInner} />}
                            </View>
                        </RowComponent>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setPaymentMethod('bank')} style={styles.paymentOption}>
                        <RowComponent>
                            <Card size={24} color={appColors.primary} />
                            <SpaceComponent width={12} />
                            <TextComponent text="Chuyển khoản ngân hàng" flex={1} />
                            <View style={[styles.radio, paymentMethod === 'bank' && styles.radioSelected]}>
                                {paymentMethod === 'bank' && <View style={styles.radioInner} />}
                            </View>
                        </RowComponent>
                    </TouchableOpacity>
                </GlassView>

                <SpaceComponent height={20} />

                {/* Order Summary */}
                <GlassView style={styles.card}>
                    <RowComponent styles={{ marginBottom: 12 }}>
                        <Note size={22} color={appColors.text} variant="Bold" />
                        <SpaceComponent width={8} />
                        <TextComponent text="Chi tiết thanh toán" font={fontFamilies.bold} size={16} />
                    </RowComponent>

                    <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
                        <TextComponent text="Tổng tiền hàng" color={appColors.gray} />
                        <TextComponent text={`${cartTotal.toLocaleString()}đ`} font={fontFamilies.medium} />
                    </RowComponent>

                    <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
                        <TextComponent text="Phí vận chuyển" color={appColors.gray} />
                        <TextComponent text={SHIPPING_FEE === 0 ? "Miễn phí" : `${SHIPPING_FEE.toLocaleString()}đ`} color={SHIPPING_FEE === 0 ? appColors.success : appColors.text} font={fontFamilies.medium} />
                    </RowComponent>

                    <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 8 }} />

                    <RowComponent justify="space-between">
                        <TextComponent text="Tổng thanh toán" font={fontFamilies.bold} size={16} />
                        <TextComponent text={`${totalAmount.toLocaleString()}đ`} font={fontFamilies.bold} size={18} color={appColors.primary} />
                    </RowComponent>
                </GlassView>

            </SectionComponent>

            <View style={styles.footer}>
                <RowComponent justify="space-between" styles={{ flex: 1 }}>
                    <View>
                        <TextComponent text="Tổng thanh toán" size={12} color={appColors.gray} />
                        <TextComponent text={`${totalAmount.toLocaleString()}đ`} font={fontFamilies.bold} size={20} color={appColors.primary} />
                    </View>
                    <ButtonComponent
                        text="Đặt hàng"
                        type="primary"
                        styles={{ width: 140, borderRadius: 12 }}
                        onPress={handlePlaceOrder}
                    />
                </RowComponent>
            </View>
        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderColor: appColors.white,
        borderWidth: 1.5
    },
    divider: {
        width: 1,
        height: 14,
        backgroundColor: appColors.gray,
        marginHorizontal: 8
    },
    paymentOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)'
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
        borderColor: appColors.primary
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: appColors.primary
    },
    footer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        backgroundColor: appColors.white,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10
    }
});

export default CheckoutScreen;
