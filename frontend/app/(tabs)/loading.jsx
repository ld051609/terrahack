import React from 'react'

import { StyleSheet, View, Image } from 'react-native';

const Loading = () => {

  return (
    <View style={styles.container}>
       <Image
            source={require('../../assets/images/diet.png')}
            style={styles.image}
          >
          </Image>
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#508D4E",
    alignItems: "center",
    justifyContent: "center",
  },
  image:{
    width: 200,
    height: 200,
    marginTop: 100
  }
});

export default Loading;
