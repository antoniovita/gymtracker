import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

export default function TimerScreen() {
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
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
    setSeconds(selectedMinutes * 60 + selectedSeconds);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}</Text>

      <View style={styles.pickerArea}>
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

        <Picker
          selectedValue={selectedSeconds}
          onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {[...Array(60).keys()].map((num) => (
            <Picker.Item key={num + 1} label={`${num + 1} sec`} value={num + 1} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonArea}>
        <TouchableOpacity style={styles.button} onPress={startTimer}>
          <Ionicons name="play" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pauseTimer}>
          <Ionicons name="pause" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({

  pickerArea: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },

  buttonArea: {
    flexDirection: 'row',
    gap: 20,
  },

  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    color: '#ffff',
    marginBottom: 20,
  },
  picker: {
    width: '60%',
    marginTop: 20,
    height: 30,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    marginBottom: 30,
  },
  pickerItem: {
    color: '#fff',
    fontSize: 18,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00aaff',
    padding: 12,
    borderRadius: '100%',
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
    fontWeight: 'bold'
  },
});
