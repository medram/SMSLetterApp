import AsyncStorage from '@react-native-async-storage/async-storage';

export const COLORS = {
    'primary': '#8BC34A',
    'secondary': '#607D8B'
}


export const DEBUG = false
//export const HOSTNAME = 'http://192.168.1.109:8000'
//export const HOSTNAME = 'http://64.20.54.76'
export const HOSTNAME = 'http://dashboard.smsletter.com'
export const BASE_URL = `${HOSTNAME}/api`

export const getHostname = async () => {
    let COMPANY = await AsyncStorage.getItem('@company')
    return `${HOSTNAME}`
}

export const getBaseUrl = async () => {
    let COMPANY = await AsyncStorage.getItem('@company')
    return `${HOSTNAME}/${COMPANY}`
}

export const getApiBaseUrl= async () => {
    let COMPANY = await AsyncStorage.getItem('@company')
    return `${HOSTNAME}/${COMPANY}/api`
}

// API URLs
export const URLS = {
    //'auth': `${BASE_URL}/auth/`,
    //'profile': `${BASE_URL}/profile/`,
    'contact': async () => {
        return await getApiBaseUrl() + '/contact/'
    },
}

// App info
export const APP_NAME = 'SMSLetter'
export const APP_VERSION = '1.1.0'

