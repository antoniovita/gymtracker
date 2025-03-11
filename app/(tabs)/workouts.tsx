import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateWorkout, { Workout } from '../../components/CreateWorkout';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState<string[]>([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('@workouts');
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      console.log('Erro ao carregar treinos:', error);
    }
  };

  const saveWorkouts = async (updatedWorkouts: Workout[]) => {
    try {
      await AsyncStorage.setItem('@workouts', JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.log('Erro ao salvar treinos:', error);
    }
  };

  const handleCreateWorkout = (newWorkout: Workout) => {
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
    setShowCreate(false);
  };

  const toggleWorkoutDetails = (id: string) => {
    if (expandedWorkoutIds.includes(id)) {
      setExpandedWorkoutIds(expandedWorkoutIds.filter(workoutId => workoutId !== id));
    } else {
      setExpandedWorkoutIds([...expandedWorkoutIds, id]);
    }
  };

  const totalExercises = workouts.reduce((acc, w) => acc + w.exercises.length, 0);
  const totalSets = workouts.reduce((acc, w) => {
    return acc + w.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  }, 0);
  const totalWeight = workouts.reduce((acc, w) => {
    return acc + w.exercises.reduce((sum, ex) => sum + (ex as any).weight || 0, 0);
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerDate}>Today</Text>
        </View>
        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {totalExercises} EXS • {totalSets} SETS • {totalWeight} KG
        </Text>
      </View>

      {showCreate && (
        <CreateWorkout onCreateWorkout={handleCreateWorkout} visible={showCreate} onClose={function (event?: GestureResponderEvent): void {
                  throw new Error('Function not implemented.');
              } } />
      )}

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleWorkoutDetails(item.id)}
            style={styles.workoutItem}
          >
            <Text style={styles.workoutName}>{item.name}</Text>
            <Text style={styles.workoutDate}>
              Criado em: {new Date(item.date).toLocaleString()}
            </Text>

            {/* Se estiver expandido, mostra os exercícios */}
            {expandedWorkoutIds.includes(item.id) && (
              <View style={styles.exercisesContainer}>
                {item.exercises.map((exercise) => (
                  <Text key={exercise.id} style={styles.exerciseText}>
                    {exercise.name} - Séries: {exercise.sets} - Reps: {exercise.reps}
                  </Text>
                ))}
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Botão flutuante para criar novo treino */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreate(!showCreate)}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.fabText}>Add workout</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDate: {
    fontSize: 20,
    color: '#fff',
    // fontFamily: 'Poppins-SemiBold',
  },
  // Resumo
  summaryContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
    // fontFamily: 'Poppins-Regular',
  },
  // Treino
  workoutItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 18,
    color: '#fff',
    // fontFamily: 'Poppins-SemiBold',
  },
  workoutDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
    // fontFamily: 'Poppins-Regular',
  },
  exercisesContainer: {
    marginTop: 10,
  },
  exerciseText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },

  fab: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#00aaff',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    // fontFamily: 'Poppins-SemiBold',
  },
});
