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
          style={[globalStyles.widgetNavTab, activeTab === 'profile' && globalStyles.widgetNavActiveTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={styles.tabText}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.widgetNavTab, activeTab === 'skills' && globalStyles.widgetNavActiveTab]}
          onPress={() => setActiveTab('skills')}
        >
          <Text style={styles.tabText}>Compétences</Text>
        </TouchableOpacity>
      </View>

      <View>
        {renderComponent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  tab: {
    paddingBottom: 10,
    marginHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0084FA',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flexGrow: 1,
  },
});

export default ProfileMain;
