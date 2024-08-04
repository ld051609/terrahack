import React, { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FS from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [desc, setDesc] = useState("");
  const [results, setResult] = useState("");
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (!loading && photoUri) {
      setPhotoUri(null);
    }
  }, [loading]);

  if (!permission || !mediaPermission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  if (!mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to save photos</Text>
        <Button onPress={requestMediaPermission} title="Grant Media Permission" />
      </View>
    );
  }

  const uriToBase64 = async (uri) => {
    try {
      const base64 = await FS.readAsStringAsync(uri, {
        encoding: FS.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Failed to convert URI to Base64", error);
    }
  };

  const toServer = async (base64) => {
    try {
      setLoading(true);
      let url = "https://d625-141-117-116-145.ngrok-free.app/upload";

      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64 }),
      });

      if (!response.ok) {
        Alert.alert("Image Not Recognizable", "Please retake the image");
        return;
      }

      const responseData = await response.json();
      console.log(responseData);

      setDesc(responseData['azure_description']);
      setResult(responseData['emission_results']);
      setTotalEmissions(responseData['total_co2']);
      Alert.alert("Success", "Information is processed successfully");

      navigation.navigate('display', {
        image: photoUri,
        description: responseData['azure_description'],
        emissionResults: responseData['emission_results'],
        total: responseData['total_co2'],
      });
    } catch (error) {
      console.error("Failed to send data to the server", error);
      Alert.alert("Error", "Failed to process the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        let photo = await cameraRef.current.takePictureAsync();
        console.log(photo);

        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        console.log(asset);

        setPhotoUri(photo.uri);

        // Convert the photo URI and send it to the backend
        const base64 = await uriToBase64(photo.uri);
        await toServer(base64);
      } catch (error) {
        console.error("Failed to take picture", error);
        Alert.alert("Error", "Failed to take picture. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}></Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {photoUri && !loading && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: photoUri }} style={styles.image} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    width: 60,
    height: 60, 
    fontWeight: 'bold',
    color: 'white',
    borderWidth: 30,
    borderRadius: 30, 
    borderColor: "white",
    textAlign: 'center', 
    lineHeight: 60, 
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})
