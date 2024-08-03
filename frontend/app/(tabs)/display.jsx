import React from 'react'

import { SafeAreaView, StyleSheet, Text, SafeAreaView } from 'react-native'

function display() {

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#508D4E",
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    text: {
      color: "white"
    }

  })
  return (
    <SafeAreaView style = {styles.container}>
      <Text style = {styles.text}>this is where you can see the results</Text>

    </SafeAreaView>
  )
}

export default display
  
  
 