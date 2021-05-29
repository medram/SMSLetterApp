import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ToastAndroid, PermissionsAndroid } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import ProfileScreen from '../screens/ProfileScreen'
import HomeScreen from '../screens/HomeScreen'
import LogoutScreen from '../screens/LogoutScreen'
import LoginScreen from '../screens/LoginScreen'
import CustomDrawerContent from '../components/CustomDrawerContent'
import { COLORS } from '../Config'
import * as Config from '../Config'
import { useDispatch, useSelector } from 'react-redux'
import { FIRST_START, SAVE_CONTACTS } from '../store/actions/auth'
import * as Contacts from 'expo-contacts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CallLogs from 'react-native-call-log'
import { SettingsScreen } from '../screens/SettingsScreen'


// Drawer navigator
const Drawer = createDrawerNavigator()

const iconStyle = {
    marginLeft: 15
}

function renderIcon(name, { focused, color, size })
{
    return <Ionicons name={name} size={size} color={color} style={iconStyle} />
}

export function MenuNavigator(props)
{
    return <Drawer.Navigator initialRouteName='Home'
        drawerContent={props => <CustomDrawerContent {...props} />}
        drawerContentOptions={{
                itemStyle: {
                    flex: 1,
                    marginHorizontal: 0,
                    borderRadius: 0,
                    //paddingHorizontal: 15,
                    //backgroundColor: '#CCC',
                },
                activeTintColor: COLORS.primary,
                contentContainerStyle: {
                    paddingTop: 25,
                    flex: 1,
                },
            }} >

        <Drawer.Screen name='Home' component={HomeScreen}
            options={{
                headerShown: true,
                drawerIcon: (params) => renderIcon('home', params)
            }} />
        <Drawer.Screen name='Profile' component={ProfileScreen}
            options={{
                drawerIcon: (params) => renderIcon('person-outline', params)
            }} />
        <Drawer.Screen name='Settings' component={SettingsScreen}
            options={{
                title: 'Settings',
                headerShown: true,
                drawerIcon: (params) => renderIcon('options-outline', params)
            }} />
        <Drawer.Screen name='Logout' component={LogoutScreen}
            options={{
                drawerIcon: (params) => renderIcon('exit-outline', params)
            }} />
    </Drawer.Navigator>
}


/*
// some stack navigators
// used from routing screens
const Stack = createStackNavigator()

const screenOptions = {
    headerStyle: {
        backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
}

export const StackNavigator = (props) => {

    return (
        <Stack.Navigator initialRouteName='Settings' screenOptions={screenOptions}>
            <Stack.Screen name='Settings' component={SettingsScreen} />
        </Stack.Navigator>
    )
}
*/

export default function RootNavigator(props)
{
    const { isAuth } = useSelector(state => state.auth)
    const { firstStart } = useSelector(state => state.main)
    const dispatch = useDispatch()

    const syncContactsForTheFirstTime = async () => {
        /*
        //const { status } = await Contacts.requestPermissionsAsync()
        const status = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALL_LOG)
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            if (Config.DEBUG)
            {
                console.log('syncContactsForTheFirstTime')
                ToastAndroid.show('syncContactsForTheFirstTime', ToastAndroid.SHORT)
            }

            //const { data } = await Contacts.getContactsAsync()
            const data = await CallLogs.loadAll()

            await AsyncStorage.setItem('@contacts', JSON.stringify(data))
            //dispatch({ type: SAVE_CONTACTS, payload: data })
            // to switch firstStart to false
            dispatch({ type: FIRST_START, payload: false })
        }
        */
        dispatch({ type: FIRST_START, payload: false })
    }

    useEffect(() => {
        (async () => {
            if (firstStart) {
                if (Config.DEBUG)
                {
                    console.log(`switching firstStart (${firstStart}) to false`)
                    ToastAndroid.show(`switching firstStart (${firstStart}) to false`, ToastAndroid.LONG)
                }

                await syncContactsForTheFirstTime()
            }
        })()
    }, [])


    return (
        <NavigationContainer>
            {isAuth ? <MenuNavigator /> : <LoginScreen />}
        </NavigationContainer>
    )
}
