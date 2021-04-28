import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native'
import * as Config from '../Config'
import { CHANGE_BUTTON_STATUS } from '../store/actions/auth'

export default function HomeScreen(props)
{
    const { navigation } = props
    let { buttonStatus } = useSelector(state => state.main)
    const dispatch = useDispatch()

    const toggleButtonHandler = () => {
        dispatch({ type: CHANGE_BUTTON_STATUS })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Turn on the switch to start sendding greating SMS message to new customers.</Text>
            <View style={{ borderRadius: 75, overflow: 'hidden'}}>
                <TouchableNativeFeedback onPress={toggleButtonHandler}>
                    <View style={[styles.button, (buttonStatus ? {} : { backgroundColor: '#E91E63a5', borderColor: '#E91E63' })]}>
                    <Text style={styles.buttonText}>{buttonStatus ? 'On' : 'Off' }</Text>
                </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        paddingHorizontal: 15,
        textAlign: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#eee',
        fontSize: 35,
        fontFamily: 'Nunito-bold',
        fontWeight: 'bold',
    },
    button: {
        flex: 1,
        backgroundColor: '#8BC34Af0',
        maxWidth: 150,
        width: 150,
        maxHeight: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#8BC34A',
    }
})
