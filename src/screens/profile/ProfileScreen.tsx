import { ButtonComponent, ContainerComponent, SectionComponent, TextComponent } from '../../components';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { useDispatch } from 'react-redux';
import { removeAuth } from '../../redux/reducers/authReducer';
import { useTranslation } from 'react-i18next';
import { appColors } from '../../constants/appColors';
import { removeUser } from '../../redux/reducers/userReducer';
import { ArrowRight } from 'iconsax-react-native';

const ProfileScreen = () => {
  const { t } = useTranslation(['auth', 'common']);

  const dispatch = useDispatch();
  return (
    <ContainerComponent back isImageBackground>
      <TextComponent
        text={t('common:profile')}
        title
        styles={{textAlign: 'center', marginVertical: 20}}
      />
      <SectionComponent>
        <ButtonComponent
          type="primary"
          text={t('auth:btn_log_out')}
          onPress={async () => {
            await GoogleSignin.signOut();
            await LoginManager.logOut();
            dispatch(removeAuth({}));
            dispatch(removeUser({}));
          }}
          icon={<ArrowRight size={20} color={appColors.white} />}
          iconFlex="right"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ProfileScreen;
