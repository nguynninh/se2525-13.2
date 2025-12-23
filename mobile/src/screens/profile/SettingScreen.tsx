import { View } from 'react-native';
import { useTranslation } from '../../../node_modules/react-i18next';
import { ContainerComponent, RowComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { ArrowRight2 } from 'iconsax-react-native';

const SettingScreen = ({ navigation }: any) => {
  const { t } = useTranslation(['common', 'profile']);

  const settingsOptions = [
    {
      key: 'general',
      label: t('profile:general'),
      children: [
        {
          key: 'account',
          label: `${t('profile:account')} ${t('profile:and')} ${t('profile:security')}`,
          onPress: () => { },
        },
        {
          key: 'address',
          label: t('profile:address'),
          onPress: () => { },
        },
        {
          key: 'card_banks',
          label: t('profile:card_banks'),
          onPress: () => { },
        },
      ],
    },
    {
      key: 'settings',
      label: t('profile:settings'),
      children: [
        {
          key: 'chats',
          label: `${t('profile:settings')} ${t('profile:chats')}`,
          onPress: () => { },
        },
        {
          key: 'notifications',
          label: `${t('profile:settings')} ${t('profile:notifications')}`,
          onPress: () => { },
        },
        {
          key: 'privacy',
          label: `${t('profile:settings')} ${t('profile:privacy')}`,
          onPress: () => { },
        },
        {
          key: 'language',
          label: `${t('profile:settings')} ${t('profile:language')}`,
          onPress: () => {
            navigation.navigate('LanguageScreen');
          },
        },
      ],
    },
    {
      key: 'support',
      label: t('profile:support'),
      children: [
        {
          key: 'help_center',
          label: t('profile:help_center'),
          onPress: () => { },
        },
        {
          key: 'faq',
          label: t('profile:faq'),
          onPress: () => { },
        },
        {
          key: 'contact_us',
          label: t('profile:contact_us'),
          onPress: () => { },
        },
        {
          key: 'delete_account',
          label: t('profile:delete_account'),
          onPress: () => { },
        },
      ],
    },
  ];

  const customStyles = {
    sectionContainer: {
      marginTop: 20,
      paddingHorizontal: 16,
    },
    optionContainer: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      marginTop: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: appColors.gray3,
      alignItems: 'flex-start' as const,
      gap: 12,
    },
    optionItem: {
      justifyContent: 'space-between' as const,
      width: '100%' as any,
    },
  };

  return (
    <ContainerComponent back isImageBackground title={t('common:settings')}>
      <View>
        {settingsOptions.map((section) => (
          <View key={section.key}>
            <TextComponent
              text={section.label}
              styles={customStyles.sectionContainer}
            />
            <RowComponent
              styles={customStyles.optionContainer}>
              {section.children.map((item) => (
                <RowComponent
                  key={item.key}
                  onPress={item.onPress}
                  styles={customStyles.optionItem}>
                  <TextComponent text={item.label} />
                  <ArrowRight2 size={20} color={appColors.gray} />
                </RowComponent>
              ))}
            </RowComponent>
          </View>
        ))}
      </View>
    </ContainerComponent>
  );
};

export default SettingScreen;
