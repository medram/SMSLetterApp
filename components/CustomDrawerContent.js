import * as React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { useSelector } from 'react-redux'
//import { Ionicons } from '@expo/vector-icons'

import Avatar from './Avatar'
import { COLORS, APP_VERSION } from '../Config'


export default function CustomDrawerContent(props) {

    const { navigation } = props
    const { user } = useSelector(state => state.auth)

    return (
        <DrawerContentScrollView {...props} style={styles.container}>
            <ScrollView>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile')}>
                    <View style={styles.header}>
                        <Avatar source={user?.profile_image ? {uri: user.profile_image} : require('../assets/icon.png') } style={styles.avatar} />
                        <View style={styles.headerDesc}>
                            <Text style={styles.textUsername}>{user?.first_name} {user?.last_name}</Text>
                            <Text style={styles.textDesc}>@{user?.username}</Text>
                            <Text style={styles.textDesc}>{user?.email}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <DrawerItemList {...props} />
            </ScrollView>
            { APP_VERSION && <Text style={styles.footer}>Version: {APP_VERSION}</Text>}
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    header: {
        flex: 1,
        flexDirection: 'row',
        height: 120,
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    footer: {
        textAlign: 'center',
        color: COLORS.secondary,
        padding: 5,
    },
    avatar: {
        margin: 5,
    },
    headerDesc: {
        flex: 1,
        //backgroundColor: COLORS.secondary,
    },
    textUsername: {
        color: '#333',
        fontWeight: 'bold',
    },
    textDesc: {
        color: '#555',
    },
})
