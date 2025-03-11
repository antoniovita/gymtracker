import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateWorkout, { Workout } from '../../components/CreateWorkout';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState<string[]>([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const removeWorkout = (id: string) => {
    const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
  };


  const loadWorkouts = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('@workouts');
      if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts));
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    }
  };

  const saveWorkouts = async (updatedWorkouts: Workout[]) => {
    try {
      await AsyncStorage.setItem('@workouts', JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error('Erro ao salvar treinos:', error);
    }
  };

  const handleCreateWorkout = (newWorkout: Workout) => {
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
    setShowCreate(false);
  };

  const toggleWorkoutDetails = (id: string) => {
    setExpandedWorkoutIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter(workoutId => workoutId !== id) : [...prevIds, id]
    );
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerDate}>My Workouts</Text>
        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
      </View>


      {showCreate && (
        <CreateWorkout onCreateWorkout={handleCreateWorkout} visible={showCreate} onClose={() => setShowCreate(false)} />
      )}

    <FlatList
      data={workouts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => (
        <View style={styles.itemAreaContainer}>
          <TouchableOpacity onPress={() => toggleWorkoutDetails(item.id)} style={styles.workoutItem}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutName}>{item.name}</Text>
              <TouchableOpacity onPress={() => removeWorkout(item.id)}>
                <Ionicons style={styles.deleteButton} name="trash" size={25} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
            <Text style={styles.workoutDate}>
              {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </Text>

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
        </View>
      )}
    />

      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(!showCreate)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.fabText}>Add workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  itemAreaContainer: {
    width: '100%',
    marginBottom: 10,
  },

  deleteButton: {
    marginTop: 10,
    fontSize: 25,
  },

  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerDate: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 40,
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
  },
  workoutItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 18,
    color: '#fff',
  },
  workoutDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
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
  },
});
