import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Checkbox,
  IconButton,
  List,
  Provider as PaperProvider,
  TextInput,
} from "react-native-paper";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = "@tasks";

export default function App() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Task 1", completed: false },
    { id: "2", text: "Task 2", completed: false },
    { id: "3", text: "Task 3", completed: false },
  ]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };
    loadTasks();
  }, []);

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const addTask = async (): Promise<void> => {
    if (task.trim()) {
      const newTasks = [
        ...tasks,
        { id: Date.now().toString(), text: task, completed: false },
      ];
      setTasks(newTasks);
      setTask("");
      await saveTasks(newTasks);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    const newTasks = tasks.filter((item) => item.id !== id);
    setTasks(newTasks);
    await saveTasks(newTasks);
  };

  const toggleTaskCompletion = async (id: string): Promise<void> => {
    const newTasks = tasks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTasks(newTasks);
    await saveTasks(newTasks);
  };

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <List.Item
      title={item.text}
      titleStyle={[styles.taskText, item.completed && styles.completedTask]}
      left={() => (
        <Checkbox
          status={item.completed ? "checked" : "unchecked"}
          onPress={() => toggleTaskCompletion(item.id)}
          color="#6200ee"
        />
      )}
      right={() => (
        <IconButton
          icon="delete"
          iconColor="#ff1744"
          onPress={() => deleteTask(item.id)}
        />
      )}
      style={styles.taskItem}
    />
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="To-Do List" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.inputContainer}>
          <TextInput
            label="Add a task"
            value={task}
            onChangeText={setTask}
            style={styles.input}
            mode="outlined"
          />
          <Button mode="contained" onPress={addTask} style={styles.addButton}>
            Add
          </Button>
        </View>
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#6200ee",
  },
  taskItem: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 4,
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  list: {
    flex: 1,
  },
});
