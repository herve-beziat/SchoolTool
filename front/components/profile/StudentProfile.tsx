import { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { ApiActions } from '@/services/ApiServices';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';
import { Icon } from 'react-native-paper';
import type { StudentInfo, StudentLinks } from '@/types/profileTypes';
import { globalStyles } from '@/styles/globalStyles';

const ACCENT = '#0B62E0';
const ACCENT_SOFT = '#EAF2FF';
const DANGER = '#E91E63';
const TEXT = '#0F172A';

export default function ProfileScreen() {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [jobsDone, setJobsDone] = useState(0);
  const [jobsInProgress, setJobsInProgress] = useState(0);
  const [editing, setEditing] = useState(false);
  const [links, setLinks] = useState<StudentLinks | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const initials = useMemo(() => {
    if (!student) return '';
    const a = (student.student_firstname || '').trim().charAt(0);
    const b = (student.student_lastname || '').trim().charAt(0);
    return (a + b).toUpperCase();
  }, [student]);

  const loadProfile = async () => {
    try {
      const studentReq = await ApiActions.get({
        route: 'student',
        params: {
          firstname: '',
          lastname: '',
          email: '',
          section_name: '',
          promotion_name: '',
          current_unit_name: '',
          github: '',
          linkedin: '',
          cv: '',
          plesk: '',
          personal_website: '',
        },
      });

      const doneJobs = await ApiActions.get({ route: 'job/done', params: { job_id: '' } });
      const inProgressJobs = await ApiActions.get({ route: 'job/progress', params: { job_id: '' } });

      const data = studentReq?.data?.[0];
      setStudent(data);
      setLinks({
        github: data?.student_github || '',
        plesk: data?.student_plesk || '',
        linkedin: data?.student_linkedin || '',
        cv: data?.student_cv || '',
        personal_website: data?.student_personal_website || '',
      });
      setJobsDone(doneJobs?.data?.length || 0);
      setJobsInProgress(inProgressJobs?.data?.length || 0);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger le profil');
    }
  };

  const normalizeUrl = (url: string) => {
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  const openLink = (url: string) => {
    const safe = normalizeUrl(url);
    if (safe) Linking.openURL(safe);
  };

  const handleSaveLinks = async () => {
    try {
      if (!links) throw new Error('Links cannot be null');
      await ApiActions.put({ route: 'student', params: links });
      Toast.show({ type: 'success', text1: 'Succès', text2: 'Liens mis à jour' });
      setEditing(false);
      loadProfile();
    } catch {
      Alert.alert('Erreur', 'Impossible de mettre à jour les liens');
    }
  };

  return (
    <View style={[globalStyles.widget, styles.fill]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>
            {student?.student_firstname} {student?.student_lastname}
          </Text>
          <View style={styles.tagsRow}>
            {!!student?.section_name && (
              <View style={styles.tag}>
                <Icon source="school-outline" size={16} color={ACCENT} />
                <Text style={styles.tagText}>{student.section_name}</Text>
              </View>
            )}
            {!!student?.current_unit_name && (
              <View style={styles.tag}>
                <Icon source="layers-outline" size={16} color={ACCENT} />
                <Text style={styles.tagText}>{student.current_unit_name}</Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statNumber}>{jobsInProgress}</Text>
              <Text style={styles.statLabel}>En cours</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statNumber}>{jobsDone}</Text>
              <Text style={styles.statLabel}>Terminés</Text>
            </View>
          </View>
        </View>

        {/* Liens */}
        <Text style={styles.blockTitle}>Mes liens</Text>
        <View style={styles.card}>
          {[
            { label: 'GitHub', key: 'github', icon: 'github' },
            { label: 'Plesk', key: 'plesk', icon: 'web' },
            { label: 'Portfolio', key: 'personal_website', icon: 'briefcase' },
            { label: 'LinkedIn', key: 'linkedin', icon: 'linkedin' },
            { label: 'CV', key: 'cv', icon: 'file-document-outline' },
          ].map(({ label, key, icon }, i, arr) => {
            const value = (student as any)?.[`student_${key}`] as string | undefined;
            const isEmpty = !value;
            return (
              <Pressable
                key={key}
                onPress={() => !isEmpty && openLink(value!)}
                style={[
                  styles.rowItem,
                  i === 0 && styles.rowFirst,
                  i === arr.length - 1 && styles.rowLast,
                  isEmpty && { opacity: 0.5 },
                ]}
              >
                <View style={styles.rowLeft}>
                  <Icon source={icon} size={22} color={ACCENT} />
                  <Text style={styles.rowLabel}>{label}</Text>
                </View>
                <Icon
                  source={isEmpty ? 'plus' : 'chevron-right'}
                  size={22}
                  color={isEmpty ? '#64748B' : '#94A3B8'}
                />
              </Pressable>
            );
          })}

          <View style={styles.actionsRow}>
            <Pressable style={[styles.button, styles.buttonPrimary]} onPress={() => setEditing(true)}>
              <Icon source="pencil" size={18} color="#fff" />
              <Text style={styles.buttonPrimaryText}>Modifier mes liens</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonDanger]} onPress={logout}>
              <Icon source="logout" size={18} color="#fff" />
              <Text style={styles.buttonDangerText}>Se déconnecter</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Modal édition */}
      <Modal visible={editing} transparent animationType="slide" onRequestClose={() => setEditing(false)}>
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Modifier mes liens</Text>

            {links &&
              (Object.keys(links) as (keyof StudentLinks)[]).map((key) => (
                <View key={key} style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>
                    {key === 'personal_website' ? 'Portfolio' : key.toUpperCase()}
                  </Text>
                  <TextInput
                    placeholder={
                      key === 'github'
                        ? 'https://github.com/mon-compte'
                        : key === 'linkedin'
                        ? 'https://www.linkedin.com/in/mon-profil'
                        : key === 'cv'
                        ? 'Lien vers votre CV'
                        : key === 'plesk'
                        ? 'Lien Plesk'
                        : 'https://mon-site.dev'
                    }
                    value={links[key]}
                    onChangeText={(t) =>
                      setLinks((prev) => ({
                        ...(prev as StudentLinks),
                        [key]: t,
                      }))
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType={Platform.OS === 'web' ? 'default' : 'url'}
                    style={styles.input}
                  />
                </View>
              ))}

            <Pressable style={[styles.button, styles.buttonPrimary, { marginTop: 8 }]} onPress={handleSaveLinks}>
              <Icon source="content-save" size={18} color="#fff" />
              <Text style={styles.buttonPrimaryText}>Sauvegarder</Text>
            </Pressable>
            <Pressable onPress={() => setEditing(false)} style={{ paddingVertical: 12 }}>
              <Text style={{ textAlign: 'center', color: '#475569' }}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ------------------------------- styles ---------------------------------- */
const styles = StyleSheet.create({
  fill: { flex: 1, minHeight: 0 },
  scroll: { paddingBottom: 24 },

  headerCard: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: ACCENT_SOFT,
    marginBottom: 16,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 28, letterSpacing: 0.5 },
  name: { fontSize: 20, fontWeight: '700', color: TEXT, marginBottom: 6, textAlign: 'center' },

  tagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  tag: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  tagText: { color: '#0F172A', fontSize: 12, fontWeight: '600' },

  statsRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  statPill: {
    minWidth: 120,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
  },
  statNumber: { fontSize: 18, fontWeight: '800', color: ACCENT },
  statLabel: { color: '#475569', fontSize: 12, marginTop: 2 },

  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 1,
  },

  rowItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowFirst: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  rowLast: { borderBottomWidth: 0, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: TEXT },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  button: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonPrimary: { backgroundColor: ACCENT },
  buttonPrimaryText: { color: '#fff', fontWeight: '700' },
  buttonDanger: { backgroundColor: DANGER },
  buttonDangerText: { color: '#fff', fontWeight: '700' },

  /* bottom sheet */
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    paddingTop: 6,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 10,
  },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: TEXT, marginBottom: 10 },

  inputWrap: { marginBottom: 10 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
});
