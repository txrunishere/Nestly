import { useFilterStore } from "@/store/filter.store";
import { PropertyType } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FilterModelProps = {
  showFilters: boolean;
  onClose: () => void;
};

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

const chip = (active: boolean) =>
  `px-4 py-2 rounded-full border ${
    active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
  }`;

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`;

export const FilterModal = ({ showFilters, onClose }: FilterModelProps) => {
  const {
    type,
    bedrooms,
    maxPrice,
    minPrice,
    setType,
    setBedrooms,
    setMaxPrice,
    setMinPrice,
    resetFilters,
  } = useFilterStore((state) => state);

  // use local min and max value because textinput accept string values
  const [localMinValue, setLocalMinValue] = useState<string>(
    minPrice ? String(minPrice) : "",
  );
  const [localMaxValue, setLocalMaxValue] = useState<string>(
    maxPrice ? String(maxPrice) : "",
  );

  const activeFilterCount = [type, bedrooms, minPrice, maxPrice].filter(
    (active) => active !== null,
  ).length;

  const handleResetFilters = () => {
    setLocalMinValue("");
    setLocalMaxValue("");
    resetFilters();
    onClose();
  };

  const handleApply = () => {
    setMinPrice(localMinValue ? Number(localMinValue) : null);
    setMaxPrice(localMaxValue ? Number(localMaxValue) : null);
    onClose();
  };

  return (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <TouchableOpacity className="p-1" onPress={onClose}>
            <Ionicons name="close" size={22} />
          </TouchableOpacity>

          <Text className="font-bold text-lg text-gray-900">Filters</Text>

          <TouchableOpacity onPress={handleResetFilters}>
            <Text className="text-sm font-semibold text-blue-500">Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 "
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-gray-900 text-base font-bold mb-3">
            Property Type
          </Text>

          <View className="flex-row gap-2 flex-wrap mb-6">
            {TYPES.map((item) => (
              <TouchableOpacity
                onPress={() => setType(item.value)}
                key={item.label}
                className={chip(type === item.value)}
              >
                <Text className={chipText(type === item.value)}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-gray-900 text-base font-bold mb-3">
            Bedrooms
          </Text>

          <View className="flex-row gap-2 flex-wrap mb-6">
            {BEDS.map((item) => (
              <TouchableOpacity
                onPress={() => setBedrooms(item.value)}
                key={item.label}
                className={chip(bedrooms === item.value)}
              >
                <Text className={chipText(bedrooms === item.value)}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-gray-900 text-base font-bold mb-3">
            Price Range (₹)
          </Text>

          <View className="flex-row gap-3 mb-3">
            {[
              {
                label: "Min value",
                value: localMinValue,
                onChangeText: setLocalMinValue,
                placeholder: "0",
              },
              {
                label: "Max value",
                value: localMaxValue,
                onChangeText: setLocalMaxValue,
                placeholder: "Any",
              },
            ].map(({ label, onChangeText, placeholder, value }) => (
              <View key={label} className="flex-1">
                <Text className="text-xs text-gray-500 font-medium mb-1">
                  {label}
                </Text>

                <View className="border border-gray-200 rounded-xl px-2 flex-row items-center gap-2">
                  <Text className="text-gray-400 text-sm">₹</Text>
                  <TextInput
                    className="flex-1 py-3 text-gray-800"
                    placeholder={placeholder}
                    placeholderTextColor={"#9ca3af"}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChangeText}
                  />
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row gap-2 flex-wrap mb-6">
            {PRICE_PRESETS.map((item) => {
              const active = minPrice === item.min && maxPrice === item.max;

              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => {
                    setLocalMinValue(item.min ? String(item.min) : "");
                    setLocalMaxValue(item.max ? String(item.max) : "");
                    setMinPrice(item.min);
                    setMaxPrice(item.max);
                  }}
                  className={`px-3 py-1 rounded-full border ${
                    active
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${active ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={handleApply}
          className="mb-4 py-3 items-center mx-4 rounded-2xl bg-blue-500"
        >
          <Text className="text-white text-base font-semibold">
            Apply Filters{" "}
            {activeFilterCount > 0 ? `(${activeFilterCount})` : null}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
