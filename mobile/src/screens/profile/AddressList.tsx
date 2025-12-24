import { View, StyleSheet, ScrollView, Platform, ImageBackground, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../../../node_modules/react-i18next';
import { ContainerComponent, GlassView, RowComponent, SectionComponent, SpaceComponent, TextComponent, ButtonComponent } from '../../components';
import { Add, ArrowLeft, Edit2, Location, TickCircle, Trash } from 'iconsax-react-native';
import { Swipeable, TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import userApi from '../../apis/userApi';
import { addAddress, addressSelector, setAddresses } from '../../redux/reducers/addressReducer';

const AddressList = () => {
    const navigation = useNavigation();

    const { t } = useTranslation();

    const dispatch = useDispatch();
    const selectedAddress = useSelector(addressSelector);
    const [selectedId, setSelectedId] = useState(selectedAddress ? selectedAddress.id : '');

    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const bgImage = { uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop' };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await userApi.getShippingAddresses();
            if (res) {
                const addressList = Array.isArray(res) ? res : (res.data || []);
                setAddresses(addressList);
                dispatch(setAddresses(addressList));
                if (selectedAddress) {
                    setSelectedId(selectedAddress.id);
                }
            }
        } catch (error) {
            console.log('Error fetching addresses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAddress = (id: string) => {
        const item = addresses.find(i => i.id === id);
        if (item) {
            setSelectedId(id);
            dispatch(addAddress(item));
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            t('profile:confirm'),
            t('profile:delete_confirm_message') || 'Are you sure you want to delete this address?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => console.log('Delete cancelled')
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            console.log('Deleting address with ID:', id);
                            await addressApi.deleteAddress(id);
                            console.log('Delete success');
                            fetchData();
                        } catch (error: any) {
                            console.log('Error deleting address:', error);
                            Alert.alert(t('profile:error'), error.message || 'Could not delete address');
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderAddressLabel = (item: any) => {
        try {
            const ward = item.address?.ward?.name;
            const province = item.address?.ward?.province?.name;
            return [ward, province].filter(Boolean).join(', ');
        } catch (error) {
            return '';
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: appColors.white2 }}>
            <View style={{
                paddingTop: Platform.OS === 'ios' ? 50 : 30,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: appColors.white,
                    justifyContent: 'center', alignItems: 'center',
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
                }}>
                    <ArrowLeft size={24} color={appColors.text} />
                </TouchableOpacity>
                <TextComponent text={t('profile:delivery_address')} title color={appColors.text} size={20} font={fontFamilies.bold} />
                <View style={{ width: 40 }} />
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={appColors.primary} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
                        {(addresses || []).map((item) => {
                            const isSelected = item.id === selectedId;
                            return (
                                <Swipeable
                                    key={item.id}
                                    renderRightActions={() => (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                            <GHTouchableOpacity
                                                onPress={() => (navigation as any).navigate('AddNewAddress', { addressData: item })}
                                                style={{
                                                    backgroundColor: appColors.primary,
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 25,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginRight: 10
                                                }}>
                                                <Edit2 size={22} color={appColors.white} />
                                            </GHTouchableOpacity>
                                            <GHTouchableOpacity
                                                onPress={() => handleDelete(item.id)}
                                                style={{
                                                    backgroundColor: appColors.danger,
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 25,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                <Trash size={22} color={appColors.white} />
                                            </GHTouchableOpacity>
                                        </View>
                                    )}
                                >
                                    <TouchableOpacity onPress={() => handleSelectAddress(item.id)} activeOpacity={0.9} style={{ marginBottom: 16 }}>
                                        <View style={{
                                            padding: 16,
                                            borderRadius: 16,
                                            backgroundColor: appColors.white,
                                            // Card Shadow
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 10,
                                            elevation: 3,
                                            borderWidth: isSelected ? 1.5 : 0,
                                            borderColor: appColors.primary
                                        }}>
                                            <RowComponent justify="space-between" styles={{ alignItems: 'center' }}>
                                                <View style={{ flex: 1 }}>
                                                    <RowComponent justify="flex-start">
                                                        <TextComponent text={item.receiver_name} font={fontFamilies.bold} size={18} color={appColors.text} />
                                                        {item.is_default && (
                                                            <View style={{
                                                                marginLeft: 12,
                                                                paddingHorizontal: 10,
                                                                paddingVertical: 4,
                                                                backgroundColor: '#E3F2FD',
                                                                borderRadius: 20
                                                            }}>
                                                                <TextComponent text={t('profile:default')} size={10} color={appColors.primary} font={fontFamilies.bold} />
                                                            </View>
                                                        )}
                                                    </RowComponent>
                                                    <SpaceComponent height={8} />
                                                    <TextComponent text={item.receiver_phone} size={14} color={appColors.gray} font={fontFamilies.medium} />
                                                    <SpaceComponent height={4} />
                                                    <TextComponent text={item.address?.address_line} size={14} color={appColors.text} numberOfLine={2} styles={{ lineHeight: 20 }} />
                                                    <TextComponent text={renderAddressLabel(item)} size={13} color={appColors.gray4} numberOfLine={1} />
                                                </View>

                                                <View>
                                                    {isSelected ?
                                                        <TickCircle size={24} color={appColors.primary} variant="Bold" />
                                                        :
                                                        <View style={{
                                                            width: 20, height: 20, borderRadius: 10,
                                                            borderWidth: 1.5, borderColor: appColors.gray4
                                                        }} />
                                                    }
                                                </View>
                                            </RowComponent>
                                        </View>
                                    </TouchableOpacity>
                                </Swipeable>
                            );
                        })}
                    </ScrollView>

                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: appColors.white,
                        padding: 16,
                        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
                        borderTopWidth: 1,
                        borderTopColor: '#F0F0F0'
                    }}>
                        <ButtonComponent
                            text={t('profile:add_new_address').toUpperCase()}
                            type="primary"
                            onPress={() => navigation.navigate('AddNewAddress' as never)}
                            icon={<Add size={20} color={appColors.white} />}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

export default AddressList;
