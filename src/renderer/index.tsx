import { useTranslation } from 'react-i18next';
import './i18n';

const Main = () => {
  const { t, /* i18n */ } = useTranslation();

  return (
    <>
    The title is: {t('title')}
    Description: {t('description.part1')}
    </>
  );
};

export default Main;
