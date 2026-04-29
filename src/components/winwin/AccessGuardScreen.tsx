import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AccessGuardScreenProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function AccessGuardScreen({
  title,
  description,
  actionLabel,
  onPressAction,
}: AccessGuardScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {actionLabel && onPressAction ? (
            <Pressable accessibilityRole="button" onPress={onPressAction} style={styles.button}>
              <Text style={styles.buttonText}>{actionLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    color: '#15181D',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    color: '#555B66',
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    marginTop: 18,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#6D5DFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
