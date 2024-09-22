
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { uiColors } from '@/constants/Colors';
import { sizes } from '@/constants/fonts&sizes';
import { TaskSquare } from 'iconsax-react-native';

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <TaskSquare size="32" color={uiColors.dark} />
          </View>
          <Text style={styles.headerText}>Task Details</Text>
        </View>
        
  <Text>
  hello
  </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: uiColors.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizes.marginSM,
  },
  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerText: {
    color: uiColors.white,
    fontSize: sizes.fontSize[4] * 2,
    fontWeight: '500',
  },
});

export default Index;
