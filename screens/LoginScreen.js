import * as React from 'react'
import { View, Text, StyleSheet, useColorScheme, ToastAndroid } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as Config from '../Config'
import { COLORS } from '../Config'
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { AUTH_LOGIN } from '../store/actions/auth'
import axios from 'axios'


export default function LoginScreen(props)
{
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [ message, setMessage ] = React.useState('')
    const [buttonText, setButtonText ] = React.useState('Sign in')

    const dispatch = useDispatch()


    const changeEmailHandler = (value) => {
        setEmail(value)
    }

    const changePasswordHandler = (value) => {
        setPassword(value)
    }

    const submitHandler = () => {
        // checking my server.
        setButtonText('Signing in...')
        setMessage('')

        axios.post(Config.URLS.auth, {
            username: email,
            password: password
        }).then(res => {
            //console.log(res)
            if (res.status === 200)
            {
                const token = res.data.token
                // getting profile info.
                axios.get(Config.URLS.profile, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }).then(res => {
                    if (res.status === 200)
                    {
                        const user = res.data
                        // save token & user and set isAuth to true
                        dispatch({ type: AUTH_LOGIN, payload: {user: user, token: token} })
                        ToastAndroid.show('Siggned in successfully.', ToastAndroid.SHORT)
                    }
                }).catch(err => {
                    console.log(err)
                    setMessage('Oops!, Something went wrong, please try later!')
                    setButtonText('Sign in')
                })
            }
        }).catch(err => {
            console.log(err)
            setMessage('Email or Password is incorrect, please try again!')
            setButtonText('Sign in')
        })
    }

    return <View style={styles.container}>
        <View style={styles.card}>
            <Text style={styles.title}>{Config.APP_NAME}</Text>
            {!!message && <Text style={styles.message}>{message}</Text>}
            <Input placeholder='Email'
                leftIcon={<Ionicons name='ios-at-outline' size={30} color='#fff' />}
                inputContainerStyle={styles.inputContainer}
                style={styles.input}
                placeholderTextColor={COLORS.secondary}
                onChangeText={changeEmailHandler}
                keyboardType='email-address'
                autoCapitalize='none'
                />

            <Input placeholder='Password'
                leftIcon={<FontAwesome name='lock' size={30} color='#fff' />}
                inputContainerStyle={styles.inputContainer}
                style={styles.input}
                placeholderTextColor={COLORS.secondary}
                secureTextEntry={true} onChangeText={changePasswordHandler}
                autoCapitalize='none'
                />

            <Button title={buttonText} buttonStyle={styles.buttonStyle} onPress={submitHandler} disabled={buttonText !== 'Sign in' ? true : false } />
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: COLORS.primary,
    },
    input: {
        color: '#fff',
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: Config.COLORS.secondary,
        color: Config.COLORS.secondary,
        backgroundColor: Config.COLORS.secondary+'a1',
        borderRadius: 100,
        paddingHorizontal: 10,
    },
    title: {
        color: COLORS.primary,
        fontFamily: 'Nunito-bold',
        fontSize: 30,
        //fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    card: {
        width: '85%',
        //backgroundColor: '#ddd',
    },
    buttonStyle: {
        height: 50,
        borderColor: Config.COLORS.primary,
        color: Config.COLORS.primary,
        backgroundColor: Config.COLORS.primary,
        borderRadius: 100,
    },
    message: {
        paddingBottom: 15,
    }
})
