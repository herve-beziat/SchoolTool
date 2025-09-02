import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';
import { Icon } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

import { ApiActions } from '@/services/ApiServices';
import { useAuth } from '@/hooks/useAuth';
import { globalStyles } from '@/styles/globalStyles';

const ACCENT = '#0B62E0';
const ACCENT_SOFT = '#EAF2FF';
const DANGER = '#E91E63';
const TEXT = '#0F172A';
const BORDER = '#E4E7EC';

// Types ----------------------------------------------------------------------
export type DocumentType = 'certificate' | 'grades' | 'attestation';

// Small helper to keep labels/icons centralised
const DOC_META: Record<
  DocumentType,
  { label: string; icon: string; description: string }
> = {
  certificate: {
    label: 'Certificat de scolarité',
    icon: 'school',
    description: 'Attestation officielle de votre inscription',
  },
  grades: {
    label: 'Bulletin de notes',
    icon: 'file-chart',
    description: 'Dernier relevé disponible',
  },
  attestation: {
    label: 'Attestation de formation',
    icon: 'badge-account',
    description: 'Document prouvant la formation suivie',
  },
};

export default function DocumentsScreen() {
  const { user } = useAuth();
  const [loadingType, setLoadingType] = useState<DocumentType | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const items = useMemo<{
    type: DocumentType;
  }[]>(
    () => [
      { type: 'certificate' },
      { type: 'grades' },
      { type: 'attestation' },
    ],
    []
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Si un jour vous cachez des données localement, rechargez-les ici.
      await new Promise((r) => setTimeout(r, 500));
    } finally {
      setRefreshing(false);
    }
  }, []);

  // --- Core actions ---------------------------------------------------------
//   const handleOpen = async (type: DocumentType) => {
//     try {
//       setLoadingType(type);

//       // 1) Récupérer l'URL du document depuis l'API
//       const { url, filename } = await fetchDocumentUrl(type);

//       // 2) Télécharger dans un dossier temporaire
//       const tmp = FileSystem.cacheDirectory + (filename || `${type}.pdf`);
//       const dl = await FileSystem.downloadAsync(url, tmp);

//       if (dl.status !== 200) throw new Error('Téléchargement impossible');

//       // 3) Ouvrir/Partager le fichier
//       if (Platform.OS === 'ios' || (await Sharing.isAvailableAsync())) {
//         await Sharing.shareAsync(dl.uri);
//       } else {
//         // Sur Android, beaucoup d'apps savent ouvrir un PDF depuis le partage
//         await Sharing.shareAsync(dl.uri);
//       }

//       Toast.show({ type: 'success', text1: 'Document prêt ✨' });
//     } catch (e: any) {
//       console.error(e);
//       Toast.show({
//         type: 'error',
//         text1: "Oups, impossible d'ouvrir le document",
//         text2: e?.message ?? 'Réessayez dans un instant',
//       });
//     } finally {
//       setLoadingType(null);
//     }
//   };

//   const fetchDocumentUrl = async (
//     type: DocumentType
//   ): Promise<{ url: string; filename?: string }> => {

//     const endpoint =
//       type === 'certificate'
//         ? '/documents/certificate'
//         : type === 'grades'
//         ? '/documents/grades/latest'
//         : '/documents/attestation';

//     const res = await ApiActions.get(endpoint);
//     if (!res?.url) throw new Error("URL de document manquante");
//     return res as { url: string; filename?: string };
//   };

  // --- UI -------------------------------------------------------------------
  return (
    <View style={[globalStyles.widget, styles.fill]}>
      <Text style={styles.title}>Documents</Text>
      <Text style={styles.subtitle}>
        Téléchargez vos attestations et bulletins en un tap.
      </Text>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {items.map(({ type }) => (
          <DocumentRow
            key={type}
            type={type}
            loading={loadingType === type}
            onPress={() => console.log(type)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// Components -----------------------------------------------------------------
function DocumentRow({
  type,
  loading,
  onPress,
}: {
  type: DocumentType;
  loading?: boolean;
  onPress: () => void;
}) {
  const meta = DOC_META[type];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed ? 0.9 : 1 },
      ]}
      onPress={onPress}
      android_ripple={{ color: ACCENT_SOFT }}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconWrap}>
          <Icon source={meta.icon as any} size={22} color={ACCENT} />
        </View>
        <View style={{ gap: 2 }}>
          <Text style={styles.rowTitle}>{meta.label}</Text>
          <Text style={styles.rowDesc}>{meta.description}</Text>
        </View>
      </View>

      <View style={styles.rowRight}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Icon source="chevron-right" size={24} color={TEXT} />
        )}
      </View>
    </Pressable>
  );
}

// Styles ---------------------------------------------------------------------
const styles = StyleSheet.create({
  fill: { flex: 1, minHeight: 0 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
  },
  subtitle: {
    color: '#64748B',
    marginTop: 6,
    marginBottom: 12,
  },
  row: {
    minHeight: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowRight: { marginLeft: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontWeight: '700', color: TEXT },
  rowDesc: { color: '#6B7280', fontSize: 12 },
});
