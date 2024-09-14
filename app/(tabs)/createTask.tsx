import { uiColors } from '@/constants/Colors'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function createTask() {

  return (
<SafeAreaView style={{backgroundColor:uiColors.dark,flex:1}}>
    <Text>hi</Text>


</SafeAreaView>
  )
}
/*   <Text style={{ color: "white" }}>
                    {loading ? (  <ActivityIndicator animating={true} color={"white"} />) : "Submit"}
                  </Text>*/