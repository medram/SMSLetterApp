import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { AUTH_LOGOUT } from '../store/actions/auth'



export default function LogoutScreen(props)
{
    const dispatch = useDispatch()
    useEffect(() => {
        // logging out
        // clearing user & token data
        dispatch({ type: AUTH_LOGOUT })
    }, [])


    return <View style={styles.container}>
        <Text>Logging out...</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
