import { View, SafeAreaView } from 'react-native';
import LoginWithGoogle from '@/components/auth/GoogleAuth';
import LogtimeChart from '@/components/dashboard/logtimes';
import GoogleCalendarWidget from '@/components/dashboard/googleCalendar';
import Header from '@/components/global/Header';
import { useAuth } from '@/hooks/useAuth';
import { globalStyles } from '@/styles/globalStyles';
import { indexStyles } from '@/styles/indexStyles';

export default function HomeScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={globalStyles.mainContainer}>
        <View style={indexStyles.loginWrapper}>
          <LoginWithGoogle />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <Header />
      <View style={globalStyles.widgetContainer}>
        <LogtimeChart />
      </View>
      <View style={globalStyles.widgetContainer}>
        <GoogleCalendarWidget />
      </View>
    </SafeAreaView>
  );
}
