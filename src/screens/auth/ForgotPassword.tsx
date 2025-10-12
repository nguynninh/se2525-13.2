import { Alert } from 'react-native';
import { useState } from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {ArrowRight, Sms} from 'iconsax-react-native';
import {appColors} from '../../constants/appColors';
import {Validate} from '../../utils/validate';
import {useTranslation} from 'react-i18next';
import authenticationAPI from '../../apis/authApi';

const ForgotPassword = ({ navigation }: any) => {
  const {t} = useTranslation('auth');

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckEmail = () => {
    if (email === '') {
      setErrorMessage(t('auth:email_required'));
      return true;
    }

    if (!Validate.email(email)) {
      setErrorMessage(t('auth:email_format_invalid'));
      return true;
    }

    setErrorMessage('');
    return false;
  };

  const handleForgotPassword = async () => {
    if (handleCheckEmail()) { return; }

    setIsLoading(true);
    try {
      await authenticationAPI.HandleAuthentication(
        '/forgot-password',
        { email },
        'post',
      );

      Alert.alert(t('auth:send_mail'), t('auth:check_email_inbox'));
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert(t('auth:error'), (error as Error).message || t('auth:forgot_password_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text={t('auth:reset_password')} title />
        <SpaceComponent height={12} />
        <TextComponent text={t('auth:forgot_password_description')} />
        <SpaceComponent height={26} />
        <InputComponent
          value={email}
          onChange={val => setEmail(val)}
          affix={<Sms size={20} color={appColors.gray} />}
          placeholder={t('auth:email_placeholder')}
          error={errorMessage}
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handleForgotPassword}
          disable={isLoading}
          text={t('auth:btn_forgot_password')}
          type="primary"
          icon={<ArrowRight size={20} color={appColors.white} />}
          iconFlex="right"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ForgotPassword;
