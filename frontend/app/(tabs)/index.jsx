//default home page

import React, { Component } from "react";
import { TouchableOpacity, SafeAreaView, StyleSheet, View, Alert, Text } from "react-native";

//Importing the installed libraries
import * as FS from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

// export default function App(){
//     const info = [
//       "Food scanner is used to scan your meals and give you information on the carbon footprint of the food you eat! Start scanning now or upload past meals."
//     ]

  
//     return (


//       <SafeAreaView style={styles.container}>
//           <Text style = {styles.header}>
//             Welcome!
//           </Text>
          
//           <View style={styles.paragraphContainer}>
//             <Text style = {styles.paragraph}>
//               {info}
//             </Text>
//             {/* <Image
//               source={require('../../assets/images/diet.png')}
//               style={styles.image}
//             >
//             </Image> */}
//           </View>
        
//       </SafeAreaView>
//   )}



export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cameraRollPer: null,
      disableButton: false,
    };
  }
  async componentDidMount() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    this.setState((state, props) => {
      return {
        cameraRollPer: status === "granted",
        disableButton: false,
      };
    });
  }



  uriToBase64 = async (uri) => {
    let base64 = await FS.readAsStringAsync(uri, {
      encoding: FS.EncodingType.Base64,
    });
    return base64;
  };

  pickMedia = async () => {
    this.setState((state, props) => {
      return {
        cameraRollPer: state.cameraRollPer,
        disableButton: true,
      };
    });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
    });
    if (result.cancelled) {
      return;
    }
    if (result.type == "image") {
      await this.toServer({
        type: result.type,
        base64: result.base64,
        uri: result.uri,
      });
    } else {
      let base64 = await this.uriToBase64(result.uri);
      await this.toServer({
        type: result.type,
        base64: base64,
        uri: result.uri,
      });
    }
  };

  toServer = async (mediaFile) => {
    let type = mediaFile.type;
    let schema = "http://";
    let host = "192.168.1.5";
    let route = "";
    let port = "5000";
    let url = "";
    let content_type = "";
    type === "image"
      ? ((route = "/image"), (content_type = "image/jpeg"))
      : ((route = "/video"), (content_type = "video/mp4"));
    url = schema + host + ":" + port + route;

    let response = await FS.uploadAsync(url, mediaFile.uri, {
      headers: {
        "content-type": content_type,
      },
      httpMethod: "POST",
      uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
    });

    console.log(response.headers);
    console.log(response.body);
  };

  render() {


    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "flex-start",
      },
        header: {
        fontSize: "45px",
        fontWeight: "bold",
        color: "#80AF81",
        marginTop: 20,
        marginLeft: 20,
        paddingBottom: 20
    
    
      },
      paragraph: {
        color: "#80AF81",
        fontSize: "20px"
      },
      paragraphContainer: {
        paddingTop: 20,
        marginHorizontal: 15,
        flex: 1,
        alignItems: "flex-start",
        borderColor: '#80AF81',
        borderWidth: 2,
        borderRadius: 15,
        padding: 2,
        margin: 20
      },
      button: {
        borderWidth:2,
        borderRadius: 20,
        padding: 20,
        borderColor: "#80AF81"
      },
      buttonText: {
        color: "80AF81",
      }
    });
    const info = [
      "Food scanner is used to scan your meals and give you information on the carbon footprint of the food you eat! Start scanning now or upload past meals."
    ]

    return (
      <SafeAreaView style={styles.container}>
        <Text style = {styles.header}>
            Welcome!
          </Text>
          
          <View style={styles.paragraphContainer}>
            <Text style = {styles.paragraph}>
              {info}
            </Text>

         
        {this.state.cameraRollPer ? (
          <TouchableOpacity
            style = {styles.button}
            disabled={this.state.disableButton}
            onPress={async () => {
              await this.pickMedia();
              this.setState((s, p) => {
                return {
                  cameraRollPer: s.cameraRollPer,
                  disableButton: false,
                };
              });
            }}
          >
            <Text style={styles.buttonText}>Pick From Gallery</Text>
          </TouchableOpacity>
        ) : (
          <Text>Camera Roll Permission Required ! </Text>
        )}
         </View>
      </SafeAreaView>
    );
  }
}