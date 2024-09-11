import { useCallback, useRef } from 'react';
import {
  ImageURISource,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ListItem from '../../components/onboarding/listItem';
import PaginationElement from "../../components/onboarding/pagination"
import Button from "../../components/onboarding/button";
import { uiColors } from '@/constants/Colors';

const pages = [
    {
      text: 'Organize Your Daily Tasks',
      description: 'Effortlessly manage and prioritize your daily to-dos to stay on top of your work.',
      image: require('../../assets/images/daily-tasks.png'),
    },
    {
      text: 'Track Your Project Progress',
      description: 'Monitor tasks, deadlines, and milestones to ensure you’re on the right track.',
      image: require('../../assets/images/task.png'),
    },
    {
      text: 'Collaborate with Your Team',
      description: 'Assign tasks, share updates, and work together seamlessly on team projects.',
      image: require('../../assets/images/team-work.png'),
    },
  ];
  
export default function Index() {
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<
    Animated.FlatList<{
      text: string;
      image: ImageURISource;
    }>
  >();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      flatListIndex.value = viewableItems[0].index ?? 0;
    },
    []
  );
  const scrollHandle = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { text: string; image: ImageURISource; description:string };
      index: number;
    }) => {
      return <ListItem item={item} index={index} x={x} />;
    },
    [x]
  );
  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandle}
        horizontal
        scrollEventThrottle={16}
        pagingEnabled={true}
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        bounces={false}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={styles.bottomContainer}>
        <PaginationElement length={pages.length} x={x} />
        <Button
          currentIndex={flatListIndex}
          length={pages.length}
          flatListRef={flatListRef}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:uiColors.dark
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});