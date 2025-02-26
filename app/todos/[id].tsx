import { useLocalSearchParams } from "expo-router";
import { Text, View, TextInput, Pressable, StyleSheet } from "react-native";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Octicons } from "@expo/vector-icons";
import { Todo } from "../todo";
import { create } from "react-test-renderer";

const EditScreen = () => {
  const { id } = useLocalSearchParams();
  const [allTodos, setAllTodos] = useState<Todo[]>();
  const [todo, setTodo] = useState<Todo>();
  const { theme, colorScheme, setColorScheme } = useContext(ThemeContext);

  const router = useRouter();
  const styles = createStyles(theme, colorScheme);

  useEffect(() => {
    const fetchData = async (id: string | string[]) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storedTodos: Todo[] =
          jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storedTodos && storedTodos.length) {
          // to avoid getting the todos from async storage twice.Here we will filter todos without the one with id.
          const otherTodos = storedTodos.filter(
            (todo) => todo.id.toString() !== id
          );
          setAllTodos(otherTodos);

          const foundTodo: Todo | undefined = storedTodos.find(
            (todo) => todo.id.toString() == id
          );
          setTodo(foundTodo);
        }
      } catch (e) {}
    };
    fetchData(id);
  }, [id]);

  // this useEffect will run if there is any change to the todo data. (Real Time updatation)
  // useEffect(() => {
  //   if (todo && allTodos) {
  //     const saveTodos = async () => {
  //       try {
  //         const updatedTodos = [...allTodos, todo];
  //         await AsyncStorage.setItem("TodoApp", JSON.stringify(updatedTodos));
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     };
  //     saveTodos();
  //   }
  // }, [todo]);

  const saveTodos = async () => {
    try {
      const updatedTodos = [...(allTodos ?? []), todo];
      await AsyncStorage.setItem("TodoApp", JSON.stringify(updatedTodos));
      router.push("/todo");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Edit your Todo"
          value={todo?.title || ""}
          onChangeText={(text) =>
            setTodo((prev) => ({
              ...(prev ?? { id: "", title: "", completed: false }),
              title: text,
            }))
          }
        />
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
          backgroundColor={colorScheme === "dark" ? "#121212" : "#F5F5F7"}
          translucent={false}
        />
      </View>
      <View>
        <Pressable style={styles.saveButton} onPress={() => saveTodos()}>
          <Text style={styles.saveButtonText}> Save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any, colorScheme: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F7", // iOS Light Mode BG
      alignItems: "center",
      justifyContent: "center",
    },
    containerDark: {
      backgroundColor: "#121212", // iOS Dark Mode BG
    },
    content: {
      width: "90%",
      padding: 20,
      borderRadius: 15,
      backgroundColor: "white",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    input: {
      width: "100%",
      fontSize: 18,
      fontWeight: "500",
      padding: 15,
      borderRadius: 12,
      backgroundColor: "#FFF",
      color: "#333",
      borderWidth: 1,
      borderColor: "#DDD",
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 3,
    },
    inputDark: {
      backgroundColor: "#1E1E1E",
      color: "#EEE",
      borderColor: "#333",
    },
    iconButton: {
      marginTop: 20,
      alignSelf: "center",
      padding: 10,
      borderRadius: 50,
      backgroundColor: "#F0F0F3",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    iconButtonDark: {
      backgroundColor: "#222",
    },
    icon: {
      alignSelf: "center",
    },
    saveButton: {
      marginTop: 20,

      backgroundColor: theme.button,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonText: {
      fontSize: 18,
      fontWeight: "600",
    },
  });
};

export default EditScreen;
