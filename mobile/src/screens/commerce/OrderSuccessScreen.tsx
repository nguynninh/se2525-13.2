import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ContainerComponent, TextComponent, ButtonComponent, SectionComponent, SpaceComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { TickCircle } from 'iconsax-react-native';

const OrderSuccessScreen = () => {
    const navigation = useNavigation();
    const [timeLeft, setTimeLeft] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleHome();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleHome = () => {
        // Navigate to TabNavigator -> HomeScreen
        // Since Checkout is in CommerceNavigator, and Home is usually the root of a tab or stack.
        // 'HomeScreen' name implies it's a registered screen.
        (navigation as any).navigate('HomeScreen');

        // Alternatively, reset to ensure no back history to checkout
        /*
        navigation.reset({
           index: 0,
           routes: [{ name: 'HomeScreen' }],
        });
        */
    };

    return (
        <ContainerComponent isScroll={false}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColors.white }}>
                <TickCircle size={80} color={appColors.success} variant="Bold" />
                <SpaceComponent height={24} />
                <TextComponent text="Đặt hàng thành công!" font={fontFamilies.bold} size={22} color={appColors.text} />
                <SpaceComponent height={8} />
                <TextComponent text="Cảm ơn bạn đã mua sắm tại Hiki Shop" color={appColors.gray} size={14} />

                <SpaceComponent height={40} />
                <TextComponent text={`Tự động về trang chủ sau ${timeLeft}s`} color={appColors.gray} size={13} />
            </View>

            <SectionComponent styles={{ width: '100%', paddingBottom: 20 }}>
                <ButtonComponent text="Về trang chủ ngay" type="primary" color={appColors.primary} onPress={handleHome} />
            </SectionComponent>
        </ContainerComponent>
    );
};

export default OrderSuccessScreen;
