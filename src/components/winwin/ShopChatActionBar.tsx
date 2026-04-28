import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ShopChatActionBarProps = {
  canJumpToDesiredSchedule: boolean;
  canJumpToBookingRequest: boolean;
  onJumpToDesiredSchedule: () => void;
  onJumpToBookingRequest: () => void;
};

export function ShopChatActionBar({
  canJumpToDesiredSchedule,
  canJumpToBookingRequest,
  onJumpToDesiredSchedule,
  onJumpToBookingRequest,
}: ShopChatActionBarProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        disabled={!canJumpToDesiredSchedule}
        onPress={onJumpToDesiredSchedule}
        style={[
          styles.actionButton,
          !canJumpToDesiredSchedule && styles.actionButtonDisabled,
        ]}>
        <Ionicons
          name="calendar-outline"
          size={16}
          color={canJumpToDesiredSchedule ? '#0F766E' : '#9AA3AF'}
        />
        <Text
          style={[
            styles.actionText,
            !canJumpToDesiredSchedule && styles.actionTextDisabled,
          ]}>
          희망 일정으로 이동
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={!canJumpToBookingRequest}
        onPress={onJumpToBookingRequest}
        style={[
          styles.actionButton,
          !canJumpToBookingRequest && styles.actionButtonDisabled,
        ]}>
        <Ionicons
          name="checkmark-circle-outline"
          size={16}
          color={canJumpToBookingRequest ? '#1D4ED8' : '#9AA3AF'}
        />
        <Text
          style={[
            styles.actionText,
            !canJumpToBookingRequest && styles.actionTextDisabled,
          ]}>
          예약 요청으로 이동
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E7FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  actionButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  actionText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '900',
  },
  actionTextDisabled: {
    color: '#9AA3AF',
  },
});
