import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { appColors } from '../constants/appColors';

interface Props {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    borderColor?: string;
    backgroundColor?: string;
}

const GlassView = ({
    children,
    style,
    borderColor = 'rgba(255, 255, 255, 0.3)',
    backgroundColor = 'rgba(255, 255, 255, 0.2)'
}: Props) => {
    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                },
                style,
            ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
});

export default GlassView;
