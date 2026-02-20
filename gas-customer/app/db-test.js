import { View, Text, Button } from "react-native";
import { useEffect, useState } from "react";
import { ref, set, onValue } from "firebase/database";
import { db } from "../src/config/firebase";

export default function DbTest() {
  const [value, setValue] = useState("Loading...");

  useEffect(() => {
    const testRef = ref(db, "test/connection");

    const unsubscribe = onValue(testRef, (snapshot) => {
      const data = snapshot.val();
      setValue(data ? JSON.stringify(data) : "No data yet");
    });

    return () => unsubscribe();
  }, []);

  const writeData = async () => {
    try {
      await set(ref(db, "test/connection"), {
        message: "🔥 Firebase connected successfully!",
        time: Date.now(),
      });
    } catch (err) {
      setValue("Error: " + err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
        Realtime DB Test
      </Text>

      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        {value}
      </Text>

      <Button title="Write Test Data" onPress={writeData} />
    </View>
  );
}