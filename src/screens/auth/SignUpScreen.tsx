import { Image } from 'react-native';
import {Lock, Sms, User} from 'iconsax-react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {LoadingModal} from '../../modals';
import {Validate} from '../../utils/validate';
import { useTranslation } from 'react-i18next';
import { SignUp } from '../../models/SignUp';

const SignUpScreen = ({navigation}: any) => {
  const { t } = useTranslation('auth');

  const [data, setData] = useState<SignUp>({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validationErrorHandler = () => {
    const newError = {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!data.fullname) {
      newError.fullname = t('auth:fullname_required');
    }

    if (!data.email) {
      newError.email = t('auth:email_required');
    } else if (!Validate.email(data.email)) {
      newError.email = t('auth:email_format_invalid');
    }

    if (!data.password) {
      newError.password = t('auth:password_required');
    } else if (!Validate.password(data.password)) {
      newError.password = t('auth:password_invalid');
    }

    if (!data.confirmPassword) {
      newError.confirmPassword = t('auth:confirm_password_required');
    } else if (data.confirmPassword !== data.password) {
      newError.confirmPassword = t('auth:password_not_match');
    }

    setValidationError(newError);
    return newError.fullname !== '' || newError.email !== '' || newError.password !== '' || newError.confirmPassword !== '';
  };

  const handleRegister = async () => {
    if (validationErrorHandler()) {
      return;
    }

  };

  return (
    <>
      <ContainerComponent isImageBackground isScroll back>
        <SectionComponent
          styles={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 75,
          }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{
              width: 80,
              height: 100,
              marginBottom: 30,
            }}
          />
        </SectionComponent>
        <SectionComponent>
          <TextComponent size={24} title text={t('auth:sign_up')} />
          <SpaceComponent height={21} />
          <InputComponent
            value={data.fullname}
            placeholder={t('auth:full_name')}
            error={validationError.fullname}
            onChange={val => setData(prev => ({ ...prev, fullname: val }))}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
            style={{ marginBottom: 19 }}
          />
          <InputComponent
            value={data.email}
            placeholder={t('auth:email')}
            error={validationError.email}
            onChange={val => setData(prev => ({ ...prev, email: val }))}
            allowClear
            affix={<Sms size={22} color={appColors.gray} />}
            style={{ marginBottom: 19 }}
          />
          <InputComponent
            value={data.password}
            placeholder={t('auth:password')}
            error={validationError.password}
            onChange={val => setData(prev => ({ ...prev, password: val }))}
            isPassword
            allowClear
            affix={<Lock size={22} color={appColors.gray} />}
            style={{ marginBottom: 19 }}
          />
          <InputComponent
            value={data.confirmPassword}
            placeholder={t('auth:confirm_password')}
            error={validationError.confirmPassword}
            onChange={val => setData(prev => ({ ...prev, confirmPassword: val }))}
            isPassword
            allowClear
            affix={<Lock size={22} color={appColors.gray} />}
            style={{ marginBottom: 19 }}
          />
        </SectionComponent>

        <SpaceComponent height={16} />
        <SectionComponent>
          <ButtonComponent
            onPress={handleRegister}
            text={t('auth:btn_sign_up')}
            type="primary"
          />
        </SectionComponent>
        <SectionComponent>
          <RowComponent justify="center">
            <TextComponent text="Don’t have an account? " />
            <ButtonComponent
              type="link"
              text="Sign in"
              onPress={() => navigation.navigate('LoginScreen')}
            />
          </RowComponent>
        </SectionComponent>
      </ContainerComponent>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default SignUpScreen;
