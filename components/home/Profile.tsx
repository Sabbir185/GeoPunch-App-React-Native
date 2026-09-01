import { Dimensions, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import { images } from "@/constants/images";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";

const deviceWidth = Dimensions.get("window").width;
interface UserProfileProps {
  name?: string;
  address?: string;
  image?: any;
  imgSize?: number;
  nameTitleSize?: number;
  email?: string;
}

export default function UserProfile({
  name,
  address,
  image,
  email,
  nameTitleSize = 16,
  imgSize = 48,
}: UserProfileProps) {

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
      }}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={
            image
              ? {
                  uri:
                    typeof image === "string" ? image : image?.assets[0]?.uri,
                }
              : images.profile
          }
          style={{
            width: imgSize,
            height: imgSize,
            borderRadius: imgSize / 2,
            borderWidth: 2,
            borderColor: Colors.white,
            backgroundColor: "#E2E8F0",
          }}
        />
        {/* Subtle active status indicator dot */}
        <View
          style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: Colors.success,
            borderWidth: 2,
            borderColor: Colors.white,
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: Fonts.UrbanistBold,
            fontSize: nameTitleSize,
            color: Colors.text.primary,
            letterSpacing: -0.3,
          }}
        >
          {name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
            marginTop: 3,
          }}
        >
          {email ? (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                fontFamily: Fonts.SatoshiMedium,
                color: Colors.text.secondary,
              }}
            >
              {email}
            </Text>
          ) : (
            <>
              <Image
                source={images.location}
                style={{
                  width: 14,
                  height: 14,
                  tintColor: Colors.primary,
                }}
              />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 13,
                  fontFamily: Fonts.SatoshiMedium,
                  color: Colors.text.secondary,
                }}
              >
                {address || ""}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
