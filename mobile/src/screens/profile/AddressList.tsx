import { View, StyleSheet, ScrollView, Platform, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress, addressSelector } from '../../redux/reducers/addressReducer';
import { useTranslation } from '../../../node_modules/react-i18next';
import { ContainerComponent, GlassView, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { Add, ArrowLeft, Edit2, Location, TickCircle, Trash } from 'iconsax-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import addressApi from '../../apis/addressApi';

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
            const res = await addressApi.getAllAddresses();
            if (res && res.data) {
                setAddresses(res.data);
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
        setIsLoading(true);
        try {
            await addressApi.deleteAddress(id);
            fetchData();
        } catch (error) {
            console.log('Error deleting address:', error);
            setIsLoading(false);
        }
    };

    const renderAddressLabel = (item: any) => {
        try {
            const ward = item.ward ? (typeof item.ward === 'string' ? JSON.parse(item.ward) : item.ward) : null;
            const province = item.province ? (typeof item.province === 'string' ? JSON.parse(item.province) : item.province) : null;
            return [ward?.name, province?.name].filter(Boolean).join(', ');
        } catch (error) {
            return '';
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={bgImage} style={{ flex: 1 }} blurRadius={Platform.OS === 'ios' ? 10 : 3}>
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
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        justifyContent: 'center', alignItems: 'center'
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
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
                        {addresses.map((item) => {
                            const isSelected = item.id === selectedId;
                            return (
                                <Swipeable
                                    key={item.id}
                                    renderRightActions={() => (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => (navigation as any).navigate('AddNewAddress', { addressData: item })}
                                                style={{
                                                    backgroundColor: appColors.primary,
                                                    padding: 12,
                                                    borderRadius: 12,
                                                    marginRight: 8,
                                                    height: '80%',
                                                    justifyContent: 'center'
                                                }}>
                                                <Edit2 size={24} color={appColors.white} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => handleDelete(item.id)}
                                                style={{
                                                    backgroundColor: appColors.danger,
                                                    padding: 12,
                                                    borderRadius: 12,
                                                    marginRight: 10,
                                                    height: '80%',
                                                    justifyContent: 'center'
                                                }}>
                                                <Trash size={24} color={appColors.white} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                >
                                    <TouchableOpacity onPress={() => handleSelectAddress(item.id)} activeOpacity={0.9}>
                                        <GlassView style={{
                                            padding: 16,
                                            marginBottom: 16,
                                            borderRadius: 16,
                                            backgroundColor: isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                                            borderColor: isSelected ? appColors.primary : appColors.gray8,
                                            borderWidth: isSelected ? 1.5 : 1
                                        }}>
                                            <RowComponent justify="space-between" styles={{ alignItems: 'center' }}>
                                                <View style={{ flex: 1 }}>
                                                    <RowComponent justify="flex-start">
                                                        <TextComponent text={item.name} font={fontFamilies.bold} size={18} color={appColors.text} />
                                                        {item.is_default && (
                                                            <View style={{
                                                                marginLeft: 12,
                                                                paddingHorizontal: 10,
                                                                paddingVertical: 4,
                                                                backgroundColor: appColors.primary,
                                                                borderRadius: 20
                                                            }}>
                                                                <TextComponent text={t('profile:default_address')} size={10} color={appColors.white} font={fontFamilies.bold} />
                                                            </View>
                                                        )}
                                                    </RowComponent>
                                                    <SpaceComponent height={8} />
                                                    <TextComponent text={item.phone} size={14} color={appColors.text} font={fontFamilies.medium} />
                                                    <SpaceComponent height={4} />
                                                    <TextComponent text={item.address} size={14} color={appColors.text} numberOfLine={2} />
                                                    <TextComponent text={renderAddressLabel(item)} size={12} color={appColors.gray} numberOfLine={1} />
                                                </View>

                                                <View>
                                                    {isSelected ?
                                                        <TickCircle size={24} color={appColors.primary} variant="Bold" />
                                                        :
                                                        <View style={{
                                                            width: 20, height: 20, borderRadius: 10,
                                                            borderWidth: 1.5, borderColor: appColors.gray
                                                        }} />
                                                    }
                                                </View>
                                            </RowComponent>
                                        </GlassView>
                                    </TouchableOpacity>
                                </Swipeable>
                            );
                        })}

                        <TouchableOpacity
                            onPress={() => navigation.navigate('AddNewAddress' as never)}
                            style={{
                                marginTop: 10,
                                alignSelf: 'center',
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                paddingHorizontal: 20,
                                paddingVertical: 12,
                                borderRadius: 24,
                                borderWidth: 1,
                                borderColor: appColors.text // Visible border
                            }}>
                            <Add size={20} color={appColors.text} />
                            <SpaceComponent width={8} />
                            <TextComponent text={t('profile:add_new_address')} color={appColors.text} font={fontFamilies.semiBold} />
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </ImageBackground>
        </View>
    );
};

export default AddressList;
