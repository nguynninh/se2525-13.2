import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import { ArrowRight } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { globalStyles } from '../../styles/globalStyles';
import { LoadingModal } from '../../modals';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/reducers/authReducer';
import { addUser } from '../../redux/reducers/userReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import handleAuthentication from '../../apis/authApi';

const Verification = ({ _navigation, route }: any) => {
  const { name, email, password } = route.params;

  const { t } = useTranslation(['auth', 'common']);

  const [codeValues, setCodeValues] = useState<string[]>(['', '', '', '']);
  const [limit, setLimit] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const ref1 = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const ref3 = useRef<any>(null);
  const ref4 = useRef<any>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    ref1.current.focus();
  }, []);

  useEffect(() => {
    if (limit > 0) {
      const interval = setInterval(() => {
        setLimit(limit => limit - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [limit]);

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues];
    data[index] = val;

    setCodeValues(data);
  };

  const handleResendVerification = async () => {
    setCodeValues(['', '', '', '']);

    setIsLoading(true);
    try {
      await handleAuthentication(
        '/verification',
        { email },
        'post',
      );

      setLimit(90);
      Alert.alert(t('common:success'), t('auth:verification_success'));
    } catch (error) {
      Alert.alert(t('common:error'), (error as Error).message || t('auth:verification_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (limit > 0) {
      setErrorMessage('');

      try {
        setIsLoading(true);
        const res: any = await handleAuthentication(
          '/register',
          {
            code: codeValues.join(''),
            email,
            password,
            name,
          },
          'post',
        );
        dispatch(addAuth(res.data.auth));
        dispatch(addUser(res.data.user));
        await AsyncStorage.setItem('auth', JSON.stringify(res.data.auth));
      } catch (error) {
        setErrorMessage((error as Error).message || t('auth:invalid_verification_code'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage(t('auth:verification_timeout'));
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text={t('auth:verification')} title />
        <SpaceComponent height={12} />
        <TextComponent
          text={`${t('auth:verification_code_sent')} ${email.replace(
            /.{1,5}/,
            (m: any) => '*'.repeat(m.length),
          )}`}
        />
        <SpaceComponent height={26} />
        <RowComponent justify="space-around">
          <TextInput
            keyboardType="number-pad"
            ref={ref1}
            value={codeValues[0]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref2.current.focus();
              handleChangeCode(val, 0);
            }}
            placeholder="-"
          />
          <TextInput
            ref={ref2}
            value={codeValues[1]}
            keyboardType="number-pad"
            onChangeText={val => {
              handleChangeCode(val, 1);
              val.length > 0 && ref3.current.focus();
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            value={codeValues[2]}
            ref={ref3}
            onChangeText={val => {
              handleChangeCode(val, 2);
              val.length > 0 && ref4.current.focus();
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref4}
            value={codeValues[3]}
            onChangeText={val => {
              handleChangeCode(val, 3);
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={{ marginTop: 40 }}>
        <ButtonComponent
          disable={codeValues.join('').length !== 4}
          onPress={handleVerification}
          text={t('auth:continue')}
          type="primary"
          iconFlex="right"
          icon={
            <View
              style={[
                globalStyles.iconContainer,
                {
                  backgroundColor:
                    codeValues.join('').length !== 4 ? appColors.gray : appColors.primary,
                },
              ]}>
              <ArrowRight size={18} color={appColors.white} />
            </View>
          }
        />
      </SectionComponent>
      {errorMessage && (
        <SectionComponent>
          <TextComponent
            styles={{ textAlign: 'center' }}
            text={errorMessage}
            color={appColors.danger}
          />
        </SectionComponent>
      )}
      <SectionComponent>
        {limit > 0 ? (
          <RowComponent justify="center">
            <TextComponent text={t('auth:resend_code_in')} flex={0} />
            <TextComponent
              text={`${(limit - (limit % 60)) / 60}:${limit - (limit - (limit % 60))
                }`}
              flex={0}
              color={appColors.link}
            />
          </RowComponent>
        ) : (
          <RowComponent>
            <ButtonComponent
              type="link"
              text={t('auth:resend_email_verification')}
              onPress={handleResendVerification}
            />
          </RowComponent>
        )}
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default Verification;

const styles = StyleSheet.create({
  input: {
    height: 55,
    width: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.gray2,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },
});
