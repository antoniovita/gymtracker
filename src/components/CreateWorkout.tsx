import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
}

interface CreateWorkoutProps {
  visible: boolean;
  onClose: () => void;
  onCreateWorkout: (workout: Workout) => void;
}

const statusBarHeight = Constants.statusBarHeight;

const CreateWorkoutModal: React.FC<CreateWorkoutProps> = ({ visible, onClose, onCreateWorkout }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSets, setExerciseSets] = useState<number>(3);
  const [exerciseReps, setExerciseReps] = useState<number>(10);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);

  const addOrEditExercise = () => {
    if (!exerciseName.trim() || !exerciseSets || !exerciseReps) return;

    if (editingExercise) {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === editingExercise
            ? { ...ex, name: exerciseName, sets: exerciseSets, reps: exerciseReps }
            : ex
        )
      );
      setEditingExercise(null);
    } else {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: exerciseName,
        sets: exerciseSets,
        reps: exerciseReps,
      };
      setExercises([...exercises, newExercise]);
    }

    setExerciseName('');
    setExerciseSets(3);
    setExerciseReps(10);
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleCreateWorkout = () => {
    if (!workoutName.trim() || exercises.length === 0) return;

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toISOString(),
      exercises,
    };

    onCreateWorkout(newWorkout);
    setWorkoutName('');
    setExercises([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: statusBarHeight + 30 }]}>
        <TouchableOpacity style={{flexDirection: 'row'}} onPress={onClose}>
          <Ionicons name="chevron-back" style={{marginTop: 1}} size={18} color="#00aaff" />
          <Text style={{color: '#00aaff', fontSize: 16}}> Go back </Text>
        </TouchableOpacity>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.title}>New Workout</Text>
        </View>

        <Text style={styles.label}>Workout name</Text>
        <TextInput
          style={styles.input}
          placeholder="Chest workout..."
          placeholderTextColor="#777"
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        <Text style={styles.label}>Exercise name</Text>
        <TextInput
          style={styles.input}
          placeholder="Bench press"
          placeholderTextColor="#777"
          value={exerciseName}
          onChangeText={setExerciseName}
        />

        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Series</Text>
            <View style={styles.pickerNumber}>
              <TouchableOpacity
                onPress={() => setExerciseSets((prev) => prev + 1)}
              >
                <Ionicons color="#ddd" size={25} name="chevron-up" />
              </TouchableOpacity>
              <Text style={styles.pickerText}>{exerciseSets}</Text>
              <TouchableOpacity
                onPress={() => setExerciseSets((prev) => (prev > 1 ? prev - 1 : 1))}
              >
                <Ionicons color="#ddd" size={25} name="chevron-down" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Reps</Text>
            <View style={styles.pickerNumber}>
              <TouchableOpacity
                onPress={() => setExerciseReps((prev) => (prev !== null ? prev + 1 : 1))}
              >
                <Ionicons color="#ddd" size={25} name="chevron-up" />
              </TouchableOpacity>
              <Text style={styles.pickerText}>{exerciseReps !== null ? exerciseReps : 0}</Text>
              <TouchableOpacity
                onPress={() =>
                  setExerciseReps((prev) => (prev !== null && prev > 1 ? prev - 1 : 1))
                }
              >
                <Ionicons color="#ddd" size={25} name="chevron-down" />
              </TouchableOpacity>
            </View>

              
          </View>

            <TouchableOpacity onPress={addOrEditExercise} style={styles.addButton}>
              <Ionicons name='add' color={'#fff'} size={20}></Ionicons>
              <Text style={{color: '#fff', fontSize: 15,}}> Add </Text>
            </TouchableOpacity>

        </View>

        <FlatList
        showsVerticalScrollIndicator={false}
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseText}>
                {item.name} - {item.sets}x{item.reps}
              </Text>
              <TouchableOpacity onPress={() => deleteExercise(item.id)}>
                <Ionicons name="trash" size={20} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity onPress={handleCreateWorkout} style={styles.createButton}>
          <Ionicons name="checkmark-outline" color={'#fff'} size={22}></Ionicons>
          <Text style={styles.createButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  pickerNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.3,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
  },
  pickerText: {
    color: '#fff',
    fontSize: 20,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 40,
    fontWeight: 200,
  },

  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 0.3,
    color: '#fff',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 20,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.3,
    borderColor: '#ddd',
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
    color: '#fff',
  },

  createButton: {
    backgroundColor: '#00aaff',
    width: '50%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 15,
  },



  addButton: {
    backgroundColor: '#00aaff',
    width: '30%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
  },


  createButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CreateWorkoutModal;
