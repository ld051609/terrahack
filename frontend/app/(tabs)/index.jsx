//default home page

import React, { useEffect, useState } from "react";
import { Image, Button, View, SafeAreaView, StyleSheet, Alert, Text , Touchable} from "react-native";

export default function App(){
   
  
    return (

      <SafeAreaView style={styles.container}>
          <Text style = {styles.header}>
            Welcome to EcoEats!
          </Text>
          
          <View style={styles.paragraphContainer}>
            <Text style = {styles.paragraph}>
            Discover the Environmental Impact of Your Meals! Our AI app allows you to scan your food to understand its carbon footprint and make more sustainable choices.             </Text>
            <Image
              source={require('../../assets/images/diet.png')}
              style={styles.image}
            >
            </Image>
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
    fontSize: "18px",
    letterSpacing: '0.5px',
    textAlign: 'center'
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
    width: 180,
    height: 180,
    marginTop:30
  }
});
