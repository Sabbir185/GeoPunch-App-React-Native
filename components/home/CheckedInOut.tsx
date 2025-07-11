import React from "react";
import { StyleSheet, View } from "react-native";
import ProgressClock from "./_progressClock";
import CheckedInOutAdress from "./_checkedInOutAdress";

interface IProps {
  attendenceStatus: any;
  checkInObj?: {
    address: string;
    time: string;
  };
  checkOutObj?: {
    address: string;
    time: string;
  };
  checkedStatus: string;
}

export default function CheckedInOut({
  attendenceStatus,
  checkInObj,
  checkOutObj,
  checkedStatus,
}: IProps) {
  const payload = { ...attendenceStatus, checkedStatus };
  return (
    <View style={styles.container}>
      <View style={{ marginVertical: 10 }}>
        <ProgressClock {...payload} />
      </View>
      <View
        style={{
          flexDirection: "column",
          gap: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckedInOutAdress
          title="Checked In"
          address={checkInObj?.address}
          time={checkInObj?.time}
          color="#1B9C58"
        />
        <CheckedInOutAdress
          title="Check Out"
          address={checkOutObj?.address}
          time={checkOutObj?.time}
          color="#E87E04"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
});
