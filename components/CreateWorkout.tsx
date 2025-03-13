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
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from '@expo/vector-icons/Ionicons';

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

const CreateWorkoutModal: React.FC<CreateWorkoutProps> = ({ visible, onClose, onCreateWorkout }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSets, setExerciseSets] = useState<number | null>(null);
  const [exerciseReps, setExerciseReps] = useState<number | null>(null);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);

  const addOrEditExercise = () => {
    if (!exerciseName.trim() || !exerciseSets || !exerciseReps) return;

    if (editingExercise) {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === editingExercise ? { ...ex, name: exerciseName, sets: exerciseSets, reps: exerciseReps } : ex
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
    setExerciseSets(null);
    setExerciseReps(null);
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleCreateWorkout = () => {
    if (!workoutName.trim() || exercises.length === 0) return;

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toLocaleDateString(),
      exercises,
    };

    onCreateWorkout(newWorkout);
    setWorkoutName('');
    setExercises([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Novo Treino</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do treino"
          placeholderTextColor="#777"
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        <Text style={styles.subtitle}>Adicionar Exercícios</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do exercício"
          placeholderTextColor="#777"
          value={exerciseName}
          onChangeText={setExerciseName}
        />

        <View style={styles.pickerRow}>
          <RNPickerSelect
            onValueChange={(value) => setExerciseSets(value)}
            items={[...Array(10).keys()].map((i) => ({
              label: `${i + 1} séries`,
              value: i + 1,
            }))}
            style={pickerSelectStyles}
            placeholder={{ label: "Escolha as séries", value: null }}
          />

          <RNPickerSelect
            onValueChange={(value) => setExerciseReps(value)}
            items={[...Array(50).keys()].map((i) => ({
              label: `${i + 1} reps`,
              value: i + 1,
            }))}
            style={pickerSelectStyles}
            placeholder={{ label: "Escolha as repetições", value: null }}
          />
        </View>

        <TouchableOpacity onPress={addOrEditExercise} style={styles.addButton}>
          <Text style={styles.addButtonText}>
            {editingExercise ? 'Editar Exercício' : 'Adicionar Exercício'}
          </Text>
        </TouchableOpacity>

        <FlatList
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
          <Text style={styles.createButtonText}>Salvar Treino</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0000',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
};

export default CreateWorkoutModal;
