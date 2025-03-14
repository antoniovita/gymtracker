// WorkoutsScreen.tsx
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
import { loadWorkouts, saveWorkouts, removeWorkout as removeWorkoutFromStorage } from '../../hooks/storage';
import CreateWorkout, { Workout } from '../../components/CreateWorkout';
import Constants from 'expo-constants';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState<string[]>([]);

  useEffect(() => {
    loadWorkouts().then(setWorkouts);
  }, []);

  const handleRemoveWorkout = async (id: string) => {
    await removeWorkoutFromStorage(id);
    const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
    setWorkouts(updatedWorkouts);
  };

  const handleCreateWorkout = (newWorkout: Workout) => {
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
    setShowCreate(false);
  };

  const toggleWorkoutDetails = (id: string) => {
    setExpandedWorkoutIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter(workoutId => workoutId !== id)
        : [...prevIds, id]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerDate, {paddingTop: Constants.statusBarHeight}]}>My Workouts</Text>
      </View>

      {showCreate && (
        <CreateWorkout
          onCreateWorkout={handleCreateWorkout}
          visible={showCreate}
          onClose={() => setShowCreate(false)}
        />
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
                <TouchableOpacity onPress={() => handleRemoveWorkout(item.id)}>
                  <Ionicons style={styles.deleteButton} name="trash" size={25} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
              <Text style={styles.workoutDate}>
                {new Date(item.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Text>

              {expandedWorkoutIds.includes(item.id) && (
                <View style={styles.exercisesContainer}>
                  {item.exercises.map((exercise) => (
                    <View style={styles.exercise}>
                        <Text style={styles.boldTitle}> {exercise.name} </Text>
                        <View style={{flexDirection: 'row', gap: 10}}>
                            <Text style={styles.numbersEx}> {exercise.sets} </Text>
                            <Text style={styles.numbersEx}> {exercise.sets} </Text>
                        </View>
                        
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.fabText}>Add workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  numbersEx: {
    backgroundColor: '#1a1a1a',
    borderRadius: '100%',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    padding: 5,
  },

  boldTitle: {
    color: '#fff',
    fontSize: 16,

  },

  exercise: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    alignItems: 'center',
  },

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
    marginTop: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDate: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 40,
    fontWeight: 200,
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