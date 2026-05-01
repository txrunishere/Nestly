import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { ComponentProps } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];

type TabItem = {
  name: string;
  label: string;
  icon: IconName;
  activeIcon: IconName;
};

type Props = BottomTabBarProps & {
  isAdmin?: boolean;
};

export function CustomTabBar({ state, navigation, isAdmin = false }: Props) {
  const tabs: TabItem[] = [
    {
      name: "index",
      label: "Home",
      icon: "home-outline",
      activeIcon: "home",
    },
    {
      name: "search",
      label: "Search",
      icon: "search-outline",
      activeIcon: "search",
    },
    {
      name: "saved",
      label: "Saved",
      icon: "bookmark-outline",
      activeIcon: "bookmark",
    },
    {
      name: "profile",
      label: "Profile",
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

  if (isAdmin) {
    tabs.push({
      name: "create",
      label: "Add",
      icon: "add-circle-outline",
      activeIcon: "add-circle",
    });
  }

  return (
    <View className="flex-row justify-around items-center h-[60px] bg-white border-t border-gray-200">
      {tabs.map((tab) => {
        const isFocused = state.routes[state.index]?.name === tab.name;

        const onPress = () => {
          navigation.navigate(tab.name as never);
        };

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            className="items-center justify-center"
          >
            <Ionicons
              name={isFocused ? tab.activeIcon : tab.icon}
              size={24}
              color={isFocused ? "#2563eb" : "#6b7280"}
            />
            <Text
              className={`text-xs ${
                isFocused ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
