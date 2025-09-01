import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { ApiActions } from '@/services/ApiServices';
import DoneModal from './modals/DoneModal';
import type { JobDone, JobUnit, JobPromotion } from '@/types/jobsTypes';
import { globalStyles } from '@/styles/globalStyles';
import UnitSelect from '../global/Select';

const screenWidth = Dimensions.get('window').width;

const JobsDone = () => {
  const [promotions, setPromotions] = useState<JobPromotion[]>([]);
  const [units, setUnits] = useState<JobUnit[]>([]);
  const [jobsDone, setJobsDone] = useState<JobDone[]>([]);

  const [selectedPromotion, setSelectedPromotion] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');

  const [selectedJob, setSelectedJob] = useState<JobDone | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedPromotion) loadUnitsAndJobs();
  }, [selectedPromotion]);

  const fetchInitialData = async () => {
    const history = await ApiActions.get({
      route: 'promotion/history',
      params: { promotion_id: '', promotion_name: '' },
    });

    if (history?.status === 200) {
      const list: JobPromotion[] = history.data || [];
      setPromotions(list);
      const firstId = list[0]?.promotion_id;
      setSelectedPromotion(String(firstId ?? ''));
    }
  };

  const loadUnitsAndJobs = async () => {
    const allUnits = await ApiActions.get({
      route: 'promotion/unit',
      params: { promotion_id: selectedPromotion, unit_id: '', unit_name: '' },
    });

    if (allUnits?.status === 200) {
      const unitList: JobUnit[] = allUnits.data || [];
      setUnits(unitList);

      const allUnitIds = unitList.map((u) => u.unit_id);
      const jobsResponse = await ApiActions.get({
        route: 'job/done',
        params: {
          job_name: '',
          registration_id: '',
          job_unit_name: '',
          job_unit_id: allUnitIds,
          job_description: '',
          start_date: '',
          end_date: '',
          group_name: '',
          lead_email: '',
          order: 'click_date',
          group_id: '',
          desc: '',
        },
      });

      if (jobsResponse?.status === 200) setJobsDone(jobsResponse.data || []);
    }
  };

  const filteredJobs = useMemo(() => {
    if (selectedUnit === 'all') return jobsDone;
    return jobsDone.filter((job) => String(job.job_unit_id) === selectedUnit);
  }, [jobsDone, selectedUnit]);

  const promotionOptions = useMemo(
    () =>
      promotions.map((p) => ({
        value: String(p.promotion_id),
        label: p.promotion_name,
      })),
    [promotions],
  );

  const unitOptions = useMemo(
    () =>
      units.map((u) => ({
        value: String(u.unit_id),
        label: u.unit_name,
      })),
    [units],
  );

  const renderJob = ({ item }: { item: JobDone }) => (
    <Pressable style={styles.row} onPress={() => setSelectedJob(item)}>
      <Text style={[styles.jobTitle, { flex: 1 }]}>{item.job_name}</Text>
      <View style={[styles.jobDetails, { flex: 2 }]}>
        <Text style={styles.unitText}>{item.job_unit_name}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.card}>
      <Text style={globalStyles.widgetTitle}>Projets finis</Text>

      <View style={styles.selectorsContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Promotion</Text>
          <UnitSelect
            value={selectedPromotion}
            onChange={(val) => {
              setSelectedPromotion(val);
              setSelectedUnit('all');
            }}
            options={promotionOptions}
            includeAll={false}
            placeholder="Promotion"
          />
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Unité</Text>
          <UnitSelect
            value={selectedUnit}
            onChange={setSelectedUnit}
            options={unitOptions}
            includeAll
            allValue="all"
            placeholder="Toutes les units"
          />
        </View>
      </View>

      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item, index) =>
          item?.registration_id?.toString?.() || `job-${index}`
        }
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator
      />

      <DoneModal
        job={selectedJob}
        visible={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 0,
    alignSelf: 'stretch',
    width: '100%',

    borderRadius: 12,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 10,

    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  selectorsContainer: {
    flexDirection: screenWidth < 500 ? 'column' : 'row',
    gap: 12,
    marginBottom: 12,
  },
  pickerWrapper: { flex: 1 },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },

  list: { flex: 1 },
  listContent: { paddingBottom: 12 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  jobTitle: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  unitText: { fontSize: 13, color: '#444' },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default JobsDone;
