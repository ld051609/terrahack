import React from 'react'

import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native'

function display() {

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

    } 

  })
  return (
    <SafeAreaView style = {styles.container}>
       <Text style = {styles.text}>
        Results
      </Text>
      
      <ScrollView>
        <Text style = {styles.subhead}>
          Found Ingredients:
        </Text>
        <Text style = {styles.subhead}>
          CO2e:
        </Text>
        <Text style = {styles.subhead}>
          Your meals score:
        </Text>
      
      </ScrollView>
    </SafeAreaView>
  )
}

export default display
  
  
 