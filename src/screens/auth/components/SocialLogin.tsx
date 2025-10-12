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

const SocialLogin = () => {
    const { t } = useTranslation('auth');

    const [isLoading, setIsLoading] = useState(false);

    const handleLoginWithGoogle = async () => {

    };

    const handleLoginWithFacebook = async () => {

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
