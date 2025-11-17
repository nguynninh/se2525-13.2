import { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { ContainerComponent, InputComponent, RowComponent, SharingScopeComponent, SpaceComponent, TextComponent } from '../../components';
import { Clock, Scissor, Screenmirroring } from 'iconsax-react-native';
import { useTranslation } from 'react-i18next';

const AvatarPreview = ({ _navigation, route }: any) => {
    const { t } = useTranslation(['profile', 'common']);
    const { imageUri } = route.params as { imageUri: string };

    const [visibility, setVisibility] = useState<string>('public');
    const [description, setDescription] = useState('');
    const [isSharedToFeed, setIsSharedToFeed] = useState(true);

    return (
        <ContainerComponent title={t('avatar_preview')} isImageBackground back save>
            <View style={styles.container}>
                <RowComponent justify="flex-start" styles={{ paddingHorizontal: 15 }}>
                    <TextComponent text={`${t('to')}:`} size={16} font={fontFamilies.medium} color={appColors.text5} />
                    <RowComponent justify="flex-start" styles={{ marginLeft: 10, gap: 5 }}>
                        <SharingScopeComponent
                            value={visibility}
                            onPress={(value) => setVisibility(value)}
                            locked={false}
                        />
                    </RowComponent>
                </RowComponent>

                <SpaceComponent height={16} />

                <RowComponent justify="flex-start">
                    <InputComponent
                        value={description}
                        placeholder="Hãy nói gì đó về ảnh đại diện của bạn"
                        onChange={(text) => setDescription(text)}
                        borderWidth={0}
                        style={{
                            flex: 1,
                        }}
                    />
                </RowComponent>

                <SpaceComponent height={16} />

                <View style={styles.imageContainer}>
                    <ContainerComponent imageBackgroundSource={imageUri} blurRadius={20}>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    </ContainerComponent>
                </View>

                <SpaceComponent height={16} />

                <RowComponent justify="space-around">
                    <RowComponent justify="center" styles={styles.btnOther}>
                        <Scissor size={20} color={appColors.text} />
                        <TextComponent text="Chỉnh sửa" size={14} font={fontFamilies.regular} color={appColors.text} />
                    </RowComponent>
                    <RowComponent justify="center" styles={styles.btnOther}>
                        <Screenmirroring size={20} color={appColors.text} />
                        <TextComponent text="Khung" size={14} font={fontFamilies.regular} color={appColors.text} />
                    </RowComponent>
                    <RowComponent justify="center" styles={styles.btnOther}>
                        <Clock size={20} color={appColors.text} />
                        <TextComponent text="Đề tạm thời" size={14} font={fontFamilies.regular} color={appColors.text} />
                    </RowComponent>
                </RowComponent>

                <View style={{ flex: 1 }} />

                <RowComponent justify="space-between" styles={{ paddingHorizontal: 15, alignItems: 'center' }}>
                    <TextComponent text=" Chia sẻ thông tin mới lên Bảng feed" size={16} font={fontFamilies.medium} />
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => setIsSharedToFeed(!isSharedToFeed)}
                        activeOpacity={0.7}>
                        {isSharedToFeed && (
                            <View style={[styles.checkboxInner, { backgroundColor: appColors.primary }]} />
                        )}
                    </TouchableOpacity>
                </RowComponent>
            </View>
        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 1000,
        resizeMode: 'cover',
    },
    btnOther: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        padding: 10,
        backgroundColor: appColors.gray9,
        borderRadius: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
});

export default AvatarPreview;
