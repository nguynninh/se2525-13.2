import {
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { ReactNode } from 'react';
import { globalStyles } from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { RowComponent, TextComponent } from '.';
import { ArrowLeft } from 'iconsax-react-native';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';

interface Props {
  isImageBackground?: boolean;
  imageBackgroundSource?: string;
  blurRadius?: number;
  isScroll?: boolean;
  title?: string | ReactNode;
  children: ReactNode;
  back?: boolean;
  save?: boolean;
  onSave?: () => void;
}

const ContainerComponent = (props: Props) => {
  const { children, isScroll, blurRadius, isImageBackground, imageBackgroundSource, title, back, save, onSave } = props;

  const navigation: any = useNavigation();

  const headerComponent = () => {
    return (
      <View style={{ flex: 1 }}>
        {(title || back || save) && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'flex-start',
            }}>
            {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  marginRight: 12,

                }}>
                <ArrowLeft size={24} color={appColors.text} />
              </TouchableOpacity>
            )}
            {title ? (
              typeof title === 'string' ? (
                <TextComponent
                  text={title}
                  size={16}
                  font={fontFamilies.medium}
                  flex={1}
                />
              ) : (
                <View style={{ flex: 1 }}>{title}</View>
              )
            ) : (
              <></>
            )}
            {save && (
              <TouchableOpacity onPress={onSave}>
                <TextComponent
                  text="Lưu"
                  size={16}
                  color={appColors.primary}
                  font={fontFamilies.medium}
                />
              </TouchableOpacity>
            )}
          </RowComponent>
        )}
        {returnContainer}
      </View>
    );
  };

  const returnContainer = isScroll ? (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{children}</View>
  );

  return isImageBackground || imageBackgroundSource ? (
    <ImageBackground
      source={imageBackgroundSource ? { uri: imageBackgroundSource } : require('../assets/images/splash-img.png')}
      style={{ flex: 1 }}
      imageStyle={{ flex: 1 }}
      blurRadius={blurRadius || 0}>
      <SafeAreaView style={{ flex: 1 }}>{headerComponent()}</SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{ flex: 1 }}>{headerComponent()}</View>
    </SafeAreaView>
  );
};

export default ContainerComponent;
