import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TimerFinished = ({ stopAlarm }: { stopAlarm: () => void }) => {
  return (
    <View style={styles.finishedContainer}>
      <Text style={styles.finishedText}>Timer Finished!</Text>
      <TouchableOpacity onPress={stopAlarm} style={styles.stopButton}>
        <Text style={styles.stopButtonText}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  finishedContainer: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishedText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 10,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TimerFinished;
