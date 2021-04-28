import React from 'react'
import { View, Text, StyleSheet } from 'react-native'


export default function Header(props)
{
    return (
        <View style={{...styles.header, ...props.style }} >
            <Text style={styles.text}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        //alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 90,
        padding: 20,
        paddingTop: 43,
        backgroundColor: '#607D8B',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 20,
    }
})


