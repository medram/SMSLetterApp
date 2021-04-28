import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function Btn(props) {
    let textColor = (props.style && props.style.color) || styles.text.color

    return <TouchableOpacity onPress={props.onPress} >
            <View style={{ ...styles.btn, ...props.style }} >
                <Text style={{ ...styles.text, color: textColor }}>{props.children}</Text>
            </View>
        </TouchableOpacity>
}

const styles = StyleSheet.create({
    btn: {
        color: '#FFF',
        backgroundColor: '#354B5E',
        marginTop: 10,
        borderRadius: 4,
        padding: 16,
        paddingVertical: 10,
        borderRadius: 50,
    },
    text: {
        color: '#FFF',
    }
})
