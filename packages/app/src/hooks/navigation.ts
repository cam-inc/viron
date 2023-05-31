import { useI18next } from 'gatsby-plugin-react-i18next';

export const useNavigation = () => {
  const { navigate } = useI18next();
  return { navigate };
};
