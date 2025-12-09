import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardType,
  ViewStyle,
} from 'react-native';
import React, { ReactNode, useState } from 'react';
import { appColors } from '../constants/appColors';
import { globalStyles } from '../styles/globalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  value: string;
  onChange: (val: string) => void;
  affix?: ReactNode;
  placeholder?: string;
  suffix?: ReactNode;
  isPassword?: boolean;
  allowClear?: boolean;
  height?: number;
  type?: KeyboardType;
  onEnd?: () => void;
  error?: string;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
  borderWidth?: number;
  multiline?: boolean;
  numberOfLines?: number;
}

const InputComponent = (props: Props) => {
  const {
    value,
    onChange,
    affix,
    suffix,
    placeholder,
    isPassword,
    allowClear,
    height,
    type,
    onEnd,
    error,
    style,
    disabled,
    onPress,
    borderWidth,
    multiline,
    numberOfLines,
  } = props;

  const [isShowPass, setIsShowPass] = useState(isPassword ?? false);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.inputContainer, { borderWidth: borderWidth ?? 1, paddingHorizontal: borderWidth ? 15 : 10, alignItems: multiline ? 'flex-start' : 'center', paddingVertical: multiline ? 10 : 0 }]}>
        {affix ?? affix}
        <TextInput
          style={[styles.input, globalStyles.text, { minHeight: height ?? 56, textAlignVertical: multiline ? 'top' : 'center' }]}
          value={value}
          placeholder={placeholder ?? ''}
          onChangeText={val => onChange(val)}
          secureTextEntry={isShowPass}
          placeholderTextColor={'#747688'}
          keyboardType={type ?? 'default'}
          autoCapitalize="none"
          onEndEditing={onEnd}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          onTouchStart={onPress}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        {suffix ?? suffix}
        <TouchableOpacity
          onPress={
            isPassword ? () => setIsShowPass(!isShowPass) : () => onChange('')
          }>
          {isPassword ? (
            <FontAwesome
              name={isShowPass ? 'eye-slash' : 'eye'}
              size={22}
              color={appColors.gray5}
            />
          ) : (
            value.length > 0 &&
            allowClear && (
              <AntDesign name="close" size={22} color={appColors.text} />
            )
          )}
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default InputComponent;

const styles = StyleSheet.create({
  container: {
  },

  inputContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderColor: appColors.gray8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.white,
    marginBottom: 0,
  },

  input: {
    padding: 0,
    margin: 0,
    flex: 1,
    paddingHorizontal: 14,
    color: appColors.text,
  },

  errorText: {
    color: appColors.danger,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 4,
  },
});
