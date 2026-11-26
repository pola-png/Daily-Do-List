import React from 'react';
import {
  Alert,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_NAME, PRIVACY_POLICY_URL, SUPPORT_EMAIL } from '../constants/policy';

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Displays local-only privacy summary and links to the hosted Privacy Policy.
 */
export function PrivacyModal({ visible, onClose }: PrivacyModalProps) {
  const handleOpenPolicy = async () => {
    try {
      const supported = await Linking.canOpenURL(PRIVACY_POLICY_URL);
      if (supported) {
        await Linking.openURL(PRIVACY_POLICY_URL);
      } else {
        Alert.alert('Cannot open link', PRIVACY_POLICY_URL);
      }
    } catch {
      Alert.alert('Cannot open link', 'Please check your internet connection.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="shield-checkmark" size={22} color="#2563EB" />
              <Text style={styles.heading}>Privacy &amp; Data Safety</Text>
            </View>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close privacy dialog">
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.body}>
            {APP_NAME} stores all of your tasks locally on your device. We do not collect,
            sell, or share any personal data, analytics, or crash reports.
          </Text>
          <Text style={styles.body}>
            You can delete individual tasks at any time or clear all data by uninstalling
            the app.
          </Text>
          <Text style={styles.meta}>Contact: {SUPPORT_EMAIL}</Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleOpenPolicy}>
            <Ionicons name="open-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>View Full Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  body: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 10,
  },
  meta: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeBtnText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
});
