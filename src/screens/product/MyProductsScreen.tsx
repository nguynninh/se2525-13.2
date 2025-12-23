import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ContainerComponent, TextComponent, SectionComponent, ButtonComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { Add } from 'iconsax-react-native';
import productApi from '../../apis/productApi';
import { useTranslation } from '../../../node_modules/react-i18next';
import { useNavigation } from '@react-navigation/native';

const MyProductsScreen = () => {
    const [products, setProducts] = useState<any[]>([]);
    const { t } = useTranslation(['product', 'common']);
    const navigation: any = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getData();
        });
        return unsubscribe;
    }, [navigation]);

    const getData = async () => {
        try {
            const res = await productApi.getMyProducts();
            setProducts(res.data.products);
        } catch (error) {
            console.log(error);
        }
    };

    const renderProductItem = ({ item }: { item: any }) => (
        <View
            style={{
                padding: 12,
                marginVertical: 6,
                backgroundColor: appColors.white,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            }}>
            <View style={{ flex: 1 }}>
                <TextComponent text={item.name} title size={16} />
                <TextComponent text={`${t('common:price')}: $${item.variants?.[0]?.price || 0}`} color={appColors.primary} />
                <TextComponent text={`${t('common:brand')}: ${item.brand || 'No Brand'}`} size={12} color={appColors.gray} />
                <TextComponent text={item.seller_request_status === 'pending' ? 'Pending Approval' : 'Active'} size={12} color={item.seller_request_status === 'pending' ? appColors.warning : appColors.success} />
            </View>
        </View>
    );

    return (
        <ContainerComponent isScroll={false} title={t('product:my_products', { defaultValue: 'My Products' })}>
            <SectionComponent styles={{ flex: 1 }}>
                <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id.toString()}
                    ListEmptyComponent={
                        <SectionComponent styles={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TextComponent text={t('common:data_not_found')} />
                        </SectionComponent>
                    }
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </SectionComponent>

            <View
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddProduct')}
                    style={{
                        backgroundColor: appColors.primary,
                        borderRadius: 100,
                        padding: 14,
                        elevation: 4,
                    }}>
                    <Add size={32} color={appColors.white} />
                </TouchableOpacity>
            </View>
        </ContainerComponent>
    );
};

export default MyProductsScreen;
