import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function profile() {
  const { signOut } = useAuth();
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleSignoutPress = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.getMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo gallery to update your profile picture",
        );
        return;
      }

      const resultImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        base64: true,
        quality: 0.8,
        aspect: [1, 1],
      });

      if (resultImage.canceled) return;

      setIsUpdating(true);
      try {
        const base64Image = resultImage.assets[0].base64;
        const uri = resultImage.assets[0].uri;
        const filename = uri.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const mimeType = match ? `image/${match[1]}` : "image/jpeg";
        const dataUrl = `data:${mimeType};base64,${base64Image}`;

        await user?.setProfileImage({
          file: dataUrl,
        });

        Alert.alert("Success", "Profile picture updated successfully!");
      } catch (error) {
        console.error("Update profile image error:", error);
        Alert.alert(
          "Error",
          "Failed to update profile picture. Please try again.",
        );
      } finally {
        setIsUpdating(false);
      }
    } catch (error) {
      console.error("Image permission error:", error);
    }
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={"large"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="items-center py-10">
        <View>
          <Image
            source={{ uri: user?.imageUrl }}
            className="size-24 rounded-full"
          />
          <TouchableOpacity
            onPress={handleUpdateProfileImage}
            disabled={isUpdating}
            className="absolute bottom-0 right-1 bg-blue-600 rounded-full p-2"
          >
            {isUpdating ? (
              <ActivityIndicator color={"white"} size="small" />
            ) : (
              <Ionicons name="camera" size={16} color={"white"} />
            )}
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-gray-500 mt-1">
          {user.emailAddresses[0].emailAddress}
        </Text>
      </View>

      <View className="flex-1"></View>

      <TouchableOpacity
        onPress={handleSignoutPress}
        className="flex-row justify-center gap-2 bg-red-50 border border-red-100 rounded-xl items-center py-4 mx-2 mb-2"
      >
        <Ionicons name="log-out-outline" color={"#ef4444"} size={20} />
        <Text className="font-semibold text-base text-red-500">Signout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
