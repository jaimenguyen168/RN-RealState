import {View, Text, ScrollView, Image, TouchableOpacity, Alert} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import icons from "@/constants/icons";
import images from "@/constants/images";
import {settings} from "@/constants/data";
import {useGlobalContext} from "@/lib/global-provider";
import {logout} from "@/lib/appwrite";
import seed from "@/lib/seed";

const Profile = () => {

  const { user, refetch } = useGlobalContext()
  const handleLogout = async () => {
    const result = await logout();

    if (result) {
      Alert.alert("Success", "You have been logged out successfully!");
      await refetch()
    } else {
      Alert.alert("Error", "Failed to logout")
    }
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">
            Profile
          </Text>

          <Image
            source={icons.bell}
            className="size-5"
          />
        </View>

        <View className="flex-row justify-center flex mt-5">
          <View className="flex-col flex items-center">
            <View className="flex flex-col items-center relative mt-5">
              <Image
                source={{ uri: user?.avatar }}
                className="size-44 relative rounded-full"
              />

              <TouchableOpacity className="absolute bottom-1 right-1">
                <View className="bg-white p-1 rounded-xl">
                  <Image
                    source={icons.edit}
                    className="size-8"
                  />
                </View>
              </TouchableOpacity>
            </View>

            <Text className="text-2xl font-rubik-bold mt-2 text-center">
              {user?.name}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="My Bookings" />
          <SettingsItem icon={icons.wallet} title="Payments" />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem icon={item.icon} title={item.title} key={`settings-item-${index}`}/>
          ))}
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            showArrow={false}
            textStyle="text-danger"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile



const SettingsItem = (
  {icon, title, onPress, textStyle, showArrow = true}
    : {icon: any, title: string, onPress?: () => void, textStyle?: string, showArrow?: boolean}
) => (
  <TouchableOpacity
    className="flex flex-row items-center justify-between py-3"
    onPress={onPress}
    disabled={!onPress}
  >
    <View className="flex flex-row items-center gap-3">
      <Image
        source={icon}
        className="size-6"
      />
      <Text className={`${textStyle} text-lg font-rubik-medium text-black-300`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5"/>}
  </TouchableOpacity>
)
