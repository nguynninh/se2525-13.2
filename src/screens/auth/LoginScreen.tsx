import { View, Text } from 'react-native';
import { ButtonComponent, InputComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { Lock, Sms } from 'iconsax-react-native';

const LoginScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Text style={{
        flex: 0,
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
        textAlignVertical: 'center',
        textAlign: 'center',
      }}>LoginScreen</Text>

      <InputComponent
        value={''}
        placeholder="Email"
        onChange={() => {}}
        allowClear
        affix={<Sms size={22} color={appColors.gray} />}
      />
      <InputComponent
        value={''}
        placeholder="Password"
        onChange={() => {}}
        isPassword
        allowClear
        affix={<Lock size={22} color={appColors.gray} />}
      />
      <ButtonComponent
          disable={false}
          onPress={() => {}}
          text="SIGN IN"
          type="primary"
        />
    </View>
  );
};

export default LoginScreen;
