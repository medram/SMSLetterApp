import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { COLORS } from '../Config'

export default function Avatar(props) {
    return <Image {...props} style={[ styles.avatar, props.style ]} />
}

const styles = StyleSheet.create({
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: COLORS.secondary+'a1',
    }
})
