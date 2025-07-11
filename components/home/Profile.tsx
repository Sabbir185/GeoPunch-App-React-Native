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
        height: 50,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
    >
      <View>
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
            borderRadius: 100,
            borderWidth: 1.5,
            borderColor: Colors.primary,
          }}
        />
      </View>
      <View>
        <View>
          <Text
            style={{
              fontFamily: Fonts.UrbanistSemibold,
              fontSize: nameTitleSize,
              fontWeight: 600,
            }}
          >
            {name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            marginTop: 5,
            width: deviceWidth < 380 ? 270 : 320,
          }}
        >
          {email ? (
            <Text style={{ color: Colors.text.secondary }}>{email || ""}</Text>
          ) : (
            <>
              <Image
                source={images.location}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: Colors.primary,
                }}
              />
              <Text style={{ color: Colors.text.secondary }}>
                {address || ""}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
