import React from 'react'
import { TextInput, StyleSheet } from 'react-native'

export default function Input(props)
{
    return <TextInput {...props} style={{ ...styles.input, ...props.style }} />
}

const styles = StyleSheet.create({
    input: {
        color: '#555',
        backgroundColor: '#DDD',
        padding: 5,
        borderRadius: 4,
    }
})
