import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import { format } from 'date-fns';
import { ApiActions } from '@/services/ApiServices';
import AbsenceFormModal from './AbsenceFormModal';
import type { UploadedAbsence } from '@/types/absencesTypes';
import { globalStyles } from '@/styles/globalStyles';

const PRIMARY = '#0B62E0';
const BG_SOFT = '#F8FAFC';
const TEXT = '#0F172A';

const UploadAbsences: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadedAbsences, setUploadedAbsences] = useState<UploadedAbsence[]>(
    [],
  );
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchUploadedAbsences();
  }, []);

  const fetchUploadedAbsences = async () => {
    setLoading(true);
    try {
      const response = await ApiActions.get({
        route: 'absence',
        params: {
          id: '',
          start_date: '',
          end_date: '',
          duration: '',
          email: '',
          comment: '',
          status: '',
          link: '',
        },
      });
      if (response?.status === 200) {
        setUploadedAbsences(response.data || []);
      }
    } catch (error) {
      console.error('Erreur récupération absences', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUploadedAbsences();
    } finally {
      setRefreshing(false);
    }
  };

  const statusStyle = (s?: number) => {
    const status = Number(s);
    if (status === 1)
      return { label: 'Validée', bg: '#E8F7EE', fg: '#1B9C59', br: '#BFEBD1' };
    if (status === 2)
      return { label: 'Refusée', bg: '#FEECEE', fg: '#D22E46', br: '#F7C6CD' };
    return { label: 'En attente', bg: '#FFF7E6', fg: '#B36B00', br: '#FFE1AA' };
  };

  const pluralJours = (n: number) => `${n} jour${n > 1 ? 's' : ''}`;

  const renderItem = ({ item }: { item: UploadedAbsence }) => {
    const s = statusStyle(item.absence_status);
    const from = format(new Date(item.absence_start_date), 'dd/MM/yyyy');
    const to = format(new Date(item.absence_end_date), 'dd/MM/yyyy');

    return (
      <View style={styles.cardRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.periodText}>
            {from} → {to}
          </Text>
          <Text style={styles.subText}>
            {pluralJours(item.absence_duration)}
          </Text>
        </View>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: s.bg, borderColor: s.br },
          ]}
        >
          <Text style={[styles.statusText, { color: s.fg }]}>{s.label}</Text>
        </View>
      </View>
    );
  };

  const ListHeader = useMemo(
    () => (
      <>
        <Text style={globalStyles.widgetTitle}>Absences précédentes</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => setFormVisible(true)}
        >
          <Text style={styles.addButtonText}>＋ Nouvelle absence</Text>
        </Pressable>
      </>
    ),
    [],
  );

  return (
    <View style={[globalStyles.widget, styles.fill]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={PRIMARY}
          style={{ marginTop: 24 }}
        />
      ) : (
        <FlatList
          data={uploadedAbsences}
          keyExtractor={(item, index) => `${item.absence_start_date}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Aucune absence</Text>
              <Text style={styles.emptyText}>
                Ajoute ta première absence avec le bouton ci-dessus.
              </Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator
        />
      )}

      <AbsenceFormModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSuccess={fetchUploadedAbsences}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1, minHeight: 0 },

  listContent: {
    paddingBottom: 16,
  },

  addButton: {
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginHorizontal: 2,
  },

  periodText: { fontSize: 15, fontWeight: '700', color: TEXT },
  subText: { fontSize: 13, color: '#475569', marginTop: 2 },

  statusPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: { fontWeight: '700', fontSize: 12 },

  emptyBox: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 14,
    backgroundColor: BG_SOFT,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: TEXT },
  emptyText: { color: '#64748B', marginTop: 4, textAlign: 'center' },
});

export default UploadAbsences;
