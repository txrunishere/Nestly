import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function SignIn() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Link href={"/(auth)/sign-up"} className="font-bold text-xl">
        SignIn
      </Link>
    </View>
  );
}
