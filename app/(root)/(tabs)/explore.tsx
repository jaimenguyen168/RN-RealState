import {View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity} from 'react-native'
import React, {useEffect} from 'react'
import {useGlobalContext} from "@/lib/global-provider";
import {router, useLocalSearchParams} from "expo-router";
import {useAppWrite} from "@/lib/useAppWrite";
import {getLatestProperties, getProperties} from "@/lib/appwrite";
import {SafeAreaView} from "react-native-safe-area-context";
import {Card, FeaturedCard} from "@/components/Cards";
import NoResult from "@/components/NoResult";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import Filters from "@/components/Filters";

const Explore = () => {
  const params = useLocalSearchParams<{query?: string; filter?: string}>()

  const {
    data: properties,
    loading,
    refetch
  } = useAppWrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6
    },
    skip: true
  })

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 20
    })
    console.log(params.query)
  }, [params.query, params.filter])

  const handleCardPress = (id: string) => router.push(`/properties/${id}`)

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={properties}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5" //style the cards
        renderItem={({item}) =>
          <Card
            item={item}
            onPress={() => handleCardPress(item.$id)}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5"/>
          ) : <NoResult />
        }
        ListHeaderComponent={
          <View className="px-5 gap-5">
            <View className="flex flex-row items-center justify-between">
              <TouchableOpacity
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
                onPress={() => router.back()}
              >
                <Image
                  source={icons.backArrow}
                  className="size-5"
                />
              </TouchableOpacity>

              <Text className="text-base text-center font-rubik-medium text-black-300 capitalize">
                Search for your ideal home
              </Text>

              <Image
                source={icons.bell}
                className="w-6 h-6"
              />
            </View>

            <Search />

            <View className="gap-5">
              <Filters />
              <Text className="text-xl font-rubik-bold text-black-300">
                Found {properties?.length} Properties.
              </Text>
            </View>
          </View>
        }
      />


    </SafeAreaView>
  );
}

export default Explore
