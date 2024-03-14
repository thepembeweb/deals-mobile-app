import { Feather } from '@expo/vector-icons'
import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from '@supabase/supabase-js'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Alert,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

import { removeItem } from '../../lib/storage'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../providers/AuthProvider'
import useLoadImages from '../hooks/useLoadImages'
import { type User } from '../types/supabase'
import { IMAGES_USERS_BUCKET, IS_FIRST_TIME_USER } from '../utils/constants'
const SECTIONS = [
  {
    header: '',
    icon: 'settings',
    items: [
      {
        icon: 'mail',
        color: '#007afe',
        label: 'Messages',
        value: false,
        type: 'link',
      },
      {
        icon: 'bell',
        color: '#fe9400',
        label: 'Notifications',
        value: false,
        type: 'link',
      },
      // {
      //   icon: 'navigation',
      //   color: '#32c759',
      //   label: 'Location',
      //   value: false,
      //   type: 'link',
      // },
    ],
  },
  {
    header: 'Dealer Account',
    icon: 'help-circle',
    items: [
      {
        icon: 'briefcase',
        color: '#007afe',
        label: 'Deals',
        value: false,
        type: 'link',
      },
      {
        icon: 'archive',
        color: '#fd2d54',
        label: 'Outlets',
        value: false,
        type: 'link',
      },
      {
        icon: 'plus',
        color: '#fe9400',
        label: 'Create Deal',
        value: false,
        type: 'link',
      },
      {
        icon: 'plus',
        color: '#fe9400',
        label: 'Create Outlet',
        value: false,
        type: 'link',
      },
    ],
  },
] as const

interface ProfileClientProps {
  title: string
  user: User
}

const ProfileClient: React.FC<ProfileClientProps> = ({ title, user }) => {
  const router = useRouter()
  const { signOut } = useAuth()
  const imageUrls = useLoadImages(
    IMAGES_USERS_BUCKET,
    (user.avatar_url && [user.avatar_url]) || []
  )

  const formattedSrc = user.avatar_url?.startsWith('http')
    ? user.avatar_url
    : imageUrls?.[0] ?? 'https://picsum.photos/200'

  // TODO: confirm delete account
  const deleteAccount = async (): Promise<void> => {
    const { error } = await supabase.functions.invoke('delete-user')

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json()
        console.log('Function returned an error', errorMessage)
      } else if (error instanceof FunctionsRelayError) {
        console.log('Relay error:', error.message)
      } else if (error instanceof FunctionsFetchError) {
        console.log('Fetch error:', error.message)
      } else {
        console.log('Unknown error:', error.message)
      }

      Alert.alert(error.message)
      return
    }

    await removeItem(IS_FIRST_TIME_USER)
    Alert.alert('Account removed successfully!')
    router.push('/login')
  }

  return (
    <View className='mx-4 space-y-3 mb-16'>
      <Animated.View
        entering={FadeInDown.duration(700).springify().damping(12)}
        className='space-y-1'
      >
        <Text
          style={{ fontSize: hp(3) }}
          className='font-semibold text-neutral-600'
        >
          {title}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(700).springify().damping(12)}
        className='flex-col'
      >
        <View className='flex-col items-center justify-center'>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/profile/edit-profile',
                params: { avatarUrl: formattedSrc },
              })
            }}
          >
            <View style={styles.profileAvatarWrapper}>
              <Image
                alt=''
                source={{
                  uri: formattedSrc,
                }}
                style={styles.profileAvatar}
              />

              <View style={styles.profileAction}>
                <Feather color='#fff' name='edit-3' size={15} />
              </View>
            </View>
          </TouchableOpacity>

          <View
            className='flex-col items-center justify-center'
            style={styles.profileBody}
          >
            <Text style={styles.profileName}>{user.full_name ?? ''}</Text>

            <Text style={styles.profileAddress}>
              {user.email ?? '[EMAIL NOT SET]'}
            </Text>

            <Text style={styles.profileMobileNr}>
              {user.mobile_number ?? '[MOBILE NUMBER NOT SET]'}
            </Text>
          </View>
        </View>

        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <Text style={styles.sectionHeader}>{header}</Text>
            {items.map(({ label, icon, type, value, color }, index) => {
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => {
                    // handle onPress

                    if (type === 'link') {
                      if (label === 'Messages') router.push('/profile/messages')
                      if (label === 'Notifications')
                        router.push('/profile/notifications')
                      if (label === 'Deals')
                        router.push('/profile/manage-deals')
                      if (label === 'Outlets')
                        router.push('/profile/manage-outlets')
                      if (label === 'Create Deal')
                        router.push('/profile/create-deal')
                      if (label === 'Create Outlet')
                        router.push('/profile/create-outlet')
                    }
                  }}
                >
                  <View style={styles.row} className='bg-gray-200'>
                    <View style={[styles.rowIcon, { backgroundColor: color }]}>
                      <Feather color='#fff' name={icon} size={18} />
                    </View>

                    <Text style={styles.rowLabel}>{label}</Text>

                    <View style={styles.rowSpacer} />

                    {type === 'boolean' && <Switch value={value} />}

                    {type === 'link' && (
                      <Feather color='#0c0c0c' name='chevron-right' size={22} />
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        ))}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(700).springify().damping(12)}
        className='space-y-4'
      >
        <View>
          <TouchableOpacity
            onPress={signOut}
            className='width-full bg-red-500 rounded-full py-3 mt-4'
          >
            <Text
              style={{ fontSize: hp(1.8) }}
              className='font-semibold text-white text-center'
            >
              Logout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              void deleteAccount()
            }}
            className='width-full bg-red-500 rounded-full py-3 mt-4'
          >
            <Text
              style={{ fontSize: hp(1.8) }}
              className='font-semibold text-white text-center'
            >
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

export default ProfileClient

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  section: {
    paddingHorizontal: 0,
  },
  sectionHeader: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  profile: {
    padding: 24,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAction: {
    position: 'absolute',
    right: -4,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: '#007bff',
  },
  profileBody: {
    marginTop: 20,
  },
  profileName: {
    marginTop: 20,
    // fontSize: 19,
    fontSize: hp(2.2),
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    // fontSize: 16,
    fontSize: hp(1.7),
    color: '#989898',
    textAlign: 'center',
  },
  profileMobileNr: {
    marginTop: 5,
    // fontSize: 16,
    fontSize: hp(1.7),
    color: '#989898',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    // backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
})
