import { StyleSheet, Text, View } from 'react-native';

export default function NearbyMapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SmartNagar</Text>
        <Text style={styles.subtitle}>Civic issues near you</Text>
      </View>

      <View style={styles.mapContainer}>
        <iframe
          title="SmartNagar Live Map"
          src="https://www.openstreetmap.org/export/embed.html?bbox=79.00%2C21.10%2C79.15%2C21.20&layer=mapnik"
          style={styles.map}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Live Civic Map</Text>
        <Text style={styles.infoText}>
          View nearby locations and civic issues on the live map.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#123B7A',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#666666',
  },

  mapContainer: {
    width: '100%',
    height: 420,
    overflow: 'hidden',
    backgroundColor: '#EEF3FA',
  },

  map: {
    width: '100%',
    height: '100%',
    border: 'none',
  } as any,

  info: {
    margin: 20,
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#F5F8FC',
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#123B7A',
  },

  infoText: {
    marginTop: 6,
    fontSize: 14,
    color: '#666666',
  },
});