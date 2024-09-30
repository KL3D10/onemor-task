import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { memo, useEffect, useRef, useState } from 'react'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { CARD_HEIGHT, CARD_WIDTH } from '../constants/Screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    BounceIn
} from 'react-native-reanimated';
import { difficultyIconDecider, difficultyLabelDecider } from '../helpers/difficultyHelper';
import { Skeleton } from 'moti/skeleton';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import IMappedWorkoutData from '../types/IMappedWorkoutData';
import * as Haptics from 'expo-haptics';


interface Props {
    workoutData: IMappedWorkoutData
    activeWorkoutId: string
    cachedImageData: string | null;
}

const WorkoutCard = ({ workoutData, activeWorkoutId, cachedImageData }: Props) => {

    const video = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus>();
    const [routineIndex, setRoutineIndex] = useState<number>(0)
    const progress = useSharedValue(0);

    // Animated styles for the progress bar
    const indicatorAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    // Helper function to move to the previous routine
    const goToPrevRoutine = () => {
        setRoutineIndex((index) => {
            if (index === 0) {
                return index;
            }
            return index - 1;
        });
        Haptics.selectionAsync()
    };

    // Helper function to move to the next routine
    const goToNextRoutine = () => {
        setRoutineIndex((index) => {
            if (index === workoutData.routines.length - 1) {
                return index;

            }
            return index + 1;
        });
        Haptics.selectionAsync()
    };

    // Function to start the progress bar animation
    const startProgresBar = () => {
        if (!video.current || activeWorkoutId !== workoutData.id) { return; }

        progress.value = 0;
        progress.value = withTiming(1, {
            duration: workoutData.routines[routineIndex]?.video.duration,
            easing: Easing.linear,
        });
    }

    const swipes = Gesture.Simultaneous(
        Gesture.Fling().direction(Directions.LEFT).onEnd(goToNextRoutine),
        Gesture.Fling().direction(Directions.RIGHT).onEnd(goToPrevRoutine)
    )

    // Handle active workout changes
    useEffect(() => {
        if (!video.current) { return; }
        if (activeWorkoutId != workoutData.id) {
            video.current?.pauseAsync()
            progress.value = 0;
        }
        if (activeWorkoutId == workoutData.id) {
            video.current?.playAsync()
            if (status?.isLoaded) {
                startProgresBar()
            }
        }
    }, [activeWorkoutId])

    // Handle routine index changes
    useEffect(() => {
        if (status?.isLoaded) {
            startProgresBar()
        }
    }, [routineIndex]);


    return (
        <GestureDetector gesture={swipes}>
            <Animated.View style={styles.cardContainer} entering={BounceIn} >
                <View style={styles.videoWraper}>
                    <Video
                        ref={video}
                        style={[StyleSheet.absoluteFill, {
                            borderRadius: 10,
                        }]}
                        source={{ uri: workoutData.routines[routineIndex]?.video.playlist_url ?? '' }}
                        resizeMode={ResizeMode.COVER}
                        isMuted={true}
                        useNativeControls={false}
                        shouldPlay={false}
                        onPlaybackStatusUpdate={setStatus}
                    />
                    <Pressable style={styles.navPressable} onPress={() => goToPrevRoutine()} />

                    <Pressable
                        style={[styles.navPressable, { right: 0 }]}
                        onPress={() => goToNextRoutine()}
                    />
                    <View style={styles.header}>
                        <LinearGradient
                            colors={['rgba(0,0,0,0.7)', 'transparent']}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.indicatorRow}>
                            {workoutData.routines.map((routine, index) => (
                                <View key={`${routine.id}-${index}`} style={styles.indicatorsBackground}>
                                    <Animated.View
                                        style={[
                                            styles.indicator,
                                            index === routineIndex && indicatorAnimatedStyle,
                                            index > routineIndex && { width: 0 },
                                            index < routineIndex && { width: '100%' },
                                        ]}
                                    />
                                </View>
                            ))}
                        </View>
                        <View style={styles.topRowContainer}>
                            <Skeleton show={!status?.isLoaded && routineIndex == 0} height={50} width={50} radius={10} colorMode='light'>
                                <Image source={cachedImageData ? { uri: cachedImageData } : { uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }} style={styles.profileImage} resizeMode='cover' />
                            </Skeleton>
                            <View style={styles.topRowTextContainer}>
                                <Skeleton show={!status?.isLoaded && routineIndex == 0} height={33} width={'100%'} colorMode='light'>
                                    <Text style={styles.headerText}>{workoutData.name.toUpperCase()}</Text>
                                </Skeleton>
                                <Skeleton show={!status?.isLoaded && routineIndex == 0} height={15} width={'100%'} colorMode='light'>
                                    <Text style={styles.secondaryText}>{workoutData.routines[routineIndex]?.name}</Text>
                                </Skeleton>
                            </View>
                        </View>
                    </View>
                    <View style={styles.bottomRowContainer}>
                        <Skeleton show={!status?.isLoaded && routineIndex == 0} height={20} width={70} colorMode='light'>
                            <View style={styles.iconLabelPair}>
                                <Ionicons name="time-outline" size={18} color="white" />
                                <Text style={[styles.secondaryText, { color: 'white' }]}>23:440</Text>
                            </View>
                        </Skeleton>
                        <Skeleton show={!status?.isLoaded && routineIndex == 0} height={20} width={110} colorMode='light'>
                            <View style={styles.iconLabelPair}>
                                <MaterialCommunityIcons name={difficultyIconDecider(workoutData.difficulty)} size={18} color="white" />
                                <Text style={[styles.secondaryText, { color: 'white' }]}>{difficultyLabelDecider(workoutData.difficulty)}</Text>
                            </View>
                        </Skeleton>
                    </View>
                </View>
            </Animated.View>
        </GestureDetector>
    )
}

export default memo(WorkoutCard)

const styles = StyleSheet.create({
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginVertical: 20,
    },
    videoWraper: {
        height: "100%",
        overflow: "hidden",
        justifyContent: 'space-between',
        borderRadius: 10,
        paddingBottom: 20,
    },
    navPressable: {
        position: 'absolute',
        width: '30%',
        height: '100%',
    },
    header: {
        width: '100%',
        padding: 10,
        paddingTop: 10,
    },
    indicatorRow: {
        gap: 5,
        flexDirection: 'row',
        marginBottom: 10,
    },
    indicatorsBackground: {
        flex: 1,
        height: 3,
        backgroundColor: 'gray',
        borderRadius: 10,
        overflow: 'hidden',
    },
    indicator: {
        backgroundColor: 'white',
        height: '100%',
    },
    topRowContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 10,
        paddingHorizontal: 8
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    topRowTextContainer: {
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        flex: 1
    },
    headerText: {
        fontSize: 14,
        color: 'white',
        fontWeight: '800',
    },
    secondaryText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D9D9D9'
    },
    bottomRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        paddingHorizontal: 8,
    },
    iconLabelPair: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
})