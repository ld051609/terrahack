import React, { useEffect } from 'react'
import { useState } from 'react'

import { SafeAreaView, View, ScrollView, StyleSheet, Text } from 'react-native'

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

    },



  })
  const [data, setData] = useState("");
  const apiURL = "https://b7f2-141-117-116-145.ngrok-free.app"

  useEffect(() => {
    // Define an async function to fetch the string data
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch(apiURL)
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Get the text content
        const result = await response.text();
        // Update state with the fetched string
        setData(result);
      } catch (error) {
        // Handle errors
        setError(error.message);
      }
    };

    // Call the fetch function
    fetchData();
  }, []); // Empty dependency array ensur

  const results = [
    {
      id: 1,
      name: "chips",
      CO2e: "2",
      score: "8"
    },
    {
      id: 2,
      name: "donut",
      CO2e: "24",
      score: "1"
    },
  ]
  return (
    <SafeAreaView style = {styles.container}>
       <Text style = {styles.text}>
        Results 
      </Text>
      
      <ScrollView contentContainerStyle={styles.results}>
        <View style = {styles.results}>
          
          {results.map((result) => {
            return(
            <Text style={styles.subhead} key={result.key}>{result.name}</Text>
            )
          })}
        </View>

        
        
        {/* <Text style = {styles.subhead}>
          Detected Food:
          {data}
        </Text>
        <Text style = {styles.subhead}>
          CO2e:
        </Text>
        <Text style = {styles.subhead}>
          Your Meal Score:
        </Text> */}
      </ScrollView>
    </SafeAreaView>
  )
}

export default display
  
  
 