import { View, StatusBar, Platform, Text } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { globalStyles } from '../../styles/globalStyles';
import { AvatarComponent, InputComponent, RowComponent, SpaceComponent, TextComponent } from '../../components';
import { ArrowLeft, ScanBarcode, SearchNormal1, Sort } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { useTranslation } from 'react-i18next';

const SearchScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState('');

  const searchPlaceholders = useMemo(() => [
    t('home:search_placeholder'),
    t('home:search_placeholder1'),
    t('home:search_placeholder2'),
    t('home:search_placeholder3'),
    t('home:search_placeholder4'),
  ], [t]);
  const [searchPlaceholder, setSearchPlacehoder] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [searchIcon, setSearchIcon] = useState(true);
  useEffect(() => {
    const current = searchPlaceholders[phraseIndex];
    let charIndex = 0;

    const interval = setInterval(() => {
      setSearchPlacehoder(current.slice(0, charIndex + 1));
      charIndex++;

      if (charIndex === current.length) {
        clearInterval(interval);

        setTimeout(() => {
          setPhraseIndex(prev => (prev + 1) % searchPlaceholders.length);
          setSearchPlacehoder('');
        }, 1500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phraseIndex, searchPlaceholders]);

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setSearchIcon(prev => !prev);
    }, 5000);
    return () => clearInterval(iconInterval);
  }, []);

  return (
    <View style={[globalStyles.container, customStyle.container]}>
      <RowComponent styles={customStyle.searchContainer}>
        <AvatarComponent
          shape="square"
          icon={<ArrowLeft size={30} color={appColors.text} />}
          size={30}
          styles={{}}
          onPress={() => navigation.goBack()}
        />
        <InputComponent
          value={searchInput}
          onChange={(text: string) => setSearchInput(text)}
          placeholder={searchPlaceholder}
          height={45}
          affix={
            searchIcon ? (
              <SearchNormal1 size={18} color={appColors.gray} />
            ) : (
              <ScanBarcode size={18} color={appColors.gray}
                onPress={() => navigation.navigate('ScannerScreen')} />
            )
          }
          style={customStyle.searchInput}
        />
        <AvatarComponent
          shape="square"
          icon={<Sort size={20} color={appColors.text} />}
          size={45}
          styles={customStyle.searchFilter}
          onPress={() =>
            navigation.navigate('SearchScreen', {
              isFilter: true,
            })
          }
        />
      </RowComponent>
      <SpaceComponent height={10} />
      <RowComponent styles={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <TextComponent styles={{ fontSize: 18, color: appColors.gray }} text={t('search:search_prompt')} />
      </RowComponent>
    </View>
  );
};

const customStyle = {
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 52,
    paddingHorizontal: 16,
  } as const,

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as const,

  searchInput: {
    flex: 1,
  } as const,

  searchFilter: {
    backgroundColor: appColors.gray5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  } as const,
};

export default SearchScreen;
