import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import Avatar from '../components/Avatar'
import { COLORS } from '../Config'
import { Ionicons, Feather, Entypo } from '@expo/vector-icons'


export default function ProfileScreen(props)
{
    const { navigation } = props
    const { user } = useSelector(state => state.auth)

    return <ScrollView>
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar source={user?.profile_image ? { uri: user.profile_image } : require('../assets/icon.png')} style={styles.avatar} />
                <View style={styles.headerDesc}>
                    <Text style={styles.textUsername}>{user?.first_name} {user?.last_name}</Text>
                    <Text style={styles.textDesc}>@{user?.username}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.listItem}>
                    <Entypo name='email' size={30} color={COLORS.secondary} />
                    <Text style={styles.listItemText}>{user?.email}</Text>
                </View>
                <View style={styles.listItem}>
                    <Ionicons name='call-outline' size={30} color={COLORS.secondary} />
                    <Text style={styles.listItemText}>{user?.phone}</Text>
                </View>
                <View style={styles.listItem}>
                    <Feather name='hash' size={30} color={COLORS.secondary} />
                    <Text style={styles.listItemText}>ID: {user?.id}</Text>
                </View>
                <View style={styles.listItem}>
                    <Ionicons name='time-outline' size={30} color={COLORS.secondary} />
                    <Text style={styles.listItemText}>{new Date(user?.date_joined).toLocaleDateString()}</Text>
                </View>
            </View>
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
        //flexDirection: 'row',
        height: 120,
        marginBottom: 120,
        padding: 10,
        paddingHorizontal: 15,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    avatar: {
        marginTop: 30,
        margin: 5,
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    headerDesc: {
        flex: 1,
        alignItems: 'center',
        //backgroundColor: COLORS.secondary,
    },
    textUsername: {
        fontSize: 20,
        color: COLORS.secondary,
        fontWeight: 'bold',
    },
    textDesc: {
        fontSize: 15,
        color: COLORS.secondary,
    },
    content: {
        padding: 20,
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        justifyContent: 'center',
        borderColor: COLORS.secondary+'55',
        padding: 15,
    },
    listItemText: {
        flex: 1,
        fontSize: 17,
        marginLeft: 20,
        paddingVertical: 5,
        justifyContent: 'center',
        //backgroundColor: '#ddd',
    }
})
