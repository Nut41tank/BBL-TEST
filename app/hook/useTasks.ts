import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Task } from "../types/ToDoInterface";

const STORAGE_KEY = "@tasks";

const DEFAULT_TASKS: Task[] = [
  { id: "1", text: "Task 1", completed: false },
  { id: "2", text: "Task 2", completed: false },
  { id: "3", text: "Task 3", completed: false },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setTasks(DEFAULT_TASKS);
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    };
    if (!isLoading) {
      saveTasks();
    }
  }, [tasks, isLoading]);

  const addTask = (text: string): void => {
    if (text.trim()) {
      const newTasks = [
        ...tasks,
        { id: Date.now().toString(), text: text.trim(), completed: false },
      ];
      setTasks(newTasks);
    }
  };

  const deleteTask = (id: string): void => {
    const newTasks = tasks.filter((item) => item.id !== id);
    setTasks(newTasks);
  };

  const toggleTaskCompletion = (id: string): void => {
    const newTasks = tasks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTasks(newTasks);
  };

  return {
    tasks,
    isLoading,
    addTask,
    deleteTask,
    toggleTaskCompletion,
  };
};
