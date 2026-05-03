import { PropertyCard } from "@/components/property-card";
import { useSupabase } from "@/hooks/useSupabase";
import { Property } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SavedProperty = {
  id: string;
  property_id: string;
  properties: Property;
};

export default function Saved() {
  const { userId } = useAuth();
  const authSupabase = useSupabase();
  const router = useRouter();

  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSavedProperties = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      const { data } = await authSupabase
        .from("saved_properties")
        .select("id,property_id,properties(*)")
        .eq("user_clerk_id", userId)
        .order("created_at", { ascending: false });

      setSavedProperties((data as unknown as SavedProperty[]) ?? []);
    } catch (error) {
      console.log("fetch saved properties error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchSavedProperties();
    }, [fetchSavedProperties]),
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-3">
        <Text className="text-gray-900 font-bold text-2xl">Saved</Text>
        {!isLoading && (
          <Text
            className="
            text-sm
            text-gray-400
            mt-1
          "
          >
            {savedProperties.length}{" "}
            {savedProperties.length === 1 ? "property" : "properties"} saved
          </Text>
        )}
      </View>

      {isLoading ? (
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <FlatList
          data={savedProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PropertyCard
              property={item.properties}
              onUnsave={() =>
                setSavedProperties((prev) =>
                  prev.filter((property) => property.id !== item.id),
                )
              }
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="heart-outline" size={36} color="#EF4444" />
              </View>
              <Text className="text-gray-700 text-lg font-bold mb-1">
                No saved properties
              </Text>
              <Text className="text-gray-400 text-sm text-center px-8">
                Tap the heart icon on any property to save it here
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/search")}
                className="mt-6 bg-blue-600 px-6 py-3 rounded-2xl"
              >
                <Text className="text-white font-semibold">
                  Browse Properties
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
