import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import dayjs from "dayjs";

interface DateTimePickerProps {
  label?: string;
  dateTime?: string;
  setDateTime?: (value: any) => void;
}

const DateTimePickerInput = ({
  label,
  dateTime,
  setDateTime = () => {},
}: DateTimePickerProps) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    setSelectedDate(dayjs(date).format("MMM D, YYYY"));
    if (date) {
      setDateTime(date);
    }
    hideDatePicker();
  };

  useEffect(() => {
    if (dateTime) {
      setSelectedDate(dayjs(dateTime).format("MMM D, YYYY"));
    }
  }, [dateTime]);

  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={selectedDate}
        mode="outlined"
        placeholder="Select Date"
        style={styles.input}
        onFocus={showDatePicker}
        right={<TextInput.Icon icon="calendar" onPress={showDatePicker} />}
        editable={false}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
});

export default DateTimePickerInput;
