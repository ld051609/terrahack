import React, { useEffect } from 'react'
import { useState } from 'react'

import { SafeAreaView, View, ScrollView, StyleSheet, Text } from 'react-native'
import { useRoute } from '@react-navigation/native';

function display() {
  const route = useRoute();
  const { description, emissionResults } = route.params;



  
  return (
    <SafeAreaView style = {styles.container}>
       <Text style = {styles.text}>
      </Text>
      
      <ScrollView contentContainerStyle={styles.results}>
        <View style = {styles.results}>
          <Text>Description: {description}</Text>
          <Text>Emission Results: {emissionResults}</Text>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#80AF81",
    flex: 1,
    justifyContent: "flex-start",
  },
  text: {
    color: "white",
    fontSize: "45px",
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20
  },
  subhead:{
    color: "white",
    marginLeft: 20,
    marginTop: 20,
    fontSize: "30px"

  },



})
export default display
  
  
 