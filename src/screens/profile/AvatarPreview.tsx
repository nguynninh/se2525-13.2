import { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { ContainerComponent, InputComponent, RowComponent, SpaceComponent, TextComponent } from '../../components';
import { Global } from 'iconsax-react-native';

const AvatarPreview = ({_navigation, route }: any) => {
    const { imageUri } = route.params as { imageUri: string };
    const [visibility, setVisibility] = useState('Công khai');

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
                    value=""
                    placeholder="Hãy nói gì đó về ảnh đại diện của bạn"
                    onChange={() => {}}
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

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>✂️</Text>
                    <Text style={styles.actionText}>Chỉnh sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>🖼️</Text>
                    <Text style={styles.actionText}>Khung</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>⏰</Text>
                    <Text style={styles.actionText}>Đề tạm thời</Text>
                </TouchableOpacity>
            </View>

            <RowComponent justify="space-between">
                <TextComponent text=" Chia sẻ thông tin mới lên Bảng feed" size={16} font={fontFamilies.medium} />
                <TouchableOpacity style={styles.checkbox}>
                    <View style={styles.checkboxInner} />
                </TouchableOpacity>
            </RowComponent>
        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerButton: {
        padding: 8,
    },
    headerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: fontFamilies.regular,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: fontFamilies.semiBold,
    },
    visibilitySection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    visibilityLabel: {
        color: '#999',
        fontSize: 14,
        fontFamily: fontFamilies.regular,
    },
    captionSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    captionPlaceholder: {
        color: '#666',
        fontSize: 14,
        fontFamily: fontFamilies.regular,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 1000,
        resizeMode: 'cover',
    },
    cameraButton: {
        position: 'absolute',
        right: 40,
        bottom: 40,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIconText: {
        fontSize: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    actionButton: {
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 100,
    },
    actionIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: fontFamilies.regular,
    },
    shareSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    shareText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: fontFamilies.regular,
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
