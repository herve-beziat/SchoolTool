import { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
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
          <Text style={globalStyles.widgetNavText}>En cours</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.widgetNavTab,
            activeTab === 'available' && globalStyles.widgetNavActiveTab,
          ]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={globalStyles.widgetNavText}>Disponibles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.widgetNavTab,
            activeTab === 'done' && globalStyles.widgetNavActiveTab,
          ]}
          onPress={() => setActiveTab('done')}
        >
          <Text style={globalStyles.widgetNavText}>Terminés</Text>
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

export default JobsMain;
