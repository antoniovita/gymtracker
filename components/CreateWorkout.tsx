import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
  const [exerciseSets, setExerciseSets] = useState(1);
  const [exerciseReps, setExerciseReps] = useState(1);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);

  const addOrEditExercise = () => {
    if (!exerciseName.trim()) return;

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
    setExerciseSets(1);
    setExerciseReps(1);
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleCreateWorkout = () => {
    if (!workoutName.trim()) return;

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Criar Treino</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do treino"
            placeholderTextColor="#999"
            value={workoutName}
            onChangeText={setWorkoutName}
          />

          <Text style={styles.subtitle}>Adicionar Exercícios</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do exercício"
            placeholderTextColor="#999"
            value={exerciseName}
            onChangeText={setExerciseName}
          />
          <Text style={styles.label}>Séries:</Text>
          <Picker selectedValue={exerciseSets} onValueChange={(value) => setExerciseSets(value)}>
            {[...Array(10).keys()].map((i) => (
              <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
            ))}
          </Picker>
          <Text style={styles.label}>Repetições:</Text>
          <Picker selectedValue={exerciseReps} onValueChange={(value) => setExerciseReps(value)}>
            {[...Array(50).keys()].map((i) => (
              <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
            ))}
          </Picker>
          <Button title={editingExercise ? "Editar Exercício" : "Adicionar Exercício"} onPress={addOrEditExercise} color="#00aaff" />

          <FlatList
            style={{ maxHeight: 120, marginVertical: 10 }}
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.exerciseItem}>
                <Text style={styles.exerciseText}>{item.name} - Séries: {item.sets} - Reps: {item.reps}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => {
                    setExerciseName(item.name);
                    setExerciseSets(item.sets);
                    setExerciseReps(item.reps);
                    setEditingExercise(item.id);
                  }}>
                    <Ionicons name="pencil" size={20} color="#00aaff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteExercise(item.id)}>
                    <Ionicons name="trash" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <Button title="Salvar Treino" onPress={handleCreateWorkout} color="#00aaff" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '80%', backgroundColor: '#000', borderRadius: 10, padding: 20, position: 'relative' },
  closeButton: { position: 'absolute', top: 10, right: 10, padding: 5 },
  title: { color: '#fff', fontSize: 24, marginBottom: 10, alignSelf: 'center' },
  subtitle: { color: '#fff', fontSize: 18, marginVertical: 10 },
  input: { color: '#fff', borderColor: '#555', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
  label: { color: '#fff', fontSize: 16, marginVertical: 5 },
  exerciseItem: { backgroundColor: '#222', padding: 10, borderRadius: 5, marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exerciseText: { color: '#fff' },
  actions: { flexDirection: 'row', gap: 10 },
});

export default CreateWorkoutModal;
