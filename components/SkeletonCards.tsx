import { StyleSheet, View } from 'react-native'
import React from 'react'
import { CARD_HEIGHT, CARD_WIDTH } from '../constants/Screen'
import { Skeleton } from 'moti/skeleton'

export const SingleCard = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.topRowContainer}>
        <Skeleton height={50} width={50} radius={10} />
        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'flex-start' }}>
          <Skeleton height={25} width={'100%'} />
          <Skeleton height={15} width={'100%'} />
        </View>
      </View>
      <View style={{ flex: 4 }}>
        <Skeleton height={'85%'} width={'100%'} radius={10} />
      </View>
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <Skeleton height={20} width={50} radius={10} />
        <Skeleton height={20} width={50} radius={10} />
      </View>
    </View>
  )
}

const SkeletonCards = () => {
  return (
    <View style={styles.skeletonsContainer}>
      <SingleCard />
      <SingleCard />
    </View>
  )
}

export default SkeletonCards

const styles = StyleSheet.create({
  skeletonsContainer: {
    flex: 1,
    gap: 20
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginVertical: 20,
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'black',
    gap: 15
  },
  topRowContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomRowContainer: {
    flexDirection: 'row',
    gap: 20,
  },
})