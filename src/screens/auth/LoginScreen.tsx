import { View, Text } from 'react-native';
import { ButtonComponent } from '../../components';

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
