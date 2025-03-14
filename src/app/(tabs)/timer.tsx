import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { Audio } from 'expo-av';
import TimerFinished from '../../components/TimerFinished';


export default function TimerScreen() {
  const [selectedMinutes, setSelectedMinutes] = useState<string>('0');
  const [selectedSeconds, setSelectedSeconds] = useState<string>('0');
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isTimerFinished, setIsTimerFinished] = useState(false);

  async function playAlarm() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/alarm.mp3') 
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Erro ao tocar o som:', error);
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      playAlarm();
      setIsTimerFinished(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const startTimer = () => {
    setSeconds(parseInt(selectedMinutes) * 60 + parseInt(selectedSeconds));
    setIsRunning(true);
  };

  // Tornando a função assíncrona
  const stopAlarm = async () => {
    if (sound) { 
      await sound.stopAsync();  // Agora a função pode usar await corretamente
    }
    setIsTimerFinished(false);
  }

  const pauseTimer = () => {
    setIsRunning(false);
  };

  return (
    <View style={styles.container}>
      {isTimerFinished ? (
        <TimerFinished stopAlarm={stopAlarm} />
      ) : (
        <View style={[styles.header, { paddingTop: Constants.statusBarHeight + 50 }]}>
          <Text style={styles.headerDate}>My Timer</Text>
        </View>
      )}

      <Text style={styles.timer}>
        {`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}
      </Text>

      <View style={styles.pickerArea}>
        <Picker
          selectedValue={selectedMinutes}
          onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {Array.from({ length: 61 }, (_, index) => index.toString()).map((num) => (
            <Picker.Item key={num} label={`${num} min`} value={num} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedSeconds}
          onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {Array.from({ length: 59 }, (_, index) => (index + 1).toString()).map((num) => (
            <Picker.Item key={num} label={`${num} sec`} value={num} />
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

      <View style={{ alignItems: 'center', marginTop: 80 }}>
        <Text style={[styles.headerDate, { marginBottom: 15 }]}>Popular timers</Text>

        <View style={styles.timerGrid}>
          {[1, 2, 3, 5, 10, 15].map((time) => (
            <View key={time} style={styles.timerOptions}>
              <Text style={styles.timerOptionText}>{time} min</Text>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => setSeconds(time * 60)}
              >
                <Ionicons name="play" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
  },

  timerOptions: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    width: '48%', // Divide em 2 colunas
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  playButton: {
    backgroundColor: '#00aaff',
    padding: 10,
    borderRadius: 100,
  },

  timerOptionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDate: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 40,
    fontWeight: '200',
  },

  pickerArea: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  buttonArea: {
    flexDirection: 'row',
    gap: 20,
    backgroundColor: '#00aaff',
    borderRadius: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  picker: {
    width: '60%',
    height: 30,
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
    borderRadius: 100,
    alignItems: 'center',
  },
  timer: {
    fontSize: 60,
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

