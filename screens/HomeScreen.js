import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, TouchableNativeFeedback, Button, PermissionsAndroid, ToastAndroid, Linking } from 'react-native'
import * as Config from '../Config'
import { FIRST_START, SAVE_CONTACTS, TOGGLE_BUTTON_STATUS } from '../store/actions/auth'
import * as TaskManager from 'expo-task-manager'
import * as BackgroundFetch from 'expo-background-fetch'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import CallLogs from 'react-native-call-log'


const CONTACTS_TASK = 'CONTACTS_TASK'

// my task
TaskManager.defineTask(CONTACTS_TASK, async () => {
    // do your background task here.
    if (Config.DEBUG)
    {
        console.log('RUN...')
        ToastAndroid.show('RUN...', ToastAndroid.LONG)
    }

    try {
        let minTimestamp = await AsyncStorage.getItem('@minTimestamp')
        let newContactList = await CallLogs.load(-1, { minTimestamp: minTimestamp })
        console.log(newContactList)
        //const newContactList = await CallLogs.loadAll()
        newContactList = await filterCalls(newContactList)

        // filter new contacts
        //const newContacts = await getNewCallLog(newContactList, oldContactList)
        const newContacts = newContactList
        console.log('Contacts: ', newContactList.length)
        console.log('New contacts: ', newContacts)
        if (newContacts.length) {
            newContacts.forEach(async (contact) => {
                try {
                    const res = await sendSMS(contact)

                    console.log('STATUS CODE:', res.status)
                    if (res.status === 201 || res.status === 200) {
                        // updating the minimum timestamp.
                        await AsyncStorage.setItem('@minTimestamp', new Date().getTime().toString())
                    }
                    else if (res.status === 400)
                    {
                        console.log('Error sending SMS')
                    }
                } catch (err) {
                    console.log('Error sending SMS:', err)
                }
            })
        }

        return (newContacts ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData)
    } catch (err) {
        console.log(err)
        return BackgroundFetch.Result.Failed
    }
})


const filterCalls = async(callLogsList) => {
    // filtring call logs
    /*
    INCOMING_TYPE
    OUTGOING_TYPE
    MISSED_TYPE
    VOICEMAIL_TYPE
    REJECTED_TYPE
    BLOCKED_TYPE
    ANSWERED_EXTERNALLY_TYPE
    */

    const incoming = await getCallSetting('incoming')
    const outgoing = await getCallSetting('outgoing')
    const missed = await getCallSetting('missed')
    const voicemail = await getCallSetting('voicemail')
    const rejected = await getCallSetting('rejected')
    const blocked = await getCallSetting('blocked')
    const answeredExternally = await getCallSetting('answeredExternally')

    let filteredCalls = []

    if (incoming) {
        filteredCalls = filteredCalls.concat(callLogsList.filter(callLog => callLog.type === 'INCOMING'))
    }
    if (outgoing) {
        filteredCalls = filteredCalls.concat(callLogsList.filter(callLog => callLog.type === 'OUTGOING'))
    }
    if (missed) {
        filteredCalls = filteredCalls.concat(callLogsList.filter(callLog => callLog.type === 'MISSED'))
    }
    if (voicemail) {
        filteredCalls = filteredCalls.concat(callLogsList.filter(callLog => callLog.type === 'VOICEMAIL'))
    }
    if (rejected) {
        filteredCalls = filteredCalls.concat(callLogsList.filter(callLog => callLog.type === 'REJECTED'))
    }
    if (blocked) {
        filteredCalls = filteredCalls.concat(callLogsList.filter(callLog => callLog.type === 'BLOCKED'))
    }
    if (answeredExternally) {
        filteredCalls = filteredCalls.concat(callLogsList.filter(callLog => (callLog.type === 'ANSWERED_EXTERNALLY' || callLog.type === 'ANSWEREDEXTERNALLY')))
    }

    return filteredCalls
}


