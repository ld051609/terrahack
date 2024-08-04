//default home page

import React, { useEffect, useState } from "react";
import { Image, Button, View, SafeAreaView, StyleSheet, Alert, Text , Touchable} from "react-native";

export default function App(){
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
            {/* <Image
              source={require('../../assets/images/diet.png')}
              style={styles.image}
            >
            </Image> */}
          </View>
        
      </SafeAreaView>
  )}

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
    alignItems: "center",
    borderColor: '#80AF81',
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20
  },
  image:{
    width: 200,
    height: 200,
    marginTop: 100
  }
});
