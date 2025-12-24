import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, cartCountSelector, getCart } from '../../redux/reducers/cartReducer';
import { addressSelector } from '../../redux/reducers/addressReducer';
import { useTranslation } from '../../../node_modules/react-i18next';
import {
    View,
    StyleSheet,
    StatusBar,
    Platform,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    Text,
    FlatList,
    Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Bag2, Heart, Add, Minus, Location, ArrowRight2, Message, ShoppingCart, More, Star, Shop, Tag, ShieldTick } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { ContainerComponent, RowComponent, SpaceComponent, TextComponent, ButtonComponent, SectionComponent } from '../../components';
import productApi from '../../apis/productApi';

const { width, height } = Dimensions.get('window');

const ProductDetail = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { id }: any = route.params;
    const selectedAddress = useSelector(addressSelector);
    const cartCount = useSelector(cartCountSelector);

    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [attributeGroups, setAttributeGroups] = useState<any[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        getData();
        getRelated();
        dispatch(getCart() as any);
    }, [id]);

    // ... (keep getData/getRelated)

    // In return JSX, replace the Bag2 button:


    const getData = async () => {
        try {
            const res = await productApi.getProductDetail(id);
            if (res && res.data) {
                setProduct(res.data);
            } else {
                throw new Error("No data");
            }
        } catch (error) {
            console.log('Error fetching product detail:', error);
            // Detailed Mock Data Fallback
            setProduct({
                id: id,
                name: "Tai Nghe Sony WH-1000XM5 Chống Ồn Chủ Động",
                price: 6490000,
                description: "Tai nghe chống ồn hàng đầu thị trường với thiết kế mới nhẹ hơn, ôm sát tai hơn. Âm thanh Hi-Res chuẩn mực, pin trâu 30 giờ.",
                brand: "Sony",
                image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600",
                images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600"],
                category: { name: "Đồ điện tử" },
                shop: {
                    name: "Sony Official Store",
                    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100"
                },
                variants: [
                    {
                        id: "v1",
                        price: 6490000,
                        image_url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600",
                        values: [
                            { value: "Đen", attribute: { name: "Màu sắc" } },
                            { value: "Tiêu chuẩn", attribute: { name: "Phiên bản" } }
                        ]
                    },
                    {
                        id: "v2",
                        price: 6590000,
                        image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
                        values: [
                            { value: "Bạc", attribute: { name: "Màu sắc" } },
                            { value: "Tiêu chuẩn", attribute: { name: "Phiên bản" } }
                        ]
                    }
                ]
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getRelated = async () => {
        try {
            const res = await productApi.getProducts();
            if (res && res.data) {
                setRelatedProducts(res.data.filter((p: any) => p.id !== id).slice(0, 5));
            }
        } catch (error) {
            console.log('Error fetching related:', error);
            // Mock Related Products
            setRelatedProducts([
                { id: "2", name: "Apple AirPods Pro 2", price: 5490000, image: "https://images.unsplash.com/photo-1603351154351-5cf99bc32f2d?w=200" },
                { id: "3", name: "Loa Bluetooth JBL Flip 6", price: 2900000, image: "https://images.unsplash.com/photo-1626218174397-b8f3629b3987?w=200" },
                { id: "4", name: "Sạc Dự Phòng Anker", price: 890000, image: "https://images.unsplash.com/photo-1609592424368-765f3f4d6738?w=200" },
            ]);
        }
    }

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

            const firstVariant = variants[0];
            setSelectedVariant(firstVariant);

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
        if (!product || !product.variants || product.variants.length === 0) return product ? product.price : 0;
        return product.variants[0].price;
    }

    const getImage = () => {
        if (selectedVariant && selectedVariant.image_url) return selectedVariant.image_url;
        if (selectedVariant && selectedVariant.image) return selectedVariant.image;
        if (!product) return '';
        if (product.image) return product.image;
        if (product.variants && product.variants.length > 0) return product.variants[0].image_url;
        return 'https://via.placeholder.com/300';
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={appColors.primary} />
            </View>
        );
    }

    if (!product) return <View><Text>Product not found</Text></View>;

    const price = parseInt(getPrice());
    const originalPrice = price * 1.2;

    const handleAddToCart = async () => {
        if (product) {
            const data = {
                product_id: product.id,
                variant_id: selectedVariant ? selectedVariant.id : null,
                quantity: quantity
            };
            try {
                await dispatch(addToCart(data) as any).unwrap();
                Alert.alert(t('common:success'), t('profile:add_to_cart_success') || 'Added to cart successfully');
            } catch (error: any) {
                console.log('Error adding to cart:', error);
                Alert.alert(t('common:error'), error || 'Failed to add to cart');
            }
        }
    };

    const handleBuyNow = () => {
        const item = {
            product,
            variant: selectedVariant,
            quantity
        };
        (navigation as any).navigate('CheckoutScreen', { items: [item] });
    };

    return (
        <View style={{ flex: 1, backgroundColor: appColors.white }}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
                    <ArrowLeft size={22} color={appColors.text} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity style={styles.circleBtn}>
                        <Heart size={22} color={appColors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.circleBtn} onPress={() => (navigation as any).navigate('CartScreen')}>
                        <View>
                            <Bag2 size={22} color={appColors.text} />
                            {cartCount > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    top: -4,
                                    right: -4,
                                    backgroundColor: appColors.danger,
                                    minWidth: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1.5,
                                    borderColor: appColors.white
                                }}>
                                    <TextComponent text={cartCount > 9 ? '9+' : cartCount.toString()} size={8} color={appColors.white} font={fontFamilies.bold} />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Product Image */}
                <View style={{ width: width, height: width, backgroundColor: '#F9F9F9' }}>
                    <Image source={{ uri: getImage() }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>

                {/* Main Info */}
                <View style={styles.container}>
                    {/* Brand & Category Tags */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        {product.brand && (
                            <View style={styles.tagBadge}>
                                <TextComponent text={product.brand.toUpperCase()} size={10} font={fontFamilies.bold} color={appColors.primary} />
                            </View>
                        )}
                        <View style={[styles.tagBadge, { backgroundColor: '#F0F0F0' }]}>
                            <TextComponent text={product.category?.name || t('common:category')} size={10} font={fontFamilies.medium} color={appColors.gray} />
                        </View>
                    </View>

                    <TextComponent text={product.name} font={fontFamilies.medium} size={20} color={appColors.text} numberOfLine={2} />

                    <SpaceComponent height={12} />

                    <RowComponent justify="space-between">
                        <RowComponent styles={{ alignItems: 'flex-end' }}>
                            <TextComponent
                                text={`${price.toLocaleString('vi-VN')}đ`}
                                font={fontFamilies.bold}
                                size={26}
                                color={appColors.primary}
                            />
                            <SpaceComponent width={8} />
                            <TextComponent
                                text={`${originalPrice.toLocaleString('vi-VN')}đ`}
                                size={14}
                                color={appColors.gray4}
                                styles={{ textDecorationLine: 'line-through', marginBottom: 4 }}
                            />
                        </RowComponent>
                        <RowComponent>
                            <Star size={16} color="#FFC107" variant="Bold" />
                            <SpaceComponent width={4} />
                            <TextComponent text="4.8" font={fontFamilies.bold} size={14} />
                            <TextComponent text=" (1.2k)" color={appColors.gray4} size={13} />
                        </RowComponent>
                    </RowComponent>
                </View>

                <View style={{ height: 8, backgroundColor: '#F7F7F7' }} />

                {/* Variants */}
                {attributeGroups.length > 0 && (
                    <View style={styles.container}>
                        <TextComponent text={t('profile:product_options')} font={fontFamilies.semiBold} size={16} color={appColors.text} />
                        <SpaceComponent height={12} />
                        {attributeGroups.map((group, index) => (
                            <View key={index} style={{ marginBottom: 16 }}>
                                <TextComponent text={group.name} size={13} color={appColors.gray} />
                                <SpaceComponent height={8} />
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                    {group.values.map((val: string, vIndex: number) => {
                                        const isSelected = selectedAttributes[group.name] === val;
                                        return (
                                            <TouchableOpacity
                                                key={vIndex}
                                                onPress={() => handleSelectAttribute(group.name, val)}
                                                style={[
                                                    styles.cleanChip,
                                                    isSelected && styles.cleanChipSelected
                                                ]}
                                            >
                                                <TextComponent
                                                    text={val}
                                                    size={13}
                                                    color={isSelected ? appColors.white : appColors.text}
                                                    font={isSelected ? fontFamilies.medium : fontFamilies.regular}
                                                />
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={{ height: 8, backgroundColor: '#F7F7F7' }} />

                {/* Shipping & Delivery */}
                <View style={styles.container}>
                    <RowComponent justify="space-between" styles={{ alignItems: 'flex-start' }}>
                        <RowComponent styles={{ flex: 1 }}>
                            <Location size={22} color={appColors.warning} variant="Bold" />
                            <SpaceComponent width={12} />
                            <View style={{ flex: 1 }}>
                                <TextComponent text="Giao đến" size={13} color={appColors.gray} />
                                <SpaceComponent height={4} />
                                <TextComponent
                                    text={selectedAddress ? selectedAddress.address : "Vị trí của bạn"}
                                    size={14}
                                    color={appColors.text}
                                    font={fontFamilies.medium}
                                    numberOfLine={1}
                                />
                            </View>
                        </RowComponent>
                        <TouchableOpacity onPress={() => (navigation as any).navigate('AddressList')}>
                            <TextComponent text="Thay đổi" color={appColors.primary} font={fontFamilies.bold} size={13} />
                        </TouchableOpacity>
                    </RowComponent>

                    <SpaceComponent height={16} />

                    <View style={{
                        backgroundColor: '#F0F8FF',
                        padding: 12,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <ShieldTick size={28} color={appColors.primary} variant="Bold" />
                        <SpaceComponent width={12} />
                        <View>
                            <TextComponent text="Miễn phí vận chuyển" font={fontFamilies.bold} size={14} color={appColors.text} />
                            <TextComponent text="Dự kiến giao: 2-3 ngày" size={12} color={appColors.gray} />
                        </View>
                    </View>
                </View>

                <View style={{ height: 8, backgroundColor: '#F7F7F7' }} />

                <View style={styles.container}>
                    <TouchableOpacity onPress={() => console.log('View Shop')}>
                        <RowComponent>
                            {product.shop?.image ? (
                                <Image source={{ uri: product.shop.image }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                            ) : (
                                <View style={styles.shopAvatar}>
                                    <Shop size={24} color={appColors.white} variant="Bold" />
                                </View>
                            )}

                            <SpaceComponent width={12} />

                            <View style={{ flex: 1 }}>
                                <TextComponent text={product.shop?.name || "Cửa Hàng Chính Hãng Apple"} font={fontFamilies.bold} size={16} />
                                <SpaceComponent height={4} />
                                <RowComponent justify="flex-start" styles={{ alignItems: 'center' }}>
                                    <TextComponent text="Online 2 giờ trước" size={12} color={appColors.gray} />
                                    <SpaceComponent width={6} />
                                    <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: appColors.gray }} />
                                    <SpaceComponent width={6} />
                                    <Shop size={14} color={appColors.primary} variant="Bold" />
                                    <SpaceComponent width={4} />
                                    <TextComponent text="Chính hãng" size={12} color={appColors.primary} />
                                </RowComponent>
                            </View>

                            <ArrowRight2 size={24} color={appColors.gray} />
                        </RowComponent>
                    </TouchableOpacity>

                    <View style={{ height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 }} />

                    <RowComponent justify="space-between">
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <TextComponent text="4.9" font={fontFamilies.bold} size={16} color={appColors.text} />
                            </View>
                            <SpaceComponent height={4} />
                            <TextComponent text="Đánh giá" size={12} color={appColors.gray} />
                        </View>

                        <View style={{ width: 1, height: 24, backgroundColor: '#F0F0F0' }} />

                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <TextComponent text="98%" font={fontFamilies.bold} size={16} color={appColors.text} />
                            <SpaceComponent height={4} />
                            <TextComponent text="Phản hồi" size={12} color={appColors.gray} />
                        </View>

                        <View style={{ width: 1, height: 24, backgroundColor: '#F0F0F0' }} />

                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <TextComponent text="15k" font={fontFamilies.bold} size={16} color={appColors.text} />
                            <SpaceComponent height={4} />
                            <TextComponent text="Sản phẩm" size={12} color={appColors.gray} />
                        </View>
                    </RowComponent>
                </View>

                <View style={{ height: 8, backgroundColor: '#F7F7F7' }} />

                <View style={styles.container}>
                    <TextComponent text={t('profile:product_description')} font={fontFamilies.semiBold} size={16} />
                    <SpaceComponent height={8} />
                    <TextComponent text={product.description} size={14} color={appColors.text} styles={{ lineHeight: 22 }} />
                </View>

                {relatedProducts.length > 0 && (
                    <View style={{ marginTop: 16 }}>
                        <TextComponent text={t('profile:related_products')} font={fontFamilies.semiBold} size={18} styles={{ marginHorizontal: 16, marginBottom: 12 }} />
                        <FlatList
                            horizontal
                            data={relatedProducts}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                            ItemSeparatorComponent={() => <SpaceComponent width={12} />}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => (navigation as any).push('ProductDetail', { id: item.id })}
                                    style={styles.relatedItem}
                                >
                                    <Image source={{ uri: item.image || item.image_url }} style={{ width: 140, height: 140, borderRadius: 8 }} resizeMode="cover" />
                                    <SpaceComponent height={8} />
                                    <TextComponent text={item.name} numberOfLine={2} size={13} font={fontFamilies.medium} />
                                    <SpaceComponent height={4} />
                                    <TextComponent text={`${item.price ? item.price.toLocaleString() : 0}đ`} color={appColors.primary} size={13} font={fontFamilies.bold} />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </ScrollView>

            <View style={styles.bottomBar}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                    <TouchableOpacity style={styles.circleBtn} onPress={() => (navigation as any).navigate('CartScreen')}>
                        <Bag2 size={22} color={appColors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <Message size={22} color={appColors.text} />
                        <TextComponent text={t('profile:chat_now')} size={10} color={appColors.gray} />
                    </TouchableOpacity>
                    <View style={{ width: 1, height: 20, backgroundColor: appColors.gray8 }} />
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleAddToCart}>
                        <ShoppingCart size={22} color={appColors.text} />
                        <TextComponent text={t('profile:add_to_cart')} size={10} color={appColors.gray} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20, gap: 12 }}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#E3F2FD' }]} onPress={handleBuyNow}>
                        <TextComponent text={t('profile:buy_now')} color={appColors.primary} font={fontFamilies.bold} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: appColors.primary }]} onPress={handleAddToCart}>
                        <TextComponent
                            text={`${(price * quantity).toLocaleString()}đ`}
                            color={appColors.white}
                            font={fontFamilies.bold}
                            numberOfLine={1}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 100
    },
    circleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    container: {
        padding: 16,
        backgroundColor: appColors.white
    },
    tagBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: '#E3F2FD'
    },
    cleanChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: appColors.gray9,
        backgroundColor: appColors.white
    },
    cleanChipSelected: {
        backgroundColor: appColors.primary,
        borderColor: appColors.primary
    },
    shopAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: appColors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    relatedItem: {
        width: 140,
        marginBottom: 10
    },
    bottomBar: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        backgroundColor: appColors.white,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionBtn: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ProductDetail;
