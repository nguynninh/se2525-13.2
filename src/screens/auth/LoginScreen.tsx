import { Alert, Image, Switch } from 'react-native';
import { useState } from 'react';
import { Lock, Sms } from 'iconsax-react-native';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { Validate } from '../../utils/validate';
import { useTranslation } from 'react-i18next';
import { Login } from '../../models/Login';
import SocialLogin from './components/SocialLogin';
import authenticationAPI from '../../apis/authApi';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addUser } from '../../redux/reducers/userReducer';

const LoginScreen = ({ navigation }: any) => {
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [data, setData] = useState<Login>({ email: '', password: '', isRemember: false });
  const [valiationError, setValidationError] = useState({ email: '', password: '' });

  const validationErrorHandler = () => {
    const newError = { email: '', password: '' };

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

    setValidationError(newError);
    return newError.email !== '' || newError.password !== '';
  };

  const handleLogin = async () => {
    if (validationErrorHandler()) {return;}

    try {
      setIsLoading(true);
      const res = await authenticationAPI.HandleAuthentication(
        '/login',
        { email: data.email, password: data.password },
        'post',
      );

      dispatch(addAuth(res.data.auth));
      dispatch(addUser(res.data.user));

      await AsyncStorage.setItem(
        'auth',
        data.isRemember ? JSON.stringify(res.data.auth) : data.email,
      );
    } catch (error) {
      Alert.alert(t('auth:error'), (error as Error).message || t('auth:login_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContainerComponent isImageBackground isScroll>
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
        <TextComponent size={24} title text={t('auth:login')} />
        <SpaceComponent height={21} />
        <InputComponent
          value={data.email}
          placeholder={t('auth:email')}
          error={valiationError.email}
          onChange={val => setData(prev => ({ ...prev, email: val }))}
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
          style={{ marginBottom: 19 }}
        />
        <InputComponent
          value={data.password}
          placeholder={t('auth:password')}
          error={valiationError.password}
          onChange={val => setData(prev => ({ ...prev, password: val }))}
          isPassword
          allowClear
          affix={<Lock size={22} color={appColors.gray} />}
          style={{ marginBottom: 19 }}
        />
        <RowComponent justify="space-between">
          <RowComponent onPress={() => setData(prev => ({ ...prev, isRemember: !prev.isRemember }))}>
            <Switch
              trackColor={{ true: appColors.primary }}
              thumbColor={appColors.white}
              value={data.isRemember}
              onChange={() => setData(prev => ({ ...prev, isRemember: !prev.isRemember }))}
            />
            <SpaceComponent width={4} />
            <TextComponent text={t('auth:remember_me')} />
          </RowComponent>
          <ButtonComponent
            text={t('auth:forgot_password')}
            onPress={() => navigation.navigate('ForgotPassword')}
            type="text"
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          disable={isLoading}
          onPress={handleLogin}
          text={t('auth:btn_login')}
          type="primary"
        />
      </SectionComponent>
      <SocialLogin />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text={t('auth:no_account')} />
          <ButtonComponent
            type="link"
            text={t('auth:sign_up')}
            onPress={() => navigation.navigate('SignUpScreen')}
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default LoginScreen;
