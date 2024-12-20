import {Account, Avatars, Client, OAuthProvider} from "react-native-appwrite";
import * as Linking from "expo-linking"
import {openAuthSessionAsync} from "expo-web-browser";

// Set up AppWrite Config
export const config = {
  platform: 'com.jaime168.restate',
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID
}

export const client = new Client()

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform)

export const avatar = new Avatars(client)
export const account = new Account(client)

// Set up Actions

export async function login() {
  try {
    const redirectUri = Linking.createURL('/')
    const response = account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    )

    if (!response) throw new Error('Unable to login')

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    )

    if (browserResult.type !== 'success') throw new Error('Unable to login')

    const url = new URL(browserResult.url)
    const secret = url.searchParams.get('secret')?.toString()
    const userId = url.searchParams.get('userId')?.toString()

    if (!secret || !userId) throw new Error('Unable to login')

    const session = await account.createSession(userId, secret)

    if (!session) throw new Error('Unable to create a session')

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function logout() {
  try {
    await account.deleteSession('current')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getUser() {
  try {
    const response = await account.get()

    if (response.$id) {
      const userAvatar = avatar.getInitials(response.name)
      return {
        ...response,
        avatar: userAvatar.toString()
      }
    }

  } catch (error) {
    console.error(error)
    return false
  }
}














