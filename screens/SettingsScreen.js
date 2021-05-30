import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Switch } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TOGGLE_INCOMING_CALLS, TOGGLE_OUTGOING_CALLS } from '../store/actions/auth'
import * as Config from '../Config'


export function SettingsScreen(props)
{
    const { incomingCalls, outgoingCalls } = useSelector(state => state.main.settings)
    const dispatch = useDispatch()

    const changeIncomingCallsHandler = () => {
        (async () => {
            await AsyncStorage.setItem('@incoming', (!incomingCalls).toString())
        })()
        dispatch({ type: TOGGLE_INCOMING_CALLS })
    }

    const changeOutgoingCallsHandler = () => {
        (async () => {
            await AsyncStorage.setItem('@outgoing', (!outgoingCalls).toString())
        })()
        dispatch({ type: TOGGLE_OUTGOING_CALLS })
    }

    return <View style={styles.container}>
        <SettingItem title='Detect Incoming Calls' desc='Send SMS messages to incoming calls only.'
            value={incomingCalls} onChange={changeIncomingCallsHandler} />
        <SettingItem title='Detect Outgoing Calls' desc='Send SMS messages to outgming calls only.'
            value={outgoingCalls} onChange={changeOutgoingCallsHandler} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

// Setting React Item

const SettingItem = (props) => {

    return <View style={itemStyles.container}>
        <View>
            <Text style={itemStyles.title}>{props.title}</Text>
            <Text style={itemStyles.desc}>{props.desc}</Text>
        </View>
        <View style={itemStyles.rightbox}>
            <Switch value={props.value} onChange={props.onChange} color={Config.COLORS.primary} />
        </View>
    </View>
}

const itemStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: '#CCC',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderColor: '#ddd',
        borderBottomWidth: 1,
        maxHeight: 75,
    },
    rightbox: {
        flex: 1,
    },
    title: {
        fontSize: 18,
    },
    desc: {
        fontSize: 13,
    },
})
