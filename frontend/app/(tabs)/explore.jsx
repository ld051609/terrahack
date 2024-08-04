//webcam page

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FS from "expo-file-system";
export default function App({navigation}) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();


  const [desc, setDesc] = useState("")
  const [results, setResult] = useState("")


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
    let base64 = await FS.readAsStringAsync(uri, {
      encoding: FS.EncodingType.Base64,
    });
    return base64;
  };
  
  const toServer = async (base64) => {
    let url = "https://688c-141-117-116-145.ngrok-free.app/upload"

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64: base64 }),
    });
    if(!response.ok){
      return JSON({message: "NOT ok"})
    }

    const responseData = await response.json();
    console.log(responseData);

    setDesc(responseData['azure_description'])
    setResult(responseData['emission_results'])
    Alert("Information is processed successfully")

    // Navigate to display page
    navigation.navigate("display")

    
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      console.log(asset);

      setPhotoUri(photo.uri);

      // Convert the photo URI and send it to the backend
      const base64 = await uriToBase64(photo.uri);
      await toServer(base64);
    }
  };


  return (
    <View style={styles.container}>
      <CameraView style={styles.camera}ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Scan</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {photoUri && (
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
});
