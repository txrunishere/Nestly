import { FilterModal } from "@/components/filter-modal";
import { PropertyCard } from "@/components/property-card";
import { supabase } from "@/lib/supabase";
import { useFilterStore } from "@/store/filter.store";
import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function search() {
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFiltersModel, setShowFiltersModel] = useState<boolean>(false);

  const { showFilters } = useLocalSearchParams<{ showFilters?: string }>();

  useEffect(() => {
    if (showFilters === "true") {
      setShowFiltersModel(true);
    }
  }, [showFilters]);

  const {
    search,
    type,
    bedrooms,
    maxPrice,
    minPrice,
    setSearch,
    setBedrooms,
    setMaxPrice,
    setMinPrice,
    setType,
  } = useFilterStore((state) => state);

  const activeFilterCount = [type, bedrooms, minPrice, maxPrice].filter(
    (active) => active !== null,
  ).length;

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("properties").select("*");

      if (search) {
        query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
      }
      if (type) {
        query = query.eq("type", type);
      }
      if (bedrooms) {
        if (bedrooms === 4) {
          query = query.gte("bedrooms", bedrooms);
        } else {
          query = query.eq("bedrooms", bedrooms);
        }
      }
      if (minPrice) {
        query = query.gte("price", minPrice);
      }
      if (maxPrice) {
        query = query.lte("price", maxPrice);
      }

      const { data } = await query.order("created_at", { ascending: false });

      setResults(data ?? []);
    } catch (error) {
      console.error("Filter properties Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchResults();
  }, [type, bedrooms, minPrice, maxPrice, debouncedSearch]);

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-50">
      <View className="mb-4">
        <Text className="font-bold text-gray-900 mb-4 text-2xl">
          Find Property
        </Text>

        <View className="flex-row items-center gap-3">
          <View className="flex-1 shadow flex-row items-center bg-white rounded-xl gap-3 px-3">
            <FontAwesome name="search" size={18} color={"#9CA3AF"} />
            <TextInput
              className="flex-1 py-3 text-gray-800"
              placeholder="Search by title or city..."
              placeholderTextColor={"#9CA3AF"}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <FontAwesome name="close" size={18} color={"#9CA3AF"} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowFiltersModel(true)}
            className={`rounded-xl shadow p-3 ${activeFilterCount > 0 ? "bg-blue-500" : "bg-white"}`}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFilterCount > 0 ? "#fff" : "#374151"}
            />
            {activeFilterCount > 0 && (
              <View className="bg-red-500 w-[18px] h-[18px] rounded-full absolute -right-1 -top-1 p-1 items-center justify-center">
                <Text className="text-white font-bold text-[8px]">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {activeFilterCount > 0 && (
          <View className="flex-row gap-3 flex-wrap mt-3">
            {type !== null && (
              <View className="flex-row items-center gap-1 border bg-blue-50 border-blue-200 rounded-full px-3 py-1">
                <Text className="capitalize text-xs font-semibold text-blue-700">
                  {type}
                </Text>
                <TouchableOpacity onPress={() => setType(null)}>
                  <Ionicons name="close" color={"#1d4ed8"} />
                </TouchableOpacity>
              </View>
            )}

            {bedrooms !== null && (
              <View className="flex-row items-center gap-1 border bg-blue-50 border-blue-200 rounded-full px-3 py-1">
                <Ionicons name="bed" color={"#1d4ed8"} size={10} />
                <Text className="text-xs font-semibold text-blue-700">
                  {bedrooms === 4
                    ? "4+ beds"
                    : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                </Text>
                <TouchableOpacity onPress={() => setBedrooms(null)}>
                  <Ionicons name="close" color={"#1d4ed8"} />
                </TouchableOpacity>
              </View>
            )}

            {(minPrice !== null || maxPrice !== null) && (
              <View className="flex-row items-center gap-1 border bg-blue-50 border-blue-200 rounded-full px-3 py-1">
                <Text className="text-xs font-semibold text-blue-700">
                  {minPrice && maxPrice
                    ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                    : minPrice
                      ? `From ${formatPrice(minPrice)}`
                      : `Upto ${formatPrice(maxPrice!)}`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setMinPrice(null);
                    setMaxPrice(null);
                  }}
                >
                  <Ionicons name="close" color={"#1d4ed8"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={results}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PropertyCard property={item} />}
        keyExtractor={(data) => data.id}
        ListHeaderComponent={
          !isLoading && results.length > 0 ? (
            <View className="mb-2">
              <Text className="ml-1 text-gray-600 text-sm">
                {results.length}{" "}
                {results.length > 1 ? "properties" : "property"} found
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="pt-10">
              <Text className="text-center  text-gray-400">
                No properties found!
              </Text>
            </View>
          ) : (
            <ActivityIndicator className="py-10" />
          )
        }
      />

      <FilterModal
        showFilters={showFiltersModel}
        onClose={() => setShowFiltersModel(false)}
      />
    </SafeAreaView>
  );
}
