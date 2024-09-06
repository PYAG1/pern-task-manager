import DatePickerComponent from '@/components/core-ui/datepicker'
import TextAreaComponent from '@/components/core-ui/textArea'
import TextInputComponent from '@/components/core-ui/textinput'
import { uiColors } from '@/constants/Colors'
import { sizes } from '@/constants/fonts&sizes'
import { router } from 'expo-router'
import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
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