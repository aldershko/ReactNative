import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { useState, useContext, useEffect } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ThemeContext } from "@/context/ThemeContext";
import { Octicons } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export type Todo = {
  id: number | string | any;
  title: string;
  completed: boolean;
};
export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState("");

  const { theme, colorScheme, setColorScheme } = useContext(ThemeContext);

  const [loaded, error] = useFonts({ Inter_500Medium }); // this is how custom fonts are loaded.

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const data = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (data && data.length) {
          setTodos(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const setData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (e) {
        console.error(e);
      }
    };
    setData();
  }, [todos]);

  const handleChangeText = (text: string) => {
    setTodoInput(text);
  };
  const styles = createStyles(theme, colorScheme);

  const addTodo = () => {
    if (todoInput.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      title: todoInput.trim(),
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setTodoInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handlePress = (id: string) => {
    router.push({ pathname: "/todos/[id]", params: { id } });
  };

  const renderItem = ({ item }: { item: Todo }) => {
    return (
      <View style={styles.todoItem}>
        <Pressable
          onLongPress={() => toggleTodo(item.id)}
          onPress={() => handlePress(item.id.toString())}
        >
          <Text
            style={[styles.todoText, item.completed && styles.completedText]}
          >
            {item.title}
          </Text>
        </Pressable>

        <Pressable onPress={() => deleteTodo(item.id)}>
          <MaterialCommunityIcons
            name="delete-circle"
            size={36}
            color="red"
            selectable={undefined}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section - Input, Add Button & Theme Toggle */}
      <View style={styles.topContainer}>
        {/* Input & Add Button */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={todoInput}
            onChangeText={(text) => handleChangeText(text)}
          />
          <Pressable onPress={addTodo} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        {/* Theme Toggle Button (Properly Aligned Now) */}
        <Pressable
          onPress={() => {
            setColorScheme(colorScheme === "dark" ? "light" : "dark");
          }}
          style={styles.iconButton}
        >
          <Octicons
            name={colorScheme === "dark" ? "sun" : "moon"}
            size={28}
            color={colorScheme === "dark" ? "white" : "black"}
            selectable={undefined}
            style={styles.icon}
          />
        </Pressable>
        <StatusBar
          style={colorScheme === "dark" ? "light" : "dark"}
          backgroundColor={colorScheme === "dark" ? "#000" : "#FFF"}
          translucent={false}
        />
      </View>

      {/* Todo List */}
      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(todo) => todo.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any, colorScheme: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    topContainer: {
      flexDirection: "row", // Arrange items in a row
      justifyContent: "space-between", // Space between input and button
      alignItems: "center", // Proper vertical alignment
      marginBottom: 20, // Add spacing from the list
    },
    inputContainer: {
      flexDirection: "row",
      flex: 1, // Take up full width except the toggle button
      alignItems: "center",
      backgroundColor: theme.background,
      paddingRight: 5,
    },
    input: {
      color: theme.text,
      flex: 1, // Take most of the space
      height: 50,
      borderColor: theme.text,
      borderWidth: 1,
      backgroundColor: theme.background,
      borderRadius: 12,
      paddingHorizontal: 15,
      fontSize: 16,
    },
    addButton: {
      marginLeft: 5, // Spacing between input & button
      backgroundColor: theme.button,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    addButtonText: {
      color: "white",
      fontSize: 17,
      fontWeight: "600",
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.icon,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 1, // Pushes it to the right properly
    },
    icon: {
      margin: 0,
      color: theme.iconText,
    },
    todoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      padding: 18,
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    todoText: {
      fontSize: 17,
      color: "#1F2937",
      fontFamily: "Inter_500Medium",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "#8E8E93",
    },
  });
};
