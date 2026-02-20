import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { ref, set, onValue } from "firebase/database";
import { db } from "../config/firebase";

export default function DbTestScreen() {
  const [dbValue, setDbValue] = useState("Loading...");

  useEffect(() => {
    const testRef = ref(db, "test/connection");

    // Listen (READ)
    const unsub = onValue(testRef, (snap) => {
      const val = snap.val();
      setDbValue(val ? JSON.stringify(val) : "No data yet");
    });

    return () => unsub();
  }, []);

  const writeTest = async () => {
    try {
      await set(ref(db, "test/connection"), {
        message: "✅ Realtime DB connected!",
        time: Date.now(),
      });
      console.log("Write success");
    } catch (err) {
      console.log("Write failed:", err);
      setDbValue("Write failed: " + err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Firebase Realtime DB Test
      </Text>

      <Text style={{ textAlign: "center", marginBottom: 16 }}>
        Current DB value:
        {"\n"}
        {dbValue}
      </Text>

      <Button title="Write Test Data" onPress={writeTest} />
    </View>
  );
}