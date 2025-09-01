import { SafeAreaView, View } from 'react-native';
import UploadAbsences from '@/components/absences/AbsencesView';
import Header from '@/components/global/Header';
import { globalStyles } from '@/styles/globalStyles';

export default function AbsencesMain() {
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <Header />
      <View style={globalStyles.widgetContainer}>
        <UploadAbsences />
      </View>
    </SafeAreaView>
  );
}

