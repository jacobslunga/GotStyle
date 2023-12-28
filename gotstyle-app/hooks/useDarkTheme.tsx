import { useColorScheme } from "react-native";

const useDarkTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark";
};

export default useDarkTheme;
