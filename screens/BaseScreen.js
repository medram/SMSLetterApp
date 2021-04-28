import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'

import Header from '../components/Header'


export default function BaseScreen(props) {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ ...styles.container, ...props.style }}>
                <Header title={props.title} style={props.headerStyle} />
                {props.children}
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
        //padding: 20,
    },
})
