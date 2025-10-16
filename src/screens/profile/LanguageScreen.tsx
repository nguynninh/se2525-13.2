import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ContainerComponent, InputComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { getLanguageLabel } from '../../i18n';
import { getListLanguages } from '../../i18n';
import { fontFamilies } from '../../constants/fontFamilies';

const LanguageScreen = () => {
    const { t, i18n } = useTranslation(['common', 'profile']);

    const languageOptions = getListLanguages().map((lang) => ({
        ...lang,
        onPress: () => {
            if (lang.code === 'system') {
                const locales = require('react-native-localize').getLocales();
                i18n.changeLanguage(locales[0]?.languageCode || 'en');
            } else {
                i18n.changeLanguage(lang.code);
            }
        },
    }));

    const customStyles = {
        inputSuffixDefault: {
            marginRight: 10,
        },
        viewSelected: {
            marginTop: 20,
        },
        inputSuffixSelected: {
            marginRight: 10,
        },
    };

    return (
        <ContainerComponent back isImageBackground title={t('profile:language')}>
            <View style={styles.section}>
                <TextComponent
                    text={t('profile:default_language')}
                    title
                    size={18}
                    styles={styles.sectionTitle}
                />
                <InputComponent
                    disabled={true}
                    value={getLanguageLabel(i18n.language)}
                    suffix={<Text style={customStyles.inputSuffixDefault}>🌐</Text>}
                    onChange={() => { }}
                />
            </View>

            <View style={[styles.section, customStyles.viewSelected]}>
                <TextComponent
                    text={t('profile:other_languages')}
                    title
                    size={18}
                    styles={styles.sectionTitle}
                />
                <TextComponent
                    text={t('profile:language_depcription')}
                    size={12}
                    styles={customStyles.inputSuffixSelected}
                />

                {languageOptions.map((option) => {
                    const isActive = i18n.language === option.code;
                    return (
                        <TouchableOpacity
                            key={option.code}
                            style={[styles.optionContainer, isActive && styles.optionActive]}
                            onPress={option.onPress}
                            activeOpacity={0.7}>
                            <TextComponent
                                text={option.label}
                                color={isActive ? appColors.primary : appColors.text}
                                size={15}
                                font={isActive ? fontFamilies.bold : fontFamilies.regular}
                            />
                            {isActive && <Text style={styles.checkMark}>✓</Text>}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ContainerComponent>
    );
};

export default LanguageScreen;

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        marginBottom: 8,
        fontWeight: '600',
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: appColors.gray2,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginTop: 10,
    },
    optionActive: {
        borderWidth: 1,
        borderColor: appColors.primary,
        backgroundColor: appColors.primary + '15',
    },
    checkMark: {
        color: appColors.primary,
        fontWeight: '700',
        fontSize: 16,
    },
});
