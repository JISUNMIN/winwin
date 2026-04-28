import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ShopChatHeaderActionsProps = {
  statusLabel: string;
  onPressCustomerInfo: () => void;
  onPressCloseConsultation: () => void;
};

export function ShopChatHeaderActions({
  statusLabel,
  onPressCustomerInfo,
  onPressCloseConsultation,
}: ShopChatHeaderActionsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.statusBadge}>
        <Ionicons name="pulse-outline" size={14} color="#1D4ED8" />
        <Text style={styles.statusText}>예약 {statusLabel}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onPressCustomerInfo}
          style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={18} color="#334155" />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onPressCloseConsultation}
          style={styles.iconButton}>
          <Ionicons name="checkmark-done-outline" size={18} color="#334155" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    minHeight: 30,
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '900',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
