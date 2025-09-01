import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import ProfileScreen from '@/components/profile/StudentProfile';
import SkillScreen from '@/components/profile/StudentSkills';
import Header from '@/components/global/Header';
import { globalStyles } from '@/styles/globalStyles';

const ProfileMain = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderComponent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileScreen />;
      case 'skills':
        return <SkillScreen />;
      default:
        return <ProfileScreen />;
    }
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <Header />
      <View style={globalStyles.widgetNavContainer}>
        <TouchableOpacity
          style={[
            globalStyles.widgetNavTab,
            activeTab === 'profile' && globalStyles.widgetNavActiveTab,
          ]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={styles.tabText}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.widgetNavTab,
            activeTab === 'skills' && globalStyles.widgetNavActiveTab,
          ]}
          onPress={() => setActiveTab('skills')}
        >
          <Text style={styles.tabText}>Compétences</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          globalStyles.widgetContainer,
          { flex: 1, minHeight: 0, alignSelf: 'stretch', width: '100%' },
        ]}
      >
        {renderComponent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProfileMain;
