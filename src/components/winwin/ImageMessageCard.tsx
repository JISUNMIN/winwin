import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

type ImageMessageCardProps = {
  imageUri: string;
  caption: string;
};

export function ImageMessageCard({ imageUri, caption }: ImageMessageCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
      <Text numberOfLines={2} style={styles.caption}>
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 260,
    borderRadius: 18,
    backgroundColor: '#6D5DFB',
    overflow: 'hidden',
  },
  image: {
    width: 260,
    height: 260,
    backgroundColor: '#E8EBF0',
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
