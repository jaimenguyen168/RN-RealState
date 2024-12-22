import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import React, {useRef, useState} from 'react'
import {router, useLocalSearchParams} from "expo-router";
import {categories} from "@/constants/data";

const Filters = () => {

  const params = useLocalSearchParams<{filter?: string}>()
  const [selectedCategory, setSelectedCategory] = useState(params.filter || 'All');

  const handleCategory = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory('All')
      scrollToStart()
      router.setParams({filter: 'All'})
      return
    }

    setSelectedCategory(category)
    router.setParams({filter: category})
  }

  // scroll back to beginning
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollToStart = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3"
      ref={scrollViewRef}
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          key={item.category || index}
          className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${selectedCategory == item.category ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`}
          onPress={() => handleCategory(item.category)}
        >
          <Text className={`text-sm ${selectedCategory == item.category ? 'text-white font-rubik-bold mt-0.5' : 'text-black-300 font-rubik'}`}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}
export default Filters
