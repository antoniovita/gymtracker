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
  // Inicializa o número de sets com 2 (pode ser alterado)
  const [exerciseSets, setExerciseSets] = useState<number>(2);
  // Inicializa reps como null; posteriormente o usuário pode alterar
  const [exerciseReps, setExerciseReps] = useState<number | null>(null);
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
    setExerciseSets(2);
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
      <View style={[styles.container, { paddingTop: statusBarHeight + 30 }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Novo Treino</Text>

        <Text style={styles.label}>Nome do treino</Text>
        <TextInput
          style={styles.input}
          placeholder="Treino de peito..."
          placeholderTextColor="#777"
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        <Text style={styles.label}>Nome do exercício</Text>
        <TextInput
          style={styles.input}
          placeholder="Supino reto..."
          placeholderTextColor="#777"
          value={exerciseName}
          onChangeText={setExerciseName}
        />

        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Séries</Text>
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
    fontSize: 24,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 40,
    marginTop: 20,
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
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateWorkoutModal;