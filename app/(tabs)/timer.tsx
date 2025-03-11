import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

export default function TimerScreen() {
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      alert('Timer finalizado!');
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const startTimer = () => {
    setSeconds(selectedMinutes * 60);
    setIsRunning(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Timer</Text>
      <Picker
        selectedValue={selectedMinutes}
        onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {[...Array(60).keys()].map((num) => (
          <Picker.Item key={num + 1} label={`${num + 1} min`} value={num + 1} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={startTimer}>
        <Ionicons name="play" size={24} color="#fff" />
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
      <Text style={styles.timer}>{`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  picker: {
    width: '80%',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  pickerItem: {
    color: '#fff',
    fontSize: 18,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00aaff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
  timer: {
    fontSize: 48,
    color: '#fff',
    marginTop: 20,
  },
});
