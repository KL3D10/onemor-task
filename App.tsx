import 'react-native-reanimated'
import 'react-native-gesture-handler'

import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { FlatList, FlatListProps, SafeAreaView, StyleSheet, Text, View, ViewToken, ActivityIndicator } from 'react-native';
import { Config } from './config';
import IWorkoutData, { Datum } from './types/IWorkoutData';
import { SNAP_TO_INTERVAL, VISIBLE_OFFSET } from './constants/Screen';
import WorkoutCard from './components/WorkoutCard';
import SkeletonCards from './components/SkeletonCards';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { mapWorkouts } from './helpers/mapWorkoutsHelper';
import IMappedWorkoutData from './types/IMappedWorkoutData';


const App = () => {

  const [loading, setLoading] = useState<boolean>(false)
  const [workoutData, setWorkoutData] = useState<IMappedWorkoutData[] | null>(null);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string>(workoutData ? workoutData[0].id : '')
  const [page, setPage] = useState<number>(1)

  const imageCache = useRef<Map<string, string>>(new Map());
  const flatListRef = useRef<FlatList>(null);

  // Function to fetch the profile image and convert it to base64
  const fetchImage = async (url: string): Promise<string | null> => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${Config.BEARER_TOKEN}`,
        },
      });
      const blob = response.data;
      const reader = new FileReader();

      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob); // Convert blob to base64
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  // Function to fetch workout data from the API and map it to the required format with only the data required to display
  const fetchData = async (pageNr: number) => {
    setLoading(true)
    try {
      const response = await axios.get<IWorkoutData>(Config.ENDPOINT, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${Config.BEARER_TOKEN}`,
        },
        params: {
          page: pageNr,
        },
      });
      if (response.status === 200) {
        const mappedData: IMappedWorkoutData[] = mapWorkouts(response.data.data);
        for (const workout of mappedData) {
          if (!imageCache.current.has(workout.id)) {
            const imageData = await fetchImage(workout.user.profile_photo_url);
            if (imageData) {
              imageCache.current.set(workout.id, imageData); // Cache the image to prevent fetch on each render
            }
          }
        }
        setWorkoutData(prevData => (prevData ? [...prevData, ...mappedData] : [...mappedData]));
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page)
  }, [])

  // Function to load more data when the user scrolls to the end of the list
  const loadNewData = () => {
    if (page == 4) {
      return;
    }
    fetchData(page + 1)
    setPage(prevPage => prevPage + 1);
  }

  // Configuration for determining which workout should be active based on visibility 
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 50 },
      onViewableItemsChanged: ({ changed, viewableItems }: { viewableItems: ViewToken[], changed: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].isViewable) {
          setActiveWorkoutId(viewableItems[0].item.id)
        }
      }
    }
  ])

  const renderItem: FlatListProps<IMappedWorkoutData>['renderItem'] = ({ item }) => {
    const cachedImageData = imageCache.current.get(item.id) ?? null;
    return <WorkoutCard workoutData={item} activeWorkoutId={activeWorkoutId} cachedImageData={cachedImageData} />;
  };


  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.listContainer}>
          {(loading && page == 1) ? (
            <SafeAreaView>
              <SkeletonCards />
            </SafeAreaView>
          ) : (
            <FlatList
              ref={flatListRef}
              data={workoutData}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={renderItem}
              removeClippedSubviews
              maxToRenderPerBatch={2}
              windowSize={2}
              initialNumToRender={2}
              snapToInterval={SNAP_TO_INTERVAL}
              decelerationRate={0}
              bounces={false}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingVertical: VISIBLE_OFFSET }}
              viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
              onEndReached={loadNewData}
            />)}
          {loading &&
            <View style={{ position: 'absolute', bottom: 30 }}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          }
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#19181D'
  },
  listContainer: {
    width: "100%",
    height: '100%',
    justifyContent: "center",
    alignItems: "center"
  }
});
