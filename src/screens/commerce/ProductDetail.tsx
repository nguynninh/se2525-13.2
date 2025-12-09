
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { addressSelector } from '../../redux/reducers/addressReducer';
import { useTranslation } from 'react-i18next';
import {
    View,
    StyleSheet,
    StatusBar,
    Platform,
    ImageBackground,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Bag2, Heart, Add, Minus, Location, ArrowRight2 } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { ContainerComponent, RowComponent, SpaceComponent, TextComponent, GlassView, ButtonComponent } from '../../components';
import productApi from '../../apis/productApi';

const { width, height } = Dimensions.get('window');

const ProductDetail = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();
    const { id }: any = route.params;
    const selectedAddress = useSelector(addressSelector);

    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [attributeGroups, setAttributeGroups] = useState<any[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);

    // Same background as HomeScreen
    const bgImage = { uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop' };

    useEffect(() => {
        getData();
    }, [id]);

    const getData = async () => {
        try {
            const res = await productApi.getProductDetail(id);
            if (res && res.data) {
                setProduct(res.data);
            }
        } catch (error) {
            console.log('Error fetching product detail:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            const groups: any[] = [];
            const variants = product.variants;

            variants.forEach((variant: any) => {
                if (variant.values) {
                    variant.values.forEach((val: any) => {
                        const attrName = val.attribute.name;
                        const attrValue = val.value;

                        let group = groups.find(g => g.name === attrName);
                        if (!group) {
                            group = { name: attrName, values: [] };
                            groups.push(group);
                        }
                        if (!group.values.includes(attrValue)) {
                            group.values.push(attrValue);
                        }
                    });
                }
            });
            setAttributeGroups(groups);

            // 2. Select default variant (first one)
            const firstVariant = variants[0];
            setSelectedVariant(firstVariant);

            // 3. Set initial selected attributes based on first variant
            const initialAttrs: Record<string, string> = {};
            if (firstVariant.values) {
                firstVariant.values.forEach((val: any) => {
                    initialAttrs[val.attribute.name] = val.value;
                });
            }
            setSelectedAttributes(initialAttrs);
        }
    }, [product]);

    const handleSelectAttribute = (attrName: string, value: string) => {
        const newSelectedAttrs = { ...selectedAttributes, [attrName]: value };
        setSelectedAttributes(newSelectedAttrs);

        if (product && product.variants) {
            const match = product.variants.find((variant: any) => {
                if (!variant.values) return false;
                return Object.keys(newSelectedAttrs).every(key => {
                    const vVal = variant.values.find((v: any) => v.attribute.name === key);
                    return vVal && vVal.value === newSelectedAttrs[key];
                });
            });

            if (match) {
                setSelectedVariant(match);
            } else {
                const fallbackMatch = product.variants.find((variant: any) => {
                    if (!variant.values) return false;
                    const vVal = variant.values.find((v: any) => v.attribute.name === attrName);
                    return vVal && vVal.value === value;
                });

                if (fallbackMatch) {
                    setSelectedVariant(fallbackMatch);
                    // Also update the full set of attributes to match this fallback variant
                    const fallbackAttrs: Record<string, string> = {};
                    fallbackMatch.values.forEach((val: any) => {
                        fallbackAttrs[val.attribute.name] = val.value;
                    });
                    setSelectedAttributes(fallbackAttrs);
                }
            }
        }
    };

    const getPrice = () => {
        if (selectedVariant) return selectedVariant.price;
        if (!product || !product.variants || product.variants.length === 0) return 0;
        return product.variants[0].price;
    }

    const getImage = () => {
        if (selectedVariant && selectedVariant.image_url) return selectedVariant.image_url;
        if (selectedVariant && selectedVariant.image) return selectedVariant.image;

        if (!product || !product.variants || product.variants.length === 0) return '';
        return product.variants[0].image_url ? product.variants[0].image_url : (product.image ?? '');
    }


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={appColors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ImageBackground source={bgImage} style={{ flex: 1 }} blurRadius={Platform.OS === 'ios' ? 10 : 3}>
                {product && (
                    <>
                        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                            {/* Header Image Area */}
                            <View style={{ height: height * 0.5, position: 'relative' }}>
                                <Image
                                    source={{ uri: getImage() }}
                                    style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'cover' }}
                                />
                                {/* Header Buttons Overlay */}
                                <View style={styles.headerButtons}>
                                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                                        <ArrowLeft size={24} color={appColors.white} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconButton}>
                                        <Bag2 size={24} color={appColors.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Content Section */}
                            <View style={{ paddingHorizontal: 16, marginTop: -30 }}>
                                <GlassView style={{ padding: 20, borderRadius: 24, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                                    <RowComponent justify="space-between">
                                        <View style={{ flex: 1, marginRight: 10 }}>
                                            <TouchableOpacity onPress={() => navigation.navigate('AddressList' as never)}>
                                                <RowComponent>
                                                    <Location size={16} color={appColors.text} variant="Bold" />
                                                    <SpaceComponent width={4} />
                                                    <TextComponent
                                                        text={`${t('profile:delivery_to')}: ${selectedAddress ? selectedAddress.address : 'Select Address'}`}
                                                        size={12}
                                                        color={appColors.text}
                                                        numberOfLine={1}
                                                        styles={{ flex: 1 }}
                                                    />
                                                    <ArrowRight2 size={14} color={appColors.gray} />
                                                </RowComponent>
                                            </TouchableOpacity>
                                            <SpaceComponent height={12} />

                                            <TextComponent text={product.name} title size={22} color={appColors.text} font={fontFamilies.bold} />
                                            <TextComponent text={product.brand ?? 'Brand'} color={appColors.gray} size={14} />
                                        </View>
                                        <TouchableOpacity>
                                            <Heart size={24} color={appColors.danger} variant="Bold" />
                                        </TouchableOpacity>
                                    </RowComponent>

                                    <SpaceComponent height={16} />

                                    <TextComponent
                                        text={`${parseInt(getPrice()).toLocaleString('vi-VN')}đ`}
                                        title
                                        size={24}
                                        color={appColors.primary}
                                        font={fontFamilies.bold}
                                    />

                                    <SpaceComponent height={20} />

                                    {/* Attribute Selection */}
                                    {attributeGroups.map((group, index) => (
                                        <View key={index} style={{ marginBottom: 16 }}>
                                            <TextComponent text={group.name} size={16} font={fontFamilies.semiBold} color={appColors.text} />
                                            <SpaceComponent height={8} />
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                                {group.values.map((val: string, valIndex: number) => {
                                                    const isSelected = selectedAttributes[group.name] === val;
                                                    return (
                                                        <TouchableOpacity
                                                            key={valIndex}
                                                            onPress={() => handleSelectAttribute(group.name, val)}
                                                        >
                                                            <GlassView
                                                                style={{
                                                                    paddingHorizontal: 16,
                                                                    paddingVertical: 8,
                                                                    borderRadius: 20,
                                                                    backgroundColor: isSelected ? appColors.primary : 'rgba(255,255,255,0.4)',
                                                                    borderColor: isSelected ? appColors.primary : 'rgba(255,255,255,0.3)'
                                                                }}
                                                            >
                                                                <TextComponent
                                                                    text={val}
                                                                    size={14}
                                                                    color={isSelected ? appColors.white : appColors.text}
                                                                    font={isSelected ? fontFamilies.bold : fontFamilies.regular}
                                                                />
                                                            </GlassView>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    ))}


                                    {/* Quantity Selector */}
                                    <View style={{ marginBottom: 16 }}>
                                        <TextComponent text="Quantity" size={16} font={fontFamilies.semiBold} color={appColors.text} />
                                        <SpaceComponent height={8} />
                                        <RowComponent>
                                            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                                                <GlassView style={{ width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.4)' }}>
                                                    <Minus size={20} color={appColors.text} />
                                                </GlassView>
                                            </TouchableOpacity>
                                            <SpaceComponent width={16} />
                                            <TextComponent text={quantity.toString()} size={18} font={fontFamilies.bold} color={appColors.text} />
                                            <SpaceComponent width={16} />
                                            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                                                <GlassView style={{ width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.4)' }}>
                                                    <Add size={20} color={appColors.text} />
                                                </GlassView>
                                            </TouchableOpacity>
                                        </RowComponent>
                                    </View>


                                    <TextComponent text="Description" size={16} font={fontFamilies.semiBold} color={appColors.text} />
                                    <SpaceComponent height={8} />
                                    <TextComponent text={product.description} color={appColors.gray2} size={14} numberOfLine={10} />
                                </GlassView>
                            </View>
                        </ScrollView>

                        {/* Bottom Action Bar */}
                        <View style={styles.bottomBar}>
                            <GlassView style={{ flexDirection: 'row', padding: 16, borderRadius: 0, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)' }}>
                                <View>
                                    <TextComponent text="Total Price" color={appColors.gray} size={12} />
                                    <TextComponent
                                        text={`${(parseInt(getPrice()) * quantity).toLocaleString('vi-VN')}đ`}
                                        title
                                        size={20}
                                        color={appColors.text}
                                        font={fontFamilies.bold}
                                    />
                                </View>

                                <TouchableOpacity style={styles.buyButton}>
                                    <TextComponent text="Buy Now" color={appColors.white} font={fontFamilies.bold} />
                                    <Bag2 size={20} color={appColors.white} style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            </GlassView>
                        </View>
                    </>
                )}
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    headerButtons: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 999,
    },
    iconButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    buyButton: {
        backgroundColor: appColors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
    }

});

export default ProductDetail;
