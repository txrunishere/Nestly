import { FeaturedCard } from "@/components/featured-card";
import { PropertyCard } from "@/components/property-card";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { getGreeting } from "@/utils/getGreeting";
import { useUser } from "@clerk/expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const { user } = useUser();
  const router = useRouter();

  const [recommended, setRecommended] = useState<Property[]>([]);
  const [featured, setFeatured] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const { data: featuredProperties } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      const { data: recommendedProperties } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false });

      setFeatured(featuredProperties ?? []);
      setRecommended(recommendedProperties ?? []);
    } catch (error) {
      console.error("Properties fetching error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-50">
      <FlatList
        data={recommended}
        keyExtractor={(data) => data.id}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <View>
            {/* HEADER */}
            <View className="flex-row items-center justify-between pb-2">
              <Image
                className="w-20 h-20"
                source={require("@/assets/images/nestly_logo.png")}
              />
              <View className="items-end">
                <Text className=" text-sm">{getGreeting()} 👋</Text>
                <Text className=" font-semibold text-gray-900">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>

            {/* SEARCH BAR */}
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/search")}
              className="shadow bg-white rounded-md flex-row items-center gap-3 mb-4 py-2 px-3"
            >
              <FontAwesome name="search" size={18} color={"#9CA3AF"} />
              <Text className="text-gray-400">
                Search properties, apartments...
              </Text>
            </TouchableOpacity>

            {/* FEATURED PROPERTIES */}
            <View className="mb-4">
              {/* FEATURED TITLE */}
              <Text className="text-gray-900 text-lg font-bold mb-4">
                Featured
              </Text>

              {/* FEATURED PROPERTY CARDS */}
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  horizontal
                  data={featured}
                  keyExtractor={(data) => data.id}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                />
              )}
            </View>

            {/* RECOMMENDED TITLE */}
            <Text className="text-gray-900 text-lg font-bold mb-4">
              Recommended
            </Text>
          </View>
        }
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="py-10">
              <Text className="text-center text-gray-400">
                No properties found
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
