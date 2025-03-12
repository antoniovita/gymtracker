import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../../components/CreateWorkout';

const WORKOUTS_KEY = '@workouts';

export const loadWorkouts = async (): Promise<Workout[]> => {
  try {
    const storedWorkouts = await AsyncStorage.getItem(WORKOUTS_KEY);
    if (storedWorkouts) {
      return JSON.parse(storedWorkouts);
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar treinos:', error);
    return [];
  }
};

export const saveWorkouts = async (workouts: Workout[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Erro ao salvar treinos:', error);
  }
};

export const removeWorkout = async (id: string): Promise<void> => {
  try {
    const workouts = await loadWorkouts();
    const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
    await saveWorkouts(updatedWorkouts);
  } catch (error) {
    console.error('Erro ao remover treino:', error);
  }
};
