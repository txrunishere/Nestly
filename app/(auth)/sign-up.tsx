import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
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

export default function SignUp() {
  const { errors, fetchStatus, signUp } = useSignUp();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const router = useRouter();
  const isLoading = fetchStatus === "fetching";

  const handleSignupPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      firstName,
      lastName,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerifyPress = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (error) {
      console.error(error);
      setCode("");
      alert(error.message);
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.missingFields.length === 0 &&
    signUp.unverifiedFields.includes("email_address")
  ) {
    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          className="w-28 h-28"
          source={require("../../assets/images/nestly_logo.png")}
        />
        <Text className="font-bold text-3xl text-gray-600 mb-2">
          Verify your account
        </Text>
        <Text className="text-gray-500 mb-6">
          We send a email to {signUp.emailAddress}
        </Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Enter verification code"
          placeholderTextColor={"#9CA3AF"}
          className=" border border-gray-300 rounded-xl px-4 py-3"
          autoCapitalize="none"
          keyboardType="number-pad"
        />
        <Text
          className="mt-1 text-blue-500"
          onPress={() => signUp.verifications.sendEmailCode()}
        >
          I need a new code
        </Text>
        {errors.fields.code && (
          <Text className="mt-2 text-red-500 text-sm">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleVerifyPress}
          disabled={isLoading}
          className="bg-blue-500 mt-4 py-2 rounded-xl items-center mb-2"
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text className="font-semibold text-white">Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

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
          Create Account
        </Text>
        <Text className="text-gray-500 mb-8">Find your dream home today</Text>

        <View className="flex-row gap-3 mb-3">
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={"#9CA3AF"}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            autoCapitalize="words"
          />
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor={"#9CA3AF"}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            autoCapitalize="words"
          />
        </View>
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
          {errors.fields.emailAddress && (
            <Text className="text-red-500 text-sm">
              {errors.fields.emailAddress.message}
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
          onPress={handleSignupPress}
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text className="text-white  text-base font-semibold">Signup</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center gap-1">
          <Text>Already have an account?</Text>
          <Link
            className="font-semibold text-blue-500"
            href={"/(auth)/sign-in"}
          >
            Sign in
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
