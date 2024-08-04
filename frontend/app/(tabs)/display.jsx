import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, ScrollView, StyleSheet, Text, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ProgressBar from '../../components/ProgressBar';
function Display() {
  const route = useRoute();
  const { description, emissionResults,total } = route.params || {};
  const [photoUri, setPhotoUri] = useState("")
  const [desc, setDesc] = useState("");
  const [emission, setEmission] = useState("");
  const [progress, setProgress] = useState("")

  useEffect(() => {
    if (description && emissionResults) {
      setDesc(description);
      setEmission(emissionResults);
      setProgress(total)
    } else {
      setDesc("No description available");
      setEmission("No emission results available");
      setProgress("")
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

          {photoUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: photoUri }} style={styles.image} />
            </View>
          )}     
          
          <Text style={styles.text}>Description: {desc}</Text>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 1.5,
              marginVertical: 10
            }}
          />
          <Text style={styles.text}>Emission Results: {emission}</Text>

          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 1.5,
              marginVertical: 10
            }}
          />
          <Text style={styles.text}>Carbon Emission Bar</Text>
          <ProgressBar progress={progress}/>

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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 40
  },
 
});

export default Display;
