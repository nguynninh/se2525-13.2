import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Image, Modal, FlatList } from 'react-native';
import { ContainerComponent, TextComponent, InputComponent, ButtonComponent, SectionComponent, RowComponent, SpaceComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Gallery, ArrowDown2 } from 'iconsax-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storeApi from '../../apis/storeApi';
import addressApi from '../../apis/addressApi';
import { useDispatch } from 'react-redux';
import { getProfile } from '../../redux/reducers/userReducer';
import { fontFamilies } from '../../constants/fontFamilies';

const SellerRegistrationScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        store_name: '',
        address: '',
        phone: '',
        tax_code: '',
        logo: '',
        cover_image: '',
        province_code: '',
        district_code: '',
        ward_code: ''
    });

    // Address State
    const [provinces, setProvinces] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<any>(null);
    const [selectedWard, setSelectedWard] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectionType, setSelectionType] = useState<'province' | 'ward'>('province');

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleChooseImage = async (field: 'logo' | 'cover_image') => {
        try {
            const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
            if (result.assets && result.assets[0].uri) {
                handleChange(field, result.assets[0].uri);
            }
        } catch (error) {
            console.log(error);
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
                Alert.alert('Error', 'Can not fetch provinces');
            }
        } else if (type === 'ward' && selectedProvince) {
            try {
                const res = await addressApi.getWards(selectedProvince.code);
                if (res && res.data) {
                    setWards(res.data);
                }
            } catch (error) {
                console.log('Error fetching wards:', error);
                Alert.alert('Error', 'Can not fetch wards');
            }
        }
    };

    const handleSelect = (item: any) => {
        if (selectionType === 'province') {
            setSelectedProvince(item);
            setSelectedWard(null);
            setWards([]);
            handleChange('province_code', item.code);
            handleChange('ward_code', ''); // Reset ward
        } else {
            setSelectedWard(item);
            handleChange('ward_code', item.code);
        }
        setIsVisible(false);
    };

    const handleSubmit = async () => {
        // Validation: store_name, address, phone are mandatory. Province/Ward should heavily be encouraged or mandatory.
        if (!formData.store_name || !formData.address || !formData.phone || !formData.province_code || !formData.ward_code) {
            Alert.alert(t('common:error'), 'Vui lòng điền các thông tin bắt buộc (Tên, SĐT, Địa chỉ, Tỉnh, Xã)');
            return;
        }

        setIsLoading(true);
        try {
            const formDataObject = new FormData();
            formDataObject.append('store_name', formData.store_name);
            formDataObject.append('address', formData.address);
            formDataObject.append('phone', formData.phone);
            formDataObject.append('tax_code', formData.tax_code || '');
            formDataObject.append('province_code', formData.province_code);
            formDataObject.append('ward_code', formData.ward_code);
            formDataObject.append('district_code', '');

            if (formData.logo) {
                const logoFile = {
                    uri: formData.logo,
                    name: 'logo.jpg',
                    type: 'image/jpeg',
                } as any;
                formDataObject.append('logo', logoFile);
            }

            if (formData.cover_image) {
                const coverFile = {
                    uri: formData.cover_image,
                    name: 'cover_image.jpg',
                    type: 'image/jpeg',
                } as any;
                formDataObject.append('cover_image', coverFile);
            }

            await storeApi.registerStore(formDataObject);
            await dispatch(getProfile() as any);

            Alert.alert(t('common:success'), 'Đăng ký thành công! Vui lòng chờ duyệt.', [
                {
                    text: 'OK', onPress: () => {
                        navigation.goBack();
                    }
                }
            ]);
        } catch (error: any) {
            Alert.alert(t('common:error'), error.message || 'Có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ContainerComponent isImageBackground>
            <SectionComponent>
                <RowComponent justify="flex-start">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={appColors.text} />
                    </TouchableOpacity>
                    <SpaceComponent width={12} />
                    <TextComponent text="Đăng ký bán hàng" title size={20} />
                </RowComponent>
            </SectionComponent>

            <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>

                <TextComponent text="Thông tin cửa hàng" title size={16} styles={{ marginBottom: 16 }} />

                <InputComponent
                    value={formData.store_name}
                    onChange={val => handleChange('store_name', val)}
                    placeholder="Tên cửa hàng *"
                    allowClear
                />
                <SpaceComponent height={16} />

                <InputComponent
                    value={formData.phone}
                    onChange={val => handleChange('phone', val)}
                    placeholder="Số điện thoại liên hệ *"
                    type="number-pad"
                    allowClear
                />
                <SpaceComponent height={16} />

                <RowComponent>
                    <View style={{ flex: 1 }}>
                        <InputComponent
                            value={selectedProvince ? selectedProvince.name : ''}
                            onChange={() => { }}
                            placeholder="Tỉnh/Thành phố *"
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
                            placeholder="Phường/Xã *"
                            suffix={<ArrowDown2 size={20} color={appColors.text} />}
                            disabled
                            onPress={() => {
                                if (selectedProvince) handleOpenModal('ward');
                                else Alert.alert('Lưu ý', 'Vui lòng chọn Tỉnh/Thành phố trước');
                            }}
                        />
                    </View>
                </RowComponent>
                <SpaceComponent height={16} />

                <InputComponent
                    value={formData.address}
                    onChange={val => handleChange('address', val)}
                    placeholder="Số nhà, tên đường *"
                    allowClear
                    multiline
                    numberOfLines={3}
                />
                <SpaceComponent height={16} />

                <InputComponent
                    value={formData.tax_code}
                    onChange={val => handleChange('tax_code', val)}
                    placeholder="Mã số thuế"
                    allowClear
                />
                <SpaceComponent height={24} />

                <TextComponent text="Hình ảnh" title size={16} />
                <SpaceComponent height={12} />

                <RowComponent justify="space-between" styles={{ alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <TextComponent text="Logo" size={14} styles={{ marginBottom: 8 }} />
                        <TouchableOpacity
                            onPress={() => handleChooseImage('logo')}
                            style={{
                                height: 100,
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#ddd',
                                overflow: 'hidden'
                            }}
                        >
                            {formData.logo ? (
                                <Image source={{ uri: formData.logo }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                            ) : (
                                <Gallery size={24} color={appColors.gray5} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <TextComponent text="Ảnh bìa" size={14} styles={{ marginBottom: 8 }} />
                        <TouchableOpacity
                            onPress={() => handleChooseImage('cover_image')}
                            style={{
                                height: 100,
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#ddd',
                                overflow: 'hidden'
                            }}
                        >
                            {formData.cover_image ? (
                                <Image source={{ uri: formData.cover_image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                            ) : (
                                <Gallery size={24} color={appColors.gray5} />
                            )}
                        </TouchableOpacity>
                    </View>
                </RowComponent>

                <SpaceComponent height={32} />

                <ButtonComponent
                    text="Gửi đăng ký"
                    type="primary"
                    onPress={handleSubmit}
                    disable={isLoading}
                />

                <SpaceComponent height={100} />

            </ScrollView>

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
                            <TextComponent text={selectionType === 'province' ? 'Chọn Tỉnh/Thành phố' : 'Chọn Phường/Xã'} title size={18} font={fontFamilies.bold} color={appColors.text} />
                            <TouchableOpacity onPress={() => setIsVisible(false)}>
                                <View style={{ padding: 4 }}>
                                    <TextComponent text="Đóng" color={appColors.gray} />
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
        </ContainerComponent>
    );
};

export default SellerRegistrationScreen;
