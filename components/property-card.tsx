import { useSaveProperty } from "@/hooks/useSaveProperty";
import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

type PropertyCardProps = {
  property: Property;
  showSave?: boolean;
  onUnsave?: () => void;
};

export const PropertyCard = ({
  property,
  onUnsave,
  showSave = false,
}: PropertyCardProps) => {
  const router = useRouter();

  const { isSaved, saveLoading, toggleSave } = useSaveProperty(
    property.id,
    onUnsave,
  );

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(root)/property/${property.id}`)}
      className="flex-row bg-white rounded-2xl mx-1 mb-4 overflow-hidden"
    >
      <Image
        source={{
          uri: property.images?.[0],
        }}
        className="w-28 h-28 shadow-lg"
        resizeMode="cover"
      />

      <View className="flex-1 p-3 justify-between">
        <View className="flex-row justify-between">
          <View>
            <Text
              className="text-sm font-bold text-gray-800 mb-1"
              numberOfLines={1}
            >
              {property.title}
            </Text>
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={11} color="#6B7280" />
              <Text className="text-xs text-gray-500" numberOfLines={1}>
                {property.city}
              </Text>
            </View>
          </View>

          <TouchableOpacity disabled={saveLoading} onPress={toggleSave}>
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              color={isSaved ? "red" : "black"}
              size={18}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-blue-600 font-bold text-sm">
            {formatPrice(property.price)}
          </Text>
          {property.is_sold && (
            <View className="bg-red-50 px-2 py-0.5 rounded-full">
              <Text className="text-red-500 text-xs font-semibold">Sold</Text>
            </View>
          )}
          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={11} color="#6B7280" />
              <Text className="text-xs text-gray-500">
                {property.bedrooms} bd
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="expand-outline" size={11} color="#6B7280" />
              <Text className="text-xs text-gray-500">
                {property.area_sqft} ft²
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
