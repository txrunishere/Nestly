import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function profile() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignoutPress = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Profile Screen</Text>
        <TouchableOpacity>
          <Text onPress={handleSignoutPress}>Signout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
