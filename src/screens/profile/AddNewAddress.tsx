import { View, Text, Switch, ImageBackground, Platform, TouchableOpacity, ScrollView, Modal, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';
import { ButtonComponent, ContainerComponent, GlassView, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sms, User, ArrowDown2 } from 'iconsax-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import addressApi from '../../apis/addressApi';

const AddNewAddress = () => {
    // ... (same as before)

    const handleSave = async () => {
        if (!name || !phone || !address || !selectedProvince || !selectedWard) {
            Alert.alert(t('profile:error'), t('profile:fill_all_fields'));
            return;
        }

        const data = {
            name,
            phone,
            address,
            province: JSON.stringify(selectedProvince),
            district: '',
            ward: JSON.stringify(selectedWard),
            is_default: isDefault
        };

        setIsLoading(true);
        try {
            if (route.params && (route.params as any).addressData) {
                const id = (route.params as any).addressData.id;
                await addressApi.updateAddress(id, data);
            } else {
                await addressApi.addNewAddress(data);
            }
            navigation.goBack();
        } catch (error: any) {
            console.log('Error saving address:', error);
            Alert.alert(t('profile:error'), error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = async (type: 'province' | 'ward') => {
        setSelectionType(type);
        setIsVisible(true);

        if (type === 'province' && provinces.length === 0) {
            try {
                const res = await addressApi.getProvinces();
                if (res && res.data) {
                    setProvinces(res.data);
                }
            } catch (error) {
                console.log('Error fetching provinces:', error);
                Alert.alert(t('profile:error'), 'Can not fetch provinces');
            }
        } else if (type === 'ward' && selectedProvince) {
            try {
                const res = await addressApi.getWards(selectedProvince.code);
                if (res && res.data) {
                    setWards(res.data);
                }
            } catch (error) {
                console.log('Error fetching wards:', error);
                Alert.alert(t('profile:error'), 'Can not fetch wards');
            }
        }
    };
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    // Address Selection State
    const [provinces, setProvinces] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<any>(null);
    const [selectedWard, setSelectedWard] = useState<any>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [selectionType, setSelectionType] = useState<'province' | 'ward'>('province');

    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        if (route.params && (route.params as any).addressData) {
            const data = (route.params as any).addressData;
            setName(data.name);
            setPhone(data.phone);
            setAddress(data.address);
            setIsDefault(data.is_default); // API returns is_default, mock was isDefault. checking both might be safer but model says is_default

            if (data.province) {
                try {
                    const p = typeof data.province === 'string' ? JSON.parse(data.province) : data.province;
                    setSelectedProvince(p);
                } catch (e) { console.log(e) }
            }
            if (data.ward) {
                try {
                    const w = typeof data.ward === 'string' ? JSON.parse(data.ward) : data.ward;
                    setSelectedWard(w);
                } catch (e) { console.log(e) }
            }
        }
    }, [route.params]);



    const handleSelect = (item: any) => {
        if (selectionType === 'province') {
            setSelectedProvince(item);
            setSelectedWard(null); // Reset ward
            setWards([]); // Clear wards
        } else {
            setSelectedWard(item);
        }
        setIsVisible(false);
    };

    const bgImage = { uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop' };

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={bgImage} style={{ flex: 1 }} blurRadius={Platform.OS === 'ios' ? 10 : 3}>
                <View style={{
                    paddingTop: Platform.OS === 'ios' ? 50 : 30,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 20
                }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{
                        width: 40, height: 40, borderRadius: 20,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <ArrowLeft size={24} color={appColors.text} />
                    </TouchableOpacity>
                    <SpaceComponent width={12} />
                    <TextComponent text={route.params && (route.params as any).addressData ? t('profile:update_address') : t('profile:add_new_address')} title color={appColors.text} size={20} font={fontFamilies.bold} />
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                    <GlassView style={{ padding: 16, borderRadius: 16 }}>
                        <InputComponent
                            value={name}
                            onChange={val => setName(val)}
                            placeholder={t('profile:full_name')}
                            affix={<User size={22} color={appColors.text} />}
                            allowClear
                        />
                        <SpaceComponent height={16} />
                        <InputComponent
                            value={phone}
                            onChange={val => setPhone(val)}
                            placeholder={t('profile:phone_number')}
                            affix={<Sms size={22} color={appColors.text} />}
                            type="phone-pad"
                            allowClear
                        />
                        <SpaceComponent height={16} />
                        {/* Selection Fields */}
                        <RowComponent>
                            <View style={{ flex: 1 }}>
                                <InputComponent
                                    value={selectedProvince ? selectedProvince.name : ''}
                                    onChange={() => { }}
                                    placeholder={t('profile:province')}
                                    suffix={<ArrowDown2 size={20} color={appColors.text} />}
                                    disabled
                                    onPress={() => handleOpenModal('province')}
                                />
                            </View>
                            <SpaceComponent width={10} />
                            <View style={{ flex: 1 }}>
                                <InputComponent
                                    value={selectedWard ? selectedWard.name : ''}
                                    onChange={() => { }}
                                    placeholder={t('profile:ward')}
                                    suffix={<ArrowDown2 size={20} color={appColors.text} />}
                                    disabled
                                    onPress={() => {
                                        if (selectedProvince) handleOpenModal('ward');
                                        else Alert.alert(t('profile:warning'), t('profile:select_province_first'));
                                    }}
                                />
                            </View>
                        </RowComponent>
                        <SpaceComponent height={16} />
                        <InputComponent
                            value={address}
                            onChange={val => setAddress(val)}
                            placeholder={t('profile:detail_address')}
                            multiline
                            numberOfLines={3}
                            allowClear
                        />

                        <SpaceComponent height={16} />
                        <RowComponent justify="space-between">
                            <TextComponent text={t('profile:default_address')} color={appColors.text} size={16} />
                            <Switch
                                trackColor={{ false: appColors.gray, true: appColors.primary }}
                                thumbColor={appColors.white}
                                onValueChange={() => setIsDefault(!isDefault)}
                                value={isDefault}
                            />
                        </RowComponent>
                    </GlassView>

                    <SpaceComponent height={24} />
                    <ButtonComponent
                        text={isLoading ? 'Loading...' : t('profile:save')}
                        type="primary"
                        onPress={handleSave}
                    />
                </ScrollView>

                {/* Selection Modal */}
                <Modal visible={isVisible} transparent animationType="slide">
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                        <View style={{
                            backgroundColor: appColors.white,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                            maxHeight: '80%'
                        }}>
                            <RowComponent justify="space-between">
                                <TextComponent text={selectionType === 'province' ? t('profile:province') : t('profile:ward')} title size={18} font={fontFamilies.bold} color={appColors.text} />
                                <TouchableOpacity onPress={() => setIsVisible(false)}>
                                    <View style={{ padding: 4 }}>
                                        <TextComponent text="Close" color={appColors.gray} />
                                    </View>
                                </TouchableOpacity>
                            </RowComponent>
                            <SpaceComponent height={16} />
                            <FlatList
                                data={selectionType === 'province' ? provinces : wards}
                                keyExtractor={(item) => item.code}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelect(item)} style={{ paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: appColors.gray8 }}>
                                        <TextComponent text={item.name} color={appColors.text} size={16} />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

            </ImageBackground>
        </View>
    );
};

export default AddNewAddress;
