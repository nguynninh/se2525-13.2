import { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { ContainerComponent, InputComponent, RowComponent, SpaceComponent, TextComponent } from '../../components';
import { Clock, Global, Scissor, Screenmirroring } from 'iconsax-react-native';

const AvatarPreview = ({_navigation, route }: any) => {
    const { imageUri } = route.params as { imageUri: string };

    const [visibility, setVisibility] = useState('Công khai');
    const [description, setDescription] = useState('');
    const [isSharedToFeed, setIsSharedToFeed] = useState(true);

    return (
        <ContainerComponent title={'Xem trước ảnh đại diện'} isImageBackground back save>
            <RowComponent justify="flex-start" styles={{ paddingHorizontal: 10 }}>
                <TextComponent text="Đến:" size={16} font={fontFamilies.medium} />
                <RowComponent justify="flex-start">
                    <Global size={20} color={appColors.gray} />
                    <TextComponent text={visibility} size={16} font={fontFamilies.medium} color={appColors.gray}/>
                </RowComponent>
            </RowComponent>

            <SpaceComponent height={16} />

            <RowComponent justify="flex-start">
                <InputComponent
                    value={description}
                    placeholder="Hãy nói gì đó về ảnh đại diện của bạn"
                    onChange={(text) => setDescription(text)}
                    style={{
                        flex: 1,
                        paddingHorizontal: 10,
                    }}
                />
            </RowComponent>

            <SpaceComponent height={16} />

            <View style={styles.imageContainer}>
                <ContainerComponent imageBackgroundSource={imageUri} blurRadius={20}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </ContainerComponent>
            </View>

            <RowComponent justify="space-around">
                <RowComponent justify="center">
                    <Scissor size={20} color={appColors.text} />
                    <TextComponent text="Chỉnh sửa" size={14} font={fontFamilies.regular} color={appColors.text} />
                </RowComponent>
                <RowComponent justify="center">
                    <Screenmirroring size={20} color={appColors.text} />
                    <TextComponent text="Khung" size={14} font={fontFamilies.regular} color={appColors.text} />
                </RowComponent>
                <RowComponent justify="center">
                    <Clock size={20} color={appColors.text} />
                    <TextComponent text="Đề tạm thời" size={14} font={fontFamilies.regular} color={appColors.text} />
                </RowComponent>
            </RowComponent>

            <RowComponent justify="space-between">
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
        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
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
