import React from "react";
import { View, Text, ViewProps, TextProps, StyleSheet } from "react-native";
import { cn } from "./utils";

// Card contenedor principal
function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.cardHeader, style]} {...props} />;
}

function CardTitle({ style, ...props }: TextProps) {
  return <Text style={[styles.cardTitle, style]} {...props} />;
}

function CardDescription({ style, ...props }: TextProps) {
  return <Text style={[styles.cardDescription, style]} {...props} />;
}

function CardAction({ style, ...props }: ViewProps) {
  return <View style={[styles.cardAction, style]} {...props} />;
}

function CardContent({ style, ...props }: ViewProps) {
  return <View style={[styles.cardContent, style]} {...props} />;
}

function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.cardFooter, style]} {...props} />;
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "column",
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  cardAction: {
    alignSelf: "flex-end",
    padding: 8,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
