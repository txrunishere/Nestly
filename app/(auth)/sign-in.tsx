import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { errors, fetchStatus, signIn } = useSignIn();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const isLoading = fetchStatus === "fetching";

  const handleSigninPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      className="bg-gray-50"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          className="w-28 h-28"
          source={require("../../assets/images/nestly_logo.png")}
        />
        <Text className="font-bold text-3xl text-gray-600 mb-2">
          Welcome back
        </Text>
        <Text className="text-gray-500 mb-8">Sign in to your account</Text>

        <View className="gap-3">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="john@example.com"
            placeholderTextColor={"#9CA3AF"}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.fields.identifier && (
            <Text className="text-red-500 text-sm">
              {errors.fields.identifier.message}
            </Text>
          )}
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="𐄁𐄁𐄁𐄁𐄁𐄁𐄁𐄁"
            placeholderTextColor={"#9CA3AF"}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            autoCapitalize="none"
            secureTextEntry
          />
          {errors.fields.password && (
            <Text className="text-red-500 text-sm">
              {errors.fields.password.message}
            </Text>
          )}
        </View>
        <TouchableOpacity
          disabled={isLoading}
          className="bg-blue-500 mt-4 py-2 rounded-xl items-center mb-2"
          onPress={handleSigninPress}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text className="text-white  text-base font-semibold">Sign in</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center gap-1">
          <Text>Don&apos;t have an account?</Text>
          <Link
            className="font-semibold text-blue-500"
            href={"/(auth)/sign-up"}
          >
            Sign up
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
