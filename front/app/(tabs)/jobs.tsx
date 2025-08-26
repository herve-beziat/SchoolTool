import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import JobsInProgress from '@/components/jobs/JobsInProgress';
import JobsDone from '@/components/jobs/JobsDone';
import JobsAvailable from '@/components/jobs/JobsAvailable';
import Header from '@/components/global/Header';
import { globalStyles } from '@/styles/globalStyles';

const JobsMain = () => {
  const [activeTab, setActiveTab] = useState('inProgress');

  const renderComponent = () => {
    switch (activeTab) {
      case 'inProgress':
        return <JobsInProgress />;
      case 'done':
        return <JobsDone />;
      case 'available':
        return <JobsAvailable />;
      default:
        return <JobsInProgress />;
    }
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <Header />
        <View style={globalStyles.widgetNavContainer}>
          <TouchableOpacity
            style={[
              globalStyles.widgetNavTab,
              activeTab === 'inProgress' && globalStyles.widgetNavActiveTab,
            ]}
            onPress={() => setActiveTab('inProgress')}
          >
            <Text style={styles.tabText}>En cours</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              globalStyles.widgetNavTab,
              activeTab === 'available' && globalStyles.widgetNavActiveTab,
            ]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={styles.tabText}>Disponibles</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              globalStyles.widgetNavTab,
              activeTab === 'done' && globalStyles.widgetNavActiveTab,
            ]}
            onPress={() => setActiveTab('done')}
          >
            <Text style={styles.tabText}>Terminés</Text>
          </TouchableOpacity>
        </View>
        {renderComponent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  tab: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0084FA',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default JobsMain;
