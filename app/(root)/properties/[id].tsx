import {View, Text, ScrollView, Dimensions, Image} from 'react-native'
import React from 'react'
import {useLocalSearchParams} from "expo-router";
import images from "@/constants/images";
import {useAppWrite} from "@/lib/useAppWrite";
import {getPropertyById} from "@/lib/appwrite";

const Property = () => {
  const { id } =  useLocalSearchParams<{ id?: string}>()
  const halfWindowHeight = Dimensions.get("window").height / 2

  const { data: property } = useAppWrite({
    fn: getPropertyById,
    params: { id: id! }
  })

  return (
    <View>
      <ScrollView
        contentContainerClassName="pb-32 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative w-full" style={{ height: halfWindowHeight }}>
          <Image
            source={{ uri: property?.image }}
            className="size-full"
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </View>
  )
}
  export default Property
