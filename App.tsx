import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'http://10.0.2.2:3000/todos';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

function App(): React.JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get<Todo[]>(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async () => {
    if (newTodo.trim() !== '') {
      try {
        await axios.post<Todo>(API_URL, { text: newTodo });
        setNewTodo('');
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      await axios.put<Todo>(`${API_URL}/${id}`, { completed: !completed });
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => toggleTodo(item._id, item.completed)} style={styles.todoTextContainer}>
        <Icon 
          name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
          size={24} 
          color={item.completed ? "#4CAF50" : "#757575"}
        />
        <Text style={[styles.todoText, item.completed && styles.completedTodoText]}>{item.text}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTodo(item._id)} style={styles.deleteButton}>
        <Icon name="trash-outline" size={24} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#388E3C" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Todo List</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="เพิ่มรายการใหม่"
          placeholderTextColor="#A5D6A7"
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={renderTodoItem}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#2E7D32',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2E7D32',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 15,
    elevation: 2,
  },
  todoTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoText: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 10,
  },
  completedTodoText: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  deleteButton: {
    padding: 5,
  },
});

export default App;