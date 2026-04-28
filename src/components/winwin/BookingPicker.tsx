import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { formatKoreanDate } from '@/data/matchings';

export type DesiredScheduleOption = {
  date: string;
  time: string;
};

type BookingPickerProps = {
  visible: boolean;
  availableDates: string[];
  onClose: () => void;
  onConfirm: (options: DesiredScheduleOption[]) => void;
};

const timeSlots = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

export function BookingPicker({
  visible,
  availableDates,
  onClose,
  onConfirm,
}: BookingPickerProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<DesiredScheduleOption[]>([]);

  const handleConfirm = () => {
    if (selectedOptions.length === 0) {
      return;
    }

    onConfirm(selectedOptions);
    setSelectedDate(null);
    setSelectedOptions([]);
  };

  const handleClose = () => {
    setSelectedDate(null);
    setSelectedOptions([]);
    onClose();
  };

  const getDateSelectionCount = (date: string) =>
    selectedOptions.filter((option) => option.date === date).length;

  const isOptionSelected = (date: string, time: string) =>
    selectedOptions.some((option) => option.date === date && option.time === time);

  const toggleTime = (time: string) => {
    if (!selectedDate) {
      return;
    }

    setSelectedOptions((currentOptions) => {
      const alreadySelected = currentOptions.some(
        (option) => option.date === selectedDate && option.time === time,
      );

      if (alreadySelected) {
        return currentOptions.filter(
          (option) => !(option.date === selectedDate && option.time === time),
        );
      }

      return [...currentOptions, { date: selectedDate, time }];
    });
  };

  const removeOption = (optionToRemove: DesiredScheduleOption) => {
    setSelectedOptions((currentOptions) =>
      currentOptions.filter(
        (option) =>
          !(option.date === optionToRemove.date && option.time === optionToRemove.time),
      ),
    );
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable accessibilityRole="button" style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="calendar-outline" size={20} color="#15181D" />
              <Text style={styles.title}>희망 일정 선택</Text>
            </View>

            <Pressable
              accessibilityLabel="닫기"
              accessibilityRole="button"
              onPress={handleClose}
              style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#15181D" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View>
              <Text style={styles.sectionTitle}>예약 가능 날짜</Text>
              <View style={styles.dateGrid}>
                {availableDates.map((date) => {
                  const isSelected = selectedDate === date;
                  const selectedCount = getDateSelectionCount(date);

                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={date}
                      onPress={() => setSelectedDate(date)}
                      style={[
                        styles.dateButton,
                        selectedCount > 0 && styles.dateButtonWithOptions,
                        isSelected && styles.selectedDateButton,
                      ]}>
                      <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                        {formatKoreanDate(date)}
                      </Text>
                      {selectedCount > 0 && (
                        <Text
                          style={[
                            styles.dateCountText,
                            isSelected && styles.selectedDateCountText,
                          ]}>
                          {selectedCount}개 선택
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {selectedDate && (
              <View style={styles.timeSection}>
                <Text style={styles.sectionTitle}>시간 선택</Text>
                <View style={styles.timeGrid}>
                  {timeSlots.map((time) => {
                    const isSelected = isOptionSelected(selectedDate, time);

                    return (
                      <Pressable
                        accessibilityRole="button"
                        key={time}
                        onPress={() => toggleTime(time)}
                        style={[styles.timeButton, isSelected && styles.selectedTimeButton]}>
                        <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
                          {time}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {selectedOptions.length > 0 && (
              <View style={styles.selectedSection}>
                <Text style={styles.sectionTitle}>선택한 희망 일정</Text>
                <View style={styles.selectedList}>
                  {selectedOptions.map((option) => (
                    <View key={`${option.date}-${option.time}`} style={styles.selectedChip}>
                      <Text style={styles.selectedChipText}>
                        {formatKoreanDate(option.date)} {option.time}
                      </Text>
                      <Pressable
                        accessibilityLabel="선택한 일정 삭제"
                        accessibilityRole="button"
                        onPress={() => removeOption(option)}
                        style={styles.removeChipButton}>
                        <Ionicons name="close" size={14} color="#6D5DFB" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              disabled={selectedOptions.length === 0}
              onPress={handleConfirm}
              style={[
                styles.confirmButton,
                selectedOptions.length === 0 && styles.confirmButtonDisabled,
              ]}>
              <Text style={styles.confirmButtonText}>
                {selectedOptions.length > 0
                  ? `${selectedOptions.length}개 희망 일정 보내기`
                  : '날짜와 시간을 선택하세요'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    maxHeight: '82%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  header: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF0',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#15181D',
    fontSize: 17,
    fontWeight: '900',
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 18,
  },
  sectionTitle: {
    color: '#15181D',
    fontSize: 15,
    fontWeight: '900',
  },
  dateGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateButton: {
    width: '48%',
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E4EA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDateButton: {
    borderColor: '#6D5DFB',
    backgroundColor: '#F0EEFF',
  },
  dateButtonWithOptions: {
    borderColor: '#BDB6FF',
    backgroundColor: '#FAF9FF',
  },
  dateText: {
    color: '#333842',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  selectedDateText: {
    color: '#6D5DFB',
  },
  dateCountText: {
    marginTop: 4,
    color: '#6D5DFB',
    fontSize: 11,
    fontWeight: '900',
  },
  selectedDateCountText: {
    color: '#6D5DFB',
  },
  timeSection: {
    marginTop: 22,
  },
  timeGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeButton: {
    width: '23%',
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E4EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTimeButton: {
    borderColor: '#6D5DFB',
    backgroundColor: '#6D5DFB',
  },
  timeText: {
    color: '#333842',
    fontSize: 13,
    fontWeight: '800',
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  selectedSection: {
    marginTop: 22,
  },
  selectedList: {
    marginTop: 12,
    gap: 8,
  },
  selectedChip: {
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: '#F0EEFF',
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectedChipText: {
    flex: 1,
    color: '#6D5DFB',
    fontSize: 13,
    fontWeight: '900',
  },
  removeChipButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E8EBF0',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },
  confirmButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#6D5DFB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  confirmButtonDisabled: {
    backgroundColor: '#B8BEC9',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },
});
