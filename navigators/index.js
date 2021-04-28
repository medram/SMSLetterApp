import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
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
import { useSelector } from 'react-redux'

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
                drawerIcon: (params) => renderIcon('home', params)
            }} />
        <Drawer.Screen name='Profile' component={ProfileScreen}
            options={{
                drawerIcon: (params) => renderIcon('person-outline', params)
            }} />
        <Drawer.Screen name='Logout' component={LogoutScreen}
            options={{
                drawerIcon: (params) => renderIcon('exit-outline', params)
            }} />
    </Drawer.Navigator>
}


// some stack navigators
/*
// used from routing screens
const Stack = createStackNavigator()

const screenOptions = {
    headerStyle: {
        backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
}

<Stack.Navigator initialRouteName='Home' screenOptions={screenOptions}>
    <Stack.Screen name='Home' component={HomeScreen} />
    <Stack.Screen name='MealsList' component={MealsListScreen} options={({ route }) => ({ title: route.params.title + ' list' })} />
    <Stack.Screen name='MealDetail' component={MealDetailScreen} />
</Stack.Navigator>
*/

export default function RootNavigator(props)
{
    const { isAuth } = useSelector(state => state.auth)

    return (
        <NavigationContainer>
            {isAuth ? <MenuNavigator /> : <LoginScreen />}
        </NavigationContainer>
    )
}
