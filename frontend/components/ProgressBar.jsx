import { View, Text } from 'react-native'
import React from 'react'
import ProgressBar from 'react-native-progress/Bar';

const ProgressBarTracker = ({progress}) => {
  return (
    <View style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
      <ProgressBar progress={progress} width={200} height={20} borderColor={'white'}/>
    </View>
  )
}

export default ProgressBarTracker