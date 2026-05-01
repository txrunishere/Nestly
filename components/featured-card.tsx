import { Property } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type FeaturedCardProps = {
  property: Property;
};

export const FeaturedCard = ({ property }: FeaturedCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, { opacity: property.is_sold ? 0.5 : 1 }]}
      // onPress={() => router.push(`/(root)/property/${property.id}`)}
    >
      <Image
        source={{ uri: property.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{property.type}</Text>
      </View>

      {property.is_sold && (
        <View style={styles.soldBadge}>
          <Text style={styles.soldText}>Sold</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color="#6B7280" />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.address}, {property.city}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(property.price)}</Text>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="bed-outline" size={13} color="#6B7280" />
              <Text style={styles.featureText}>{property.bedrooms}</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="water-outline" size={13} color="#6B7280" />
              <Text style={styles.featureText}>{property.bathrooms}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 270,
    marginRight: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 170,
  },
  typeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(79,70,229,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
    textTransform: "capitalize",
  },
  soldBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  soldText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
    flexShrink: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4F46E5",
  },
  features: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  featureText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
  },
});
