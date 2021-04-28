import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

import * as data from '../data/data'
import Meal from '../components/Meal'

export default function MealsListScreen(props)
{
    const { navigation, route } = props
    const [meals, setMeals ] = useState([])

    useEffect(() => {
        setMeals(() => data.meals)
    }, [meals])

    return <ScrollView>
        <View style={styles.container}>
            {meals.map((meal, i) => {
                return <Meal key={i} item={meal} onPress={() => navigation.navigate('MealDetail', { id: meal.id })} />
            })}
        </View>
    </ScrollView>
}

/*
MealsListScreen.navigationOptions = (navigation) => {
    return { title: '...' }
}
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