const getNewContact = async (newContactList, oldContactList) => {
    try {
        let newContacts = newContactList.filter(newContact => {
            // return true if the contact is not in old contactList
            return oldContactList.find(oldContact => oldContact.id === newContact.id) ? false : true
        })

        return newContacts
    } catch (err) {
        console.log(err)
        return []
    }
}

const sendSMS = async (contact) => {
    let phone = getPhoneNumberFromCallLog(contact)
    const data = {
        name: getContactUsername(contact),
        phone,
        send_sms: true
    }
    console.log('DATA: ', data)
    const token = await AsyncStorage.getItem('@token')
    return await axios.post(await Config.URLS.contact(), data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    })
}

const isValidToSendSMS = (contact) =>
{
    const username = getContactUsername(contact)
    if (username.toUpperCase().indexOf('C-') === 0)
        return true

    return false
}

const getCallSetting = async (name) => {
    return (await AsyncStorage.getItem(`@${name}`)).toLocaleLowerCase() === 'true'
}

const getContactUsername = (contact) => {
    //return contact.name || contact.firstName
    return contact.name ? contact.name : ''
}

const getPhoneNumberFromCallLog = (contact) => {
    let phone = contact.phoneNumber
    return numberCleanup(phone)
}

const getPhoneNumberFromContact = (contact) => {
    let phone = ""

    if (contact.phoneNumbers.length === 1)
    {
        phone = contact.phoneNumbers[0].number
    }
    else if (contact.phoneNumbers.length === 2)
    {
        phone = contact.phoneNumbers[0].number ? contact.phoneNumbers[0].number : contact.phoneNumbers[1].number
    }
    return numberCleanup(phone)
}

const numberCleanup = (phone) => {
    return phone.replace(/[\(\)-\s]+/g, '').replace(/^(212|\+212)/g, '0')
}


