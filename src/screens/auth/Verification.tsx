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
import authenticationAPI from '../../apis/authApi';
import { LoadingModal } from '../../modals';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/reducers/authReducer';
import { addUser } from '../../redux/reducers/userReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Verification = ({ _navigation, route }: any) => {
  const { name, email, password } = route.params;

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
      await authenticationAPI.HandleAuthentication(
        '/verification',
        { email },
        'post',
      );

      setLimit(90);
      Alert.alert('Success', 'Verification code sent successfully!');
    } catch (error) {
      Alert.alert('Error', (error as Error).message || 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (limit > 0) {
      setErrorMessage('');

      try {
        setIsLoading(true);
        const res: any = await authenticationAPI.HandleAuthentication(
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
        setErrorMessage('Invalid verification code or user already exists!');
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage('Time out verification code, please resend new code!');
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text="Verification" title />
        <SpaceComponent height={12} />
        <TextComponent
          text={`We’ve send you the verification code on ${email.replace(
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
          text="Continue"
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
            <TextComponent text="Re-send code in  " flex={0} />
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
              text="Resend email verification"
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
