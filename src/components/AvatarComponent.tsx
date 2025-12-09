import { View, Image, Text } from 'react-native';
import { User } from 'iconsax-react-native';
import { appColors } from '../constants/appColors';

interface Props {
    imageUrl?: string;
    icon?: React.ReactNode;
    size?: number;
    dot?: boolean;
    dotIcon?: React.ReactNode;
    dotColor?: string;
    dotPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    count?: number;
    shape?: 'circle' | 'square';
    border?: [number, string, string];
    styles?: any;
    onPress?: () => void;
}

const AvatarComponent = (props: Props) => {
    const { imageUrl, icon, size, dot, dotIcon, dotColor, dotPosition, count, shape, border, styles, onPress } = props;

    const globalStyle = {
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: border ? border[0] : 0,
            borderStyle: border ? border[1] : 'solid',
            borderColor: border ? border[2] : appColors.gray,
            width: size ?? 36,
            height: size ?? 36,
            borderRadius: shape === 'square' ? 8 : 100,
        },

        image: {
            width: '100%',
            height: '100%',
            borderRadius: shape === 'square' ? 8 : 100,
        } as const,

        noImage: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        } as const,

        dot: {
            backgroundColor: dotColor ?? appColors.primary,
            width: dotIcon ? 16 : 10,
            height: dotIcon ? 16 : 10,
            borderRadius: dotIcon ? 8 : 4,
            position: 'absolute',
            top: -2,
            right: -2,
            justifyContent: 'center',
            alignItems: 'center',
            ...(dotPosition === 'top-left' && { top: -2, left: -2, right: undefined }),
            ...(dotPosition === 'bottom-left' && { bottom: -2, left: -2, top: undefined, right: undefined }),
            ...(dotPosition === 'bottom-right' && { bottom: -2, right: -2, top: undefined }),
        } as const,

        count: {
            backgroundColor: appColors.danger,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            position: 'absolute',
            top: -4,
            right: -4,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 2,
        } as const,

        countText: {
            color: appColors.white,
            fontSize: 8,
            fontWeight: 'bold',
            textAlign: 'center',
        } as const,
    };

    return (
        <View style={[globalStyle.container, styles]} onTouchEnd={onPress}>
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={globalStyle.image}
                    resizeMode="cover"
                />
            ) : icon ? (
                <View>{icon}</View>
            ) : (
                <View style={globalStyle.noImage}>
                    <User variant="Bold" size={(size ?? 40) * 0.7} color={appColors.gray2} />
                </View>
            )}
            {dot && <View style={globalStyle.dot}>{dotIcon}</View>}
            {(count ?? 0) > 0 && (<View style={globalStyle.count}>
                <View>
                    <Text style={globalStyle.countText}>{count}</Text>
                </View>
            </View>)}
        </View>
    );
};

export default AvatarComponent;
