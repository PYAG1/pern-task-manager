import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import  {Text, View, TextInput, TouchableOpacity} from 'react-native'
import { uiColors } from '@/constants/Colors'
import { Formik, FormikHelpers, FormikValues } from 'formik'
import TextInputComponent from '@/components/core-ui/textinput'
import { useUserContext } from '@/context/context'

export default function Index() {
  const {userData}= useUserContext()
  return (
<SafeAreaView style={{flex:1,backgroundColor:uiColors.dark,paddingVertical:50, paddingHorizontal:20}}>
    <Text style={{fontSize:20, fontWeight:"bold", color:uiColors.white,marginBottom:20}}>Reset Password</Text>
 
    <Text style={{fontSize:16, color:uiColors.white,marginBottom:60}}>Enter your email address to reset your password</Text>
  
<Formik initialValues={{email:userData?.user?.email}} onSubmit={(values, formikHelpers) => {
    console.log(values)
    console.log(formikHelpers)
}}>
    {({handleChange, handleBlur, handleSubmit, values,errors,touched}) => (
        <View style={{width:"100%", marginVertical:10}}>
        <TextInputComponent values={values.email} label="Email Address" handleChange={handleChange} handleBlur={handleBlur} id="email" errors={errors} touched={touched}/>
        </View>
    )}
</Formik>
    <TouchableOpacity style={{width:"100%", height:50, backgroundColor:uiColors.white, borderRadius:10, justifyContent:"center", alignItems:"center", marginVertical:10}}>
        <Text style={{fontSize:16, fontWeight:"bold", color:uiColors.dark}}>Reset Password</Text>
    </TouchableOpacity>
</SafeAreaView>
  )
}
