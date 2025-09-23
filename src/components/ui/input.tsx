import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";

interface InputProps extends TextInputProps {}

export function Input({ ...props }: InputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#111827",
  },
});
