import React, { useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Checkbox,
  IconButton,
  List,
  MD2Colors,
  Provider as PaperProvider,
  TextInput,
} from "react-native-paper";
import { useTasks } from "./hook/useTasks";
import { Task } from "./types/ToDoInterface";

export default function App() {
  const [task, setTask] = useState<string>("");

  const { tasks, isLoading, addTask, deleteTask, toggleTaskCompletion } =
    useTasks();

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
        {isLoading ? (
          <ActivityIndicator
            animating={true}
            color={MD2Colors.red800}
            size="large"
          />
        ) : (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                label="Add a task"
                value={task}
                onChangeText={setTask}
                style={styles.input}
                mode="outlined"
              />
              <Button
                mode="contained"
                onPress={() => {
                  addTask(task);
                  setTask("");
                }}
                style={styles.addButton}
              >
                Add
              </Button>
            </View>
            <FlatList
              data={tasks}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
            />
          </>
        )}
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
