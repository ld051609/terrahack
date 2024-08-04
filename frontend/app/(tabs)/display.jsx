import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, ScrollView, StyleSheet, Text, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

function Display() {
  const route = useRoute();
  const { description, emissionResults } = route.params || {};
  
  const [desc, setDesc] = useState("");
  const [emission, setEmission] = useState("");

  useEffect(() => {
    if (description && emissionResults) {
      setDesc(description);
      setEmission(emissionResults);
    } else {
      setDesc("No description available");
      setEmission("No emission results available");
    }
  }, [description, emissionResults]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.results}>
      <Image
              source={require('../../assets/images/diet.png')}
              style={styles.image}
            >
            </Image>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Description: {desc}</Text>
          <Text style={styles.text}>Emission Results: {emission}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#80AF81",
    display: "flex",
    flex: 1,
    alignItems: "center"

  },
  results: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "white",
    margin: 15,
    flex: 1,
    alignItems: "center"
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 40
  }
});

export default Display;
