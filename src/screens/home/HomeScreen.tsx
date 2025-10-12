import { View, Text, Button } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import { removeUser } from '../../redux/reducers/userReducer';
import { removeAuth } from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = () => {

  const dispatch = useDispatch();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>HomeScreen</Text>
      <Button title="Logout" onPress={async () => {
        dispatch(removeAuth({}));
        dispatch(removeUser({}));
        await AsyncStorage.clear();
      }} />
    </View>
  );
};

export default HomeScreen;
