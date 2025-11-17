import { StyleSheet, TouchableOpacity, Modal, View, FlatList, Text } from 'react-native';
import { useState, useCallback } from 'react';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { RowComponent, TextComponent } from '.';
import { ArrowDown2, TickCircle, Global, Profile2User, Lock1 } from 'iconsax-react-native';
import { useTranslation } from 'react-i18next';

interface Props {
    value: string;
    onPress?: (value: string) => void;
    locked?: boolean;
    placeholder?: string;
    showIcon?: boolean;
}

const Separator = () => <View style={styles.separator} />;

const SharingScopeComponent = (props: Props) => {
    const { value, onPress, locked = false, placeholder = 'Chọn một tùy chọn', showIcon = true } = props;
    const { t } = useTranslation('common');

    const [modalVisible, setModalVisible] = useState(false);

    const options = [
        {
            icon: <Global size={20} color={appColors.text5} />,
            label: t('public'),
            value: 'public',
        },
        {
            icon: <Profile2User size={20} color={appColors.text5} />,
            label: t('friends'),
            value: 'friends',
        },
        {
            icon: <Lock1 size={20} color={appColors.text5} />,
            label: t('only_me'),
            value: 'only_me',
        },
    ];

    const selectedOption = options.find(option => option.value === value);

    const handleSelect = useCallback((selectedValue: string) => {
        if (!locked && onPress) {
            onPress(selectedValue);
        }
        setModalVisible(false);
    }, [locked, onPress]);

    const handlePress = useCallback(() => {
        if (!locked) {
            setModalVisible(true);
        }
    }, [locked]);

    const closeModal = useCallback(() => {
        setModalVisible(false);
    }, []);

    const renderOptionItem = useCallback(({ item }: { item: typeof options[0] }) => (
        <TouchableOpacity
            onPress={() => handleSelect(item.value)}
            activeOpacity={0.7}
            style={styles.optionItem}
        >
            <RowComponent justify="space-between">
                <RowComponent justify="flex-start" styles={styles.optionContent}>
                    {showIcon && item.icon && (
                        <View style={styles.optionIconContainer}>
                            {item.icon}
                        </View>
                    )}
                    <TextComponent
                        text={item.label}
                        size={16}
                        font={fontFamilies.regular}
                        color={appColors.text}
                    />
                </RowComponent>
                {item.value === value && (
                    <TickCircle
                        size={24}
                        color={appColors.primary}
                        variant="Bold"
                    />
                )}
            </RowComponent>
        </TouchableOpacity>
    ), [handleSelect, showIcon, value]);

    return (
        <>
            <TouchableOpacity
                onPress={handlePress}
                disabled={locked}
                activeOpacity={0.7}
            >
                <RowComponent justify="flex-start" styles={[
                    styles.container,
                    locked && styles.containerLocked,
                ]}>
                    {showIcon && selectedOption?.icon && (
                        <View style={styles.iconContainer}>
                            {selectedOption.icon}
                        </View>
                    )}
                    <TextComponent
                        text={selectedOption?.label || placeholder}
                        size={16}
                        font={fontFamilies.medium}
                        color={locked ? appColors.text3 : appColors.text5}
                    />
                    {!locked && (
                        <ArrowDown2
                            size={16}
                            color={appColors.text5}
                            style={styles.arrowIcon}
                        />
                    )}
                </RowComponent>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeModal}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={renderOptionItem}
                            ItemSeparatorComponent={Separator}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default SharingScopeComponent;

const styles = StyleSheet.create({
    container: {
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    containerLocked: {
        opacity: 0.5,
    },
    iconContainer: {
        marginRight: 4,
    },
    arrowIcon: {
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: appColors.white,
        borderRadius: 12,
        width: '80%',
        maxHeight: '60%',
        padding: 16,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    optionContent: {
        flex: 1,
    },
    optionIconContainer: {
        marginRight: 4,
    },
    separator: {
        height: 1,
        backgroundColor: appColors.gray8,
    },
});
