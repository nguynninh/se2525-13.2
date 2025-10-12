import { Image, Alert } from 'react-native';
import { useState } from 'react';
import {Lock, Sms, User} from 'iconsax-react-native';
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
import authenticationAPI from '../../apis/authApi';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/reducers/authReducer';
import { addUser } from '../../redux/reducers/userReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({navigation}: any) => {
  const { t } = useTranslation('auth');

  const dispatch = useDispatch();

  const [data, setData] = useState<SignUp>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validationErrorHandler = () => {
    const newError = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!data.name) {
      newError.name = t('auth:fullname_required');
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
    return newError.name !== '' || newError.email !== '' || newError.password !== '' || newError.confirmPassword !== '';
  };

  const handleRegister = async () => {
    if (validationErrorHandler()) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await authenticationAPI.HandleAuthentication(
        '/register',
        { name: data.name, email: data.email, password: data.password },
        'post',
      );

      dispatch(addAuth(res.data.auth));
      dispatch(addUser(res.data.user));

      await AsyncStorage.setItem(
        'auth',
        JSON.stringify(res.data.auth),
      );
    } catch (error) {
      Alert.alert((error as Error).message || t('auth:login_failed'));
    } finally {
      setIsLoading(false);
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
            value={data.name}
            placeholder={t('auth:full_name')}
            error={validationError.name}
            onChange={val => setData(prev => ({ ...prev, name: val }))}
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
            disable={isLoading}
            onPress={handleRegister}
            text={t('auth:btn_sign_up')}
            type="primary"
          />
        </SectionComponent>
        <SectionComponent>
          <RowComponent justify="center">
            <TextComponent text={t('auth:already_have_account')} />
            <ButtonComponent
              type="link"
              text={t('auth:login')}
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
