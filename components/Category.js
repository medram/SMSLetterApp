import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'


export default function Category(props)
{
    const { item, navigation } = props

    return <TouchableOpacity activeOpacity={.7}
        onPress={props.onPress}
        style={{ ...styles.container, ...props.style }}
        >
        <View>
            <Text style={styles.text} >{props.value || item.name}</Text>
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDD',
        //flexBasis: '45%',
        minWidth: '45%',
        maxWidth: '45%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    text: {
        textAlign: 'center',
        color: '#fff',
        //backgroundColor: '#CCC',
        fontSize: 20,
    }
})
