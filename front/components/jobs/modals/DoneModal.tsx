import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import type { JobDone } from '@/types/jobsTypes';
import ReviewModal from './ReviewModal';
import { globalStyles } from '@/styles/globalStyles';

type DoneModalProps = {
  job: JobDone | null;
  visible: boolean;
  onClose: () => void;
};

const DoneModal: React.FC<DoneModalProps> = ({ job, visible, onClose }) => {
  const [showReview, setShowReview] = useState(false);

  if (!job) return null;

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                [{job.job_unit_name}] {job.job_name}
              </Text>

              <Text style={styles.modalSubtitle}>{job.group_name}</Text>
              <Text style={styles.modalDescription}>
                {job.job_description || 'Aucune description disponible.'}
              </Text>

              <Text style={styles.modalInfo}>
                👨‍🏫 Chef de groupe : {job.lead_email}
              </Text>
              <Text style={styles.modalInfo}>📅 Début : {job.start_date}</Text>
              <Text style={styles.modalInfo}>📅 Fin : {job.end_date}</Text>
              <Pressable
                style={styles.reportBtn}
                onPress={() => setShowReview(true)}
              >
                <Text style={styles.reportText}>Rapport</Text>
              </Pressable>
              <Pressable style={globalStyles.closeBtn} onPress={onClose}>
                <Text style={globalStyles.closeText}>Fermer</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ReviewModal
        visible={showReview}
        groupId={job?.group_id ?? null}
        onClose={() => setShowReview(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  modalDescription: {
    fontSize: 13,
    marginBottom: 8,
    color: '#333',
  },
  modalInfo: {
    fontSize: 13,
    marginBottom: 4,
    color: '#555',
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#1188aa',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reportBtn: {
    marginTop: 15,
    backgroundColor: '#0044ff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  reportText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DoneModal;