export default function HomeScreen(props)
{
    const { navigation } = props
    const { buttonStatus, firstStart } = useSelector(state => state.main)
    const { token } = useSelector(state => state.auth)
    const { incoming, outgoing, answeredExternally,
        missed, voicemail, rejected, blocked } = useSelector(state => state.main.settings)
    const dispatch = useDispatch()

    /*
    Config.URLS.contact().then(data => {
        console.log(data)
    }).catch(err => {

    })
    */


    const toggleButtonHandler = () => {
        dispatch({ type: TOGGLE_BUTTON_STATUS })
    }

    const showTasksHandler = () => {
        //ToastAndroid.show('initial contacts:' + contactList.length, ToastAndroid.LONG)

        TaskManager.getRegisteredTasksAsync().then(tasks => {
            tasks.map(task => console.log(task.taskName))
        }).catch(err => console.log(err))
    }

    const firstStartHandler = () => {
        dispatch({ type: FIRST_START, payload: true })
        dispatch({ type: SAVE_CONTACTS, payload: [] })
        if (buttonStatus)
        {
            dispatch({ type: TOGGLE_BUTTON_STATUS, payload: false })
        }
        // clean up
        AsyncStorage.setItem('@contacts', '[]').catch((err) => {
            console.log(err)
        })
    }
    const showStatusInStorage = () => {
        (async () => {
            let minTimestamp = await AsyncStorage.getItem('@minTimestamp')
            let newContactList = await CallLogs.load(-1, { minTimestamp: minTimestamp })
            console.log('Detected Calls: ', newContactList.length)
            console.log(newContactList)
            //const newContactList = await CallLogs.loadAll()
            newContactList = await filterCalls(newContactList)
            console.log('Filtered Calls: ', newContactList.length)
            console.log(newContactList)

            const incoming = await getCallSetting('incoming')
            const outgoing = await getCallSetting('outgoing')
            const missed = await getCallSetting('missed')
            const voicemail = await getCallSetting('voicemail')
            const rejected = await getCallSetting('rejected')
            const blocked = await getCallSetting('blocked')
            const answeredExternally = await getCallSetting('answeredExternally')

            if (Config.DEBUG)
            {
                console.log(`\nincoming:${incoming}, \noutgoing:${outgoing}, \nmissed:${missed}, \nvoicemail:${voicemail}, \nrejected:${rejected}, \nblocked:${blocked}, \nansweredExternally:${answeredExternally}`)
                //ToastAndroid.show(`Incoming:${incoming}, Outgoing:${outgoing}`, ToastAndroid.SHORT)
            }
        })()
    }


    useEffect(() => {
        AsyncStorage.setItem('@incoming', incoming.toString())
        AsyncStorage.setItem('@outgoing', outgoing.toString())
        AsyncStorage.setItem('@answeredExternally', answeredExternally.toString())
        AsyncStorage.setItem('@missed', missed.toString())
        AsyncStorage.setItem('@voicemail', voicemail.toString())
        AsyncStorage.setItem('@rejected', rejected.toString())
        AsyncStorage.setItem('@blocked', blocked.toString())
    }, [buttonStatus])

    useEffect(() => {
        if (buttonStatus) {
            if (Config.DEBUG)
            {
                console.log('On')
            }

            // asking for permissions
            //Contacts.requestPermissionsAsync().then(({ status }) => {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALL_LOG).then((status) => {

                if (status === PermissionsAndroid.RESULTS.GRANTED) {
                    // registring contacts task
                    BackgroundFetch.registerTaskAsync(CONTACTS_TASK, {
                        minimumInterval: 15, // 15 seconds
                        stopOnTerminate: false,
                        startOnBoot: true
                    }).then(() => {
                        // saving contacts to storage to make it accessable to the Task.
                        AsyncStorage.setItem('@token', token).then(() => {
                            AsyncStorage.setItem('@minTimestamp', new Date().getTime().toString()).then(() => {
                                ToastAndroid.show('Initialized successfully.', ToastAndroid.SHORT)
                                if (Config.DEBUG)
                                {
                                    console.log('Task Registred')
                                }
                            })
                        })
                    }).catch(err => console.log(err))
                }
                else
                {
                    ToastAndroid.show('Can\'t access phone call log!, please enable this permission.', ToastAndroid.LANG)
                }
            }).catch(err => {
                ToastAndroid.show('Can\'t access phone call log!, please enable this permission.', ToastAndroid.LANG)
                if (Config.DEBUG)
                {
                    console.log(err)
                }
                dispatch({ type: TOGGLE_BUTTON_STATUS, payload: false })
            })
        }
        else {
            // TaskManager.unregisterAllTasksAsync()
            BackgroundFetch.unregisterTaskAsync(CONTACTS_TASK).then(() => {
                if (Config.DEBUG) {
                    console.log('Off')
                }
                ToastAndroid.show('Disabled', ToastAndroid.SHORT)
            }).catch((err) => {
                if (Config.DEBUG)
                {
                    console.log('Error occured during closing task.')
                }
            })
        }

    }, [buttonStatus])

    /*
    <Button title='test me' onPress={() => {
        Linking.openURL('tel:5555555555555', err => console.error(err))
    }} />
    <Button title='Read Call Logs' onPress={readCallLogsHandler} />
    <Button title='Get Permission' onPress={requestPermissionHandler} />
    */

   return (
       <View style={styles.container}>
            <View style={{ borderRadius: 75, overflow: 'hidden'}}>
                <TouchableNativeFeedback onPress={toggleButtonHandler}>
                    <View style={[styles.button, (buttonStatus ? {} : { backgroundColor: '#E91E63a5', borderColor: '#E91E63' })]}>
                    <Text style={styles.buttonText}>{buttonStatus ? 'Enabled' : 'Disabled' }</Text>
                </View>
                </TouchableNativeFeedback>
            </View>
            <Text style={styles.title}>Turn on the switch to start sendding SMS messages to new customers.</Text>
           {Config.DEBUG && <View>
                <Button title='Show Tasks' onPress={showTasksHandler} />
                <Button title={`Reset to FirstStart (${firstStart})`} onPress={firstStartHandler} />

                <Button title='Show Filtered Call Logs' onPress={showStatusInStorage} />
            </View>}
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
        fontSize: 30,
        fontFamily: 'Nunito-bold',
        //fontWeight: 'bold',
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
