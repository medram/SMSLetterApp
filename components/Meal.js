import React from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback, Image } from 'react-native'


export default function Meal(props) {
    const { item } = props

    return <TouchableNativeFeedback onPress={props.onPress} >
        <View style={{ ...styles.container, ...props.style }}>
            <Image source={require('../assets/icon.png')} style={styles.image} />
            <Text style={styles.text} >{props.value || item.name}</Text>
        </View>
    </TouchableNativeFeedback>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomWidth: 1,
        borderColor: '#DDD',
        textAlign: 'left',
        padding: 5,
        //backgroundColor: '#f451ee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        flex: 1,
        textAlign: 'left',
        color: '#333',
        //backgroundColor: '#CCC',
        //fontSize: 20,
        fontWeight: 'bold',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ddd',
        //backgroundColor: '#000',
    }
})
