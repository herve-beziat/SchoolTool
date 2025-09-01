import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';

const Header = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const getNameFromEmail = (email: string) => {
    const [fullName] = email.split('@');
    const [first, last] = fullName.split('.');
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return `${capitalize(first)} ${capitalize(last)}`;
  };

  return (
    <View style={globalStyles.headerContainer}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {user && isHomePage && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcome}>Bienvenue</Text>
          <Text style={styles.name}>{getNameFromEmail(user.email)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 40,
    marginBottom: 6,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcome: {
    fontWeight: '600',
    fontSize: 16,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Header;
