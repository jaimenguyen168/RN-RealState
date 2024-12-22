import {ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import {Link, router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import {Card, FeaturedCard} from "@/components/Cards";
import Filters from "@/components/Filters";
import {useGlobalContext} from "@/lib/global-provider";
import {useAppWrite} from "@/lib/useAppWrite";
import {getLatestProperties, getProperties} from "@/lib/appwrite";
import {useEffect} from "react";
import filters from "@/components/Filters";
import {push} from "expo-router/build/global-state/routing";
import NoResult from "@/components/NoResult";

export default function Index() {
  const { user } = useGlobalContext()
  const params = useLocalSearchParams<{query?: string; filter?: string}>()

  const {
    data: latestProperties,
    loading: featuredLoading
  } = useAppWrite({ fn: getLatestProperties })

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
      limit: 6
    })
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
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />

                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Good Morning
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {user?.name}
                  </Text>
                </View>
              </View>

              <Image source={icons.bell} className="size-6"/>
            </View>

            <Search />

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Featured
                </Text>

                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {featuredLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !latestProperties || latestProperties.length == 0 ? (
                <NoResult />
              ) : (
                <FlatList
                  data={latestProperties}
                  keyExtractor={(item) => item.$id}
                  horizontal={true}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                  renderItem={({item}) =>
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  }
                />
              )}
            </View>

            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Our Recommendations
                </Text>

                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              <Filters />
            </View>
          </View>
        }
      />


    </SafeAreaView>
  );
}
