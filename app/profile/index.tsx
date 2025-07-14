import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Text, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useRouter } from "expo-router";
import ImagePickerInput from "@/components/common/ImagePicker";
import { UserContext } from "@/contexts/user";
import dayjs from "dayjs";
import EditFieldBottomSheet from "@/components/profile/EditFieldBottomSheet";
import { updateProfile } from "@/services/api.helper";
import { showToast } from "@/services/toastConfig";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/config";

const genderData = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const signUpSchema = z
  .object({
    name: z.string().nonempty({ message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z
      .string()
      .nonempty({ message: "Phone number is required" })
      .optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    department: z.string().optional(),
    designation: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function ProfileUpdate() {
  const [gender, setGender] = React.useState<any>("");
  const router = useRouter();
  const { user, fetchUserProfile } = useContext(UserContext);
  const [dateTime, setDateTime] = useState<any>();
  const [image, setImage] = useState<any>();
  const [selectedField, setSelectedField] = useState<
    "name" | "email" | "phone" | "department" | "designation" | null
  >(null);
  const [fieldValue, setFieldValue] = useState<any>("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [isIndicator, setIsIndicator] = useState(false);

  const {
    control,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      department: "",
      designation: "",
    },
  });

  useEffect(() => {
    if (user?.id) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        designation: user.designation || "",
      });
      setGender(user?.gender || "");
      setDateTime(user?.dateOfBirth ? dayjs(user?.dateOfBirth) : "");
      setImage(user?.image || "");
    }
  }, [user?.id, isUpdated]);

  const handleUpdate = async (payload: any) => {
    try {
      setIsIndicator(true);
      const res = await updateProfile(payload);
      if (res?.status === 400) {
        showToast("error", res?.msg);
      } else if (res?.status === 401) {
        showToast("error", res?.msg);
      } else {
        showToast("success", res?.msg || "Data updated successfully");
        await fetchUserProfile();
        setIsUpdated(!isUpdated);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data?.message || "Failed to update, Please try again."
        );
      } else {
        showToast("error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsIndicator(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView style={styles.screen}>
        <View style={styles.container}>
          {/* header part */}
          <View style={styles.header}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => {
                  router.push("/(home)/more");
                }}
                style={{ zIndex: 1 }}
              >
                <Icon
                  name="arrow-left-thin"
                  color={Colors.text.secondary}
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%" }}>
              <Text style={styles.headerText}>Personal Information</Text>
            </View>
          </View>

          {/* profile image */}
          <View style={styles.imageContainer}>
            <ImagePickerInput
              imageValue={image}
              setImageValue={async (data) => {
                const asset = data?.assets?.[0];
                const isImage = asset?.mimeType?.startsWith("image/");
                const isSizeOk = asset?.fileSize
                  ? asset.fileSize < 10 * 1024 * 1024
                  : true;
                if (!isImage || !isSizeOk) {
                  showToast(
                    "error",
                    !isImage
                      ? "Invalid file type. Please upload a valid image."
                      : "File size too large. Please upload an image less than 10MB."
                  );
                  return;
                }
                const formData: any = new FormData();
                formData.append("file", {
                  uri: asset.uri,
                  name: asset.fileName,
                  type: asset.mimeType,
                });
                try {
                  const token = await AsyncStorage.getItem("token");
                  const response: any = await fetch(
                    config?.API_URL + "/file/upload",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                      },
                      body: formData,
                    }
                  );
                  const result = await response.json();
                  if (result?.url) {
                    handleUpdate({
                      image:
                        typeof result?.url === "string"
                          ? result?.url
                          : data?.assets[0]?.uri || "",
                    });
                    showToast(
                      "success",
                      result?.message || "Data updated successfully"
                    );
                    // await fetchUserProfile();
                    setIsUpdated(!isUpdated);
                  } else {
                    showToast("error", result?.message);
                  }
                } catch (error) {
                  console.log(error);
                  showToast("error", "Failed to upload, Please try again.");
                }
              }}
            />
          </View>

          {/* form */}
          <View style={styles.formContainer}>
            {/* Name Input */}
            <Text style={styles.label}>Full Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedField("name");
                      setFieldValue(value);
                    }}
                  >
                    <TextInput
                      placeholder="Enter your full name"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      left={
                        <TextInput.Icon
                          icon={() => (
                            <Icon
                              name="account"
                              size={20}
                              color={Colors.text.tertiary}
                            />
                          )}
                        />
                      }
                      style={styles.input}
                      outlineColor={Colors.boarder}
                      activeOutlineColor={Colors.light}
                      editable={false}
                    />
                  </TouchableOpacity>
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name.message}</Text>
                  )}
                </>
              )}
            />

            {/* Email Input */}
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedField("email");
                      setFieldValue(value);
                    }}
                  >
                    <TextInput
                      placeholder="example@email.com"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      left={
                        <TextInput.Icon
                          icon={() => (
                            <Icon
                              name="email"
                              size={20}
                              color={Colors.text.tertiary}
                            />
                          )}
                        />
                      }
                      autoCapitalize="none"
                      style={styles.input}
                      outlineColor={Colors.boarder}
                      activeOutlineColor={Colors.light}
                      editable={false}
                    />
                  </TouchableOpacity>
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </>
              )}
            />

            {/* Phone Input */}
            <Text style={styles.label}>Phone Number</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedField("phone");
                      setFieldValue(value);
                    }}
                  >
                    <TextInput
                      placeholder="Enter your phone number"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      left={
                        <TextInput.Icon
                          icon={() => (
                            <Icon
                              name="phone"
                              size={20}
                              color={Colors.text.tertiary}
                            />
                          )}
                        />
                      }
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                      outlineColor={Colors.boarder}
                      activeOutlineColor={Colors.light}
                      editable={false}
                    />
                  </TouchableOpacity>
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </>
              )}
            />

            {/* Department Input */}
            <Text style={styles.label}>Department</Text>
            <Controller
              control={control}
              name="department"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedField("department");
                      setFieldValue(value);
                    }}
                  >
                    <TextInput
                      placeholder="example@email.com"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      left={
                        <TextInput.Icon
                          icon={() => (
                            <Icon
                              name="atlassian"
                              size={20}
                              color={Colors.text.tertiary}
                            />
                          )}
                        />
                      }
                      autoCapitalize="none"
                      style={styles.input}
                      outlineColor={Colors.boarder}
                      activeOutlineColor={Colors.light}
                      editable={false}
                    />
                  </TouchableOpacity>
                  {errors.department && (
                    <Text style={styles.errorText}>
                      {errors.department.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Department Input */}
            <Text style={styles.label}>Designation</Text>
            <Controller
              control={control}
              name="designation"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedField("designation");
                      setFieldValue(value);
                    }}
                  >
                    <TextInput
                      placeholder="example@email.com"
                      value={value}
                      onChangeText={onChange}
                      mode="outlined"
                      left={
                        <TextInput.Icon
                          icon={() => (
                            <Icon
                              name="atom"
                              size={20}
                              color={Colors.text.tertiary}
                            />
                          )}
                        />
                      }
                      autoCapitalize="none"
                      style={styles.input}
                      outlineColor={Colors.boarder}
                      activeOutlineColor={Colors.light}
                      editable={false}
                    />
                  </TouchableOpacity>
                  {errors.designation && (
                    <Text style={styles.errorText}>
                      {errors.designation.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* <View style={{ marginBottom: 6 }}>
              <Text style={styles.label}>Date of Birth</Text>
              <DateTimePickerInput
                dateTime={dateTime}
                setDateTime={(data) => {
                  handleUpdate({ dateOfBirth: data });
                }}
              />
            </View>
            <View>
              <Text style={styles.label}>Gender</Text>
              <SelectInput
                value={gender}
                setValue={(gender) => {
                  setGender(gender);
                  handleUpdate({ gender });
                }}
                data={genderData}
              />
            </View> */}
          </View>
          {isIndicator && (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color={Colors.primary}
            />
          )}
        </View>

        {/* Bottom Sheet for Editing Fields */}
        <EditFieldBottomSheet
          visible={!!selectedField}
          onClose={() => setSelectedField(null)}
          fieldName={selectedField || ""}
          fieldValue={fieldValue}
          label={
            selectedField === "name"
              ? "Full Name"
              : selectedField === "email"
              ? "Email"
              : "Phone Number"
          }
          inputType={
            selectedField === "email"
              ? "email"
              : selectedField === "phone"
              ? "phone"
              : "text"
          }
          setIsUpdated={setIsUpdated}
          isUpdated={isUpdated}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F9FF",
    padding: 20,
    paddingTop: 80,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  headerText: {
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  imageContainer: {
    marginTop: 30,
    position: "relative",
    width: "100%",
    height: 110,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.text.tertiary,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  label: {
    color: Colors.text.primary,
    fontFamily: Fonts.UrbanistSemibold,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  formContainer: {
    marginTop: 50,
  },
});
