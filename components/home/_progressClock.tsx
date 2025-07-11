import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";

const props = {
  activeStrokeWidth: 12,
  inActiveStrokeWidth: 12,
  inActiveStrokeOpacity: 0.8,
};

export default function ProgressClock({
  totalActiveTime: initialTotalActiveTime,
  checkStatus: initialCheckStatus,
  checkedStatus,
}: {
  totalActiveTime: string | Date | null;
  checkStatus: string;
  checkedStatus: string;
}) {
  const [totalActiveTime, setTotalActiveTime] = useState(initialTotalActiveTime);
  const [checkStatus, setCheckStatus] = useState(initialCheckStatus);

  const [hoursProgress, setHoursProgress] = useState(0);
  const [minutesProgress, setMinutesProgress] = useState(0);
  const [secondsProgress, setSecondsProgress] = useState(0);

  useEffect(() => {
    if (!initialTotalActiveTime) return;

    setTotalActiveTime(initialTotalActiveTime);
    setCheckStatus(initialCheckStatus);

    if (typeof initialTotalActiveTime === "string") {
      const [hours, minutes, seconds] = initialTotalActiveTime.split(":").map(Number);
      setHoursProgress(hours);
      setMinutesProgress(minutes);
      setSecondsProgress(seconds);
    } else if (initialTotalActiveTime instanceof Date) {
      setHoursProgress(initialTotalActiveTime.getHours());
      setMinutesProgress(initialTotalActiveTime.getMinutes());
      setSecondsProgress(initialTotalActiveTime.getSeconds());
    }
  }, [initialTotalActiveTime, initialCheckStatus, checkedStatus]);

  useEffect(() => {
    if (checkStatus !== "in" || checkedStatus === "out" || !totalActiveTime) return;
    const interval = setInterval(() => {
      setSecondsProgress((prevSeconds) => {
        if (prevSeconds >= 59) {
          setMinutesProgress((prevMinutes) => {
            if (prevMinutes >= 59) {
              setHoursProgress((prevHours) => Math.min(prevHours + 1, 8));
              return 0;
            }
            return prevMinutes + 1;
          });
          return 0;
        }
        return prevSeconds + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [checkStatus, checkedStatus, totalActiveTime]);

  const totalDuration = `${String(hoursProgress).padStart(2, "0")}:${String(
    minutesProgress
  ).padStart(2, "0")}:${String(secondsProgress).padStart(2, "0")}`;

  return (
    <>
      <CircularProgressBase
        {...props}
        value={hoursProgress}
        radius={80}
        activeStrokeColor={"#F7A37A"}
        inActiveStrokeColor={"#ffffff"}
        maxValue={8}
      >
        <CircularProgressBase
          {...props}
          value={hoursProgress >= 8 ? 60 : minutesProgress}
          radius={60}
          activeStrokeColor={"#FAC9AE"}
          inActiveStrokeColor={"#ffffff"}
          maxValue={60}
        >
          <Text style={styles.time}>{totalDuration}</Text>
          <Text style={styles.timeText}>Total Duration</Text>
        </CircularProgressBase>
      </CircularProgressBase>
    </>
  );
}

const styles = StyleSheet.create({
  time: {
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  timeText: {
    fontFamily: Fonts.SatoshiMedium,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginTop: 5,
  },
});
