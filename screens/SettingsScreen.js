import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Switch } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TOGGLE_CALL_TYPE } from '../store/actions/auth'
import * as Config from '../Config'


export function SettingsScreen(props)
{
    const { incoming, outgoing, answeredExternally,
        missed, voicemail, rejected, blocked } = useSelector(state => state.main.settings)
    const dispatch = useDispatch()


    const changeCallTypeHandler = (callType, currentValue) => {
        AsyncStorage.setItem(`@${callType}`, (!currentValue).toString())
        dispatch({ type: TOGGLE_CALL_TYPE, payload: { type: callType, value: !currentValue } })
    }

    return <ScrollView>
        <View style={styles.container}>

        <SettingItem title='Detect Incoming Calls' desc='Send SMS messages to incoming calls as well.'
            value={incoming} onChange={() => changeCallTypeHandler('incoming', incoming)} />
        <SettingItem title='Detect Outgoing Calls' desc='Send SMS messages to outgming calls as well.'
            value={outgoing} onChange={() => changeCallTypeHandler('outgoing', outgoing)} />
            <SettingItem title='Detect Answered Externally Calls' desc='Send SMS messages to Answered Externally calls as well, call which was answered on another device. Used in situations where a call rings on multiple devices simultaneously and it ended up being answered on a device other than the current one.'
            value={answeredExternally} onChange={() => changeCallTypeHandler('answeredExternally', answeredExternally)} />
        <SettingItem title='Detect Missed Calls' desc='Send SMS messages to Missed calls as well.'
            value={missed} onChange={() => changeCallTypeHandler('missed', missed)} />
        <SettingItem title='Detect Voicemail Calls' desc='Send SMS messages to Voicemail calls as well.'
            value={voicemail} onChange={() => changeCallTypeHandler('voicemail', voicemail)} />
            <SettingItem title='Detect Rejected Calls' desc='Send SMS messages to rejected calls by direct user action as well.'
            value={rejected} onChange={() => changeCallTypeHandler('rejected', rejected)} />
        <SettingItem title='Detect Blocked Calls' desc='Send SMS messages to Blocked calls as well.'
            value={blocked} onChange={() => changeCallTypeHandler('blocked', blocked)} />

        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

// Setting React Item

const SettingItem = (props) => {

    return <View style={itemStyles.container}>
        <View style={itemStyles.leftBox}>
            <Text style={itemStyles.title}>{props.title}</Text>
            <Text style={itemStyles.desc}>{props.desc}</Text>
        </View>
        <View style={itemStyles.rightBox}>
            <Switch value={props.value} onChange={props.onChange} color={Config.COLORS.primary} />
        </View>
    </View>
}

const itemStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderColor: '#ddd',
        borderBottomWidth: 1,
        minHeight: 75,
    },
    leftBox: {
        maxWidth: '85%',
    },
    rightBox: {
        flex: 1,
        //backgroundColor: '#CCC',
        paddingHorizontal: 5,
    },
    title: {
        fontSize: 18,
    },
    desc: {
        fontSize: 13,
    },
})
