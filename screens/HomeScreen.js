import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, TouchableNativeFeedback, Button, PermissionsAndroid, ToastAndroid, Linking } from 'react-native'
import * as Config from '../Config'
import { FIRST_START, SAVE_CONTACTS, TOGGLE_BUTTON_STATUS } from '../store/actions/auth'
import * as Contacts from 'expo-contacts'
import * as TaskManager from 'expo-task-manager'
import * as BackgroundFetch from 'expo-background-fetch'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'



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
        const { data: newContactList } = await Contacts.getContactsAsync()
        const oldContactList = JSON.parse(await AsyncStorage.getItem('@contacts'))

        // filter new contacts
        const newContacts = await getNewContact(newContactList, oldContactList)
        console.log('Contacts: ', newContactList.length)
        console.log('New contacts: ', newContacts)
        if (newContacts.length) {
            newContacts.forEach(contact => {
                if (isValidToSendSMS(contact))
                {
                    sendSMS(contact).then((res) => {
                        console.log('STATUS CODE:', res.status)
                        if (res.status === 201) {
                            // save all contacts to storage to access it later from the app.
                            AsyncStorage.setItem('@contacts', JSON.stringify(oldContactList.concat(contact)))
                        }
                        else if (res.status === 400)
                        {
                            console.log('Error sending: ', contact)
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
                else
                {
                    AsyncStorage.setItem('@contacts', JSON.stringify(oldContactList.concat(contact)))
                }
            })
        }
        return (newContacts ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData)
    } catch (err) {
        console.log(err)
        return BackgroundFetch.Result.Failed
    }
})

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
    let phone = getPhoneNumber(contact)
    const data = {
        name: contact.name || contact.firstName,
        phone,
        send_sms: true
    }
    console.log('DATA: ', data)
    const token = await AsyncStorage.getItem('@token')
    return await axios.post(Config.URLS.contact, data, {
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

const getContactUsername = (contact) => {
    return contact.name || contact.firstName
}

const getPhoneNumber = (contact) => {
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
    const dispatch = useDispatch()


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
    const showContactsInStorageHandler = () => {
        AsyncStorage.getItem('@contacts').then((contacts) => {
            let storedContacts = JSON.parse(contacts)
            if (Config.DEBUG)
            {
                console.log('Contacts in Storage: ' + storedContacts.length)
                ToastAndroid.show('Contacts in Storage: ' + storedContacts.length, ToastAndroid.SHORT)
            }
        })
    }

    /*
    useEffect(() => {
        if (firstStart)
        {
            (async() => {
                await syncContactsForTheFirstTime()
            })()
        }
    }, [firstStart])
    */

    /*
    const syncContactsFromStorage = async () => {

        const storedContacts = JSON.parse(await AsyncStorage.getItem('@contacts'))
        if (storedContacts) {
            console.log('storedContacts: ', storedContacts.length)
            // run this if statement for the firsttime (firstStart)

            if (contactList.length < storedContacts.length){
                console.log('22222222222222222')
                // update the contactslist in state
                dispatch({ type: SAVE_CONTACTS, payload: storedContacts })
                //await AsyncStorage.setItem('@contacts', JSON.stringify(storedContacts))
                return storedContacts
            }
            return contactList
        }
        return []
    }
    */
    /*
    useEffect(() => {
        let interval = setInterval((function () {
            (async() => {
                console.log('interval checking')
                try {
                    await syncContactsFromStorage()
                    //const contacts = JSON.parse(await AsyncStorage.getItem('@contacts'))
                    //contactsInStorage(contacts)

                } catch (err){
                    console.log(err)
                }
            })()
        }).bind(this), 5000)

        return () => {
            console.log('interval cleared')
            clearInterval(interval)
        }
    }, [])
    /*
    /*
    useEffect(() => {
        // update contacts state.
        (async () => {
            await syncContactsFromStorage()
            // update contacts state.
            //dispatch({ type: SAVE_CONTACTS, payload: contactToWorkWith })
        })()
    }, [])
    */

    useEffect(() => {
        if (buttonStatus) {
            if (Config.DEBUG)
            {
                console.log('On')
            }

            /*
            Object {
                "contactType": "person",
                "firstName": "Maazouz",
                "id": "2844",
                "imageAvailable": false,
                "lastName": "3",
                "lookupKey": "904i79b910848cf5eed3",
                "name": "Maazouz 3",
                "phoneNumbers": Array [
                    Object {
                    "id": "6126",
                    "isPrimary": 0,
                    "label": "mobile",
                    "number": "+212624482224",
                    "type": "2",
                    },
                ],
            },
            */

            // asking for permissions
            Contacts.requestPermissionsAsync().then(({ status }) => {
                if (status === 'granted') {
                    // registring contacts task
                    BackgroundFetch.registerTaskAsync(CONTACTS_TASK, {
                        minimumInterval: 10, // 15 seconds
                        stopOnTerminate: false,
                        startOnBoot: true
                    }).then(() => {
                        // saving contacts to storage to make it accessable to the Task.
                        AsyncStorage.setItem('@token', token).then(() => {
                            ToastAndroid.show('Initialized successfully.', ToastAndroid.SHORT)
                            if (Config.DEBUG)
                            {
                                console.log('Task Registred')
                            }
                        })

                        // getting stored contacts and sync it with states

                        //syncContactsFromStorage().then(contactToWorkWith => {
                            // store valid contacts to let the Task work with.
                            /*
                            AsyncStorage.setItem('@contacts', JSON.stringify(contactToWorkWith))
                                .then(() => {
                                }).catch(err => console.log(err))
                            */
                        //})



                    }).catch(err => console.log(err))
                }
            }).catch(err => {
                ToastAndroid.show('Can\'t get phone contacts!, please enable Contacts Permission.', ToastAndroid.LANG)
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
                if (Config.DEBUG) { }
                console.log('Off')
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
            <Text style={styles.title}>Turn on the switch to start sendding greating SMS messages to new customers.</Text>
            <View style={{ borderRadius: 75, overflow: 'hidden'}}>
                <TouchableNativeFeedback onPress={toggleButtonHandler}>
                    <View style={[styles.button, (buttonStatus ? {} : { backgroundColor: '#E91E63a5', borderColor: '#E91E63' })]}>
                    <Text style={styles.buttonText}>{buttonStatus ? 'Enabled' : 'Disabled' }</Text>
                </View>
                </TouchableNativeFeedback>
            </View>
           {Config.DEBUG && <View>
                <Button title='Show Tasks' onPress={showTasksHandler} />
                <Button title={`Reset to FirstStart (${firstStart})`} onPress={firstStartHandler} />

                <Button title='Contacts in storage' onPress={showContactsInStorageHandler} />
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
