import { StyleProp, ViewStyle, TextStyle, ImageStyle } from "react-native";

type NamedStyles = ViewStyle | TextStyle | ImageStyle;


export function cn(...styles: Array<StyleProp<NamedStyles> | false | null | undefined>) {
  return styles.filter(Boolean);
}
