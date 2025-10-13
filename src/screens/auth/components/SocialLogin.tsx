import { useState } from 'react';
import { Facebook, Google } from '../../../assets/svgs';
import {
    ButtonComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '../../../components';
import { appColors } from '../../../constants/appColors';
import { fontFamilies } from '../../../constants/fontFamilies';
import { LoadingModal } from '../../../modals';
import { useTranslation } from 'react-i18next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authenticationAPI from '../../../apis/authApi';
import { addUser } from '../../../redux/reducers/userReducer';
import { LoginManager, Profile, Settings } from 'react-native-fbsdk-next';

GoogleSignin.configure({
    webClientId:
        '1042330913615-e7lf3qal7f5456ctv5jnp0900dt1q3ki.apps.googleusercontent.com',
    iosClientId:
        '1042330913615-tc1kh1pms55mk9t0fj7n2a7q27vi6n70.apps.googleusercontent.com',
});
Settings.setAppID('375135140938503');

const SocialLogin = () => {
    const { t } = useTranslation('auth');

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const handleLoginWithGoogle = async () => {
        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
        });

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const user = userInfo.data?.user;

            const res: any = await authenticationAPI.HandleAuthentication(
                '/social-login',
                {
                    name: user?.name,
                    email: user?.email,
                    avatar: user?.photo,
                },
                'post',
            );

            dispatch(addAuth(res.data.auth));
            dispatch(addUser(res.data.user));

            await AsyncStorage.setItem('auth', JSON.stringify(res.data.auth));
            await GoogleSignin.signOut();
        } catch (error) {
            return;
        }
    };

    const handleLoginWithFacebook = async () => {
        try {
            const result = await LoginManager.logInWithPermissions([
                'public_profile',
            ]);

            if (result.isCancelled) {
                return;
            } else {
                const profile = await Profile.getCurrentProfile();

                if (profile) {
                    setIsLoading(true);

                    const res: any = await authenticationAPI.HandleAuthentication(
                        '/social-login',
                        {
                            name: profile.name,
                            givenName: profile.firstName,
                            familyName: profile.lastName,
                            email: profile.userID,
                            photo: profile.imageURL,
                        },
                        'post',
                    );

                    dispatch(addAuth(res.data.auth));
                    dispatch(addUser(res.data.user));

                    await AsyncStorage.setItem('auth', JSON.stringify(res.data.auth));

                    setIsLoading(false);
                }
            }
        } catch (error) {
            return;
        }
    };

    return (
        <SectionComponent>
            <TextComponent
                styles={{ textAlign: 'center' }}
                text={t('auth:or')}
                color={appColors.gray4}
                size={16}
                font={fontFamilies.medium}
            />
            <SpaceComponent height={16} />

            <ButtonComponent
                type="primary"
                onPress={handleLoginWithGoogle}
                color={appColors.white}
                textColor={appColors.text}
                text={t('auth:login_with_google')}
                textFont={fontFamilies.regular}
                iconFlex="left"
                icon={<Google />}
            />

            <ButtonComponent
                type="primary"
                color={appColors.white}
                textColor={appColors.text}
                text={t('auth:login_with_facebook')}
                textFont={fontFamilies.regular}
                onPress={handleLoginWithFacebook}
                iconFlex="left"
                icon={<Facebook />}
            />
            <LoadingModal visible={isLoading} />
        </SectionComponent>
    );
};

export default SocialLogin;
