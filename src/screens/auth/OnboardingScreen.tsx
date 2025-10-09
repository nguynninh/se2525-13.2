import { Image, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Swiper from 'react-native-swiper';
import { appColors } from '../../constants/appColors';
import { appInfo } from '../../constants/appInfos';
import { globalStyles } from '../../styles/globalStyles';
import { TextComponent } from '../../components';
import { useTranslation } from 'react-i18next';

const OnboardingScreen = ({ navigation }: any) => {
  const { t } = useTranslation(['common']);

  const [index, setIndex] = useState(0);

  const onboardings = [
    {
      image: require('../../assets/images/onboarding-1.png'),
      title: 'Find Favorite Items',
      description: 'Find your favorite products that you want to buy easily',
    },
    {
      image: require('../../assets/images/onboarding-2.png'),
      title: 'Easy and Safe Payment',
      description: 'Pay for the products you buy safely and easily',
    },
    {
      image: require('../../assets/images/onboarding-3.png'),
      title: 'Product Delivery',
      description: 'Your product is delivered to your home safely and securely',
    },
  ];

  return (
    <View style={[globalStyles.container]}>
      <Swiper
        style={{}}
        loop={false}
        onIndexChanged={num => setIndex(num)}
        index={index}
        activeDotColor={appColors.gray2}
        paginationStyle={{
          bottom: 50,
        }}
        dotStyle={{
          backgroundColor: appColors.gray4,
          width: 8,
          height: 8,
        }}
        activeDotStyle={{
          backgroundColor: appColors.gray2,
          width: 8,
          height: 8,
        }}>
        {onboardings.map((item, idx) => (
          <View key={idx} style={{ flex: 1 }}>
            <Image
              source={item.image}
              style={{
                flex: 1,
                width: appInfo.sizes.WIDTH,
                height: appInfo.sizes.HEIGHT,
                resizeMode: 'cover',
              }}
            />
            <View style={{
              position: 'absolute',
              bottom: 200,
              left: 20,
              right: 20,
              alignItems: 'center',
            }}>
              <TextComponent
                text={item.title}
                size={28}
                font="bold"
                color={appColors.text}
                styles={{ marginBottom: 12, textAlign: 'center' }}
              />
              <TextComponent
                text={item.description}
                size={16}
                color={appColors.text_decription}
                styles={{
                  textAlign: 'center',
                  lineHeight: 24,
                  opacity: 0.9,
                  paddingHorizontal: 10,
                  minHeight: 48,
                }}
              />
            </View>
          </View>
        ))}
      </Swiper>
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 20,
            position: 'absolute',
            bottom: 20,
            right: 20,
            left: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <TextComponent
            text={t('common:skip')}
            color={appColors.gray}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            index < onboardings.length - 1 ? setIndex(index + 1) : navigation.navigate('LoginScreen')
          }>
          <View
            style={[
              globalStyles.button,
              globalStyles.shadow,
              {
                backgroundColor: appColors.primary,
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 30,
              },
            ]}>
            <TextComponent
              text={t('common:next')}
              color={appColors.white}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
