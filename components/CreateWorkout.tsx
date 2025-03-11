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
  GestureResponderEvent,
} from 'react-native';
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

/**
 * Propriedades do componente de criação:
 * - visible: controla se o modal está aberto ou fechado
 * - onClose: função para fechar o modal
 * - onCreateWorkout: callback que recebe o objeto do treino criado
 */
interface CreateWorkoutProps {
  visible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
  onCreateWorkout: (workout: Workout) => void;
}

const CreateWorkoutModal: React.FC<CreateWorkoutProps> = ({
  visible,
  onClose,
  onCreateWorkout,
}) => {
  const [workoutName, setWorkoutName] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Estados para o exercício que estamos adicionando
  const [exerciseName, setExerciseName] = useState<string>('');
  const [exerciseSets, setExerciseSets] = useState<string>('');
  const [exerciseReps, setExerciseReps] = useState<string>('');

  /**
   * Adiciona um novo exercício à lista
   */
  const addExercise = () => {
    if (!exerciseName.trim() || !exerciseSets.trim() || !exerciseReps.trim()) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: parseInt(exerciseSets, 10),
      reps: parseInt(exerciseReps, 10),
    };

    setExercises([...exercises, newExercise]);
    setExerciseName('');
    setExerciseSets('');
    setExerciseReps('');
  };

  /**
   * Cria o treino e envia para o componente-pai
   */
  const handleCreateWorkout = () => {
    if (!workoutName.trim()) return;

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toISOString(), // Data atual
      exercises,
    };

    onCreateWorkout(newWorkout);

    // Limpa o formulário após salvar
    setWorkoutName('');
    setExercises([]);

    // Fecha o modal
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose} // chamado ao fechar no Android
    >
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

          <Text style={styles.subtitle}>Exercícios</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do exercício"
            placeholderTextColor="#999"
            value={exerciseName}
            onChangeText={setExerciseName}
          />
          <TextInput
            style={styles.input}
            placeholder="Séries"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={exerciseSets}
            onChangeText={setExerciseSets}
          />
          <TextInput
            style={styles.input}
            placeholder="Repetições"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={exerciseReps}
            onChangeText={setExerciseReps}
          />
          <Button title="Adicionar Exercício" onPress={addExercise} color="#00aaff" />

          <FlatList
            style={{ maxHeight: 120, marginVertical: 10 }}
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.exerciseItem}>
                <Text style={styles.exerciseText}>
                  {item.name} - Séries: {item.sets} - Reps: {item.reps}
                </Text>
              </View>
            )}
          />

          <Button title="Salvar Treino" onPress={handleCreateWorkout} color="#00aaff" />
        </View>
      </View>
    </Modal>
  );
};

export default CreateWorkoutModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // fundo escurecido
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 10,
    alignSelf: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    color: '#fff',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  exerciseItem: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  exerciseText: {
    color: '#fff',
  },
});
