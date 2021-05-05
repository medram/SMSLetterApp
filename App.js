import 'react-native-gesture-handler'

import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';

import * as Font from 'expo-font'
import AppLoading from 'expo-app-loading'

import { setCustomText } from 'react-native-global-props'
import * as Config from './Config'
import RootNavigator from './navigators';

// importing redux stuff
import { Provider } from 'react-redux'
import { store, persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'


// Overriding default styles
setCustomText({ style: { fontFamily: 'Nunito', color: Config.COLORS.secondary}})



// init app
function _initApp()
{
  // loading fonts
  return Font.loadAsync({
    'Nunito': require('./assets/fonts/Nunito/Nunito-Regular.ttf'),
    'Nunito-italic': require('./assets/fonts/Nunito/Nunito-Italic.ttf'),
    'Nunito-light': require('./assets/fonts/Nunito/Nunito-Light.ttf'),
    'Nunito-light-italic': require('./assets/fonts/Nunito/Nunito-LightItalic.ttf'),
    'Nunito-bold': require('./assets/fonts/Nunito/Nunito-Bold.ttf'),
    'Nunito-bold-italic': require('./assets/fonts/Nunito/Nunito-BoldItalic.ttf'),
  })
}

export default function App(props)
{
  let [ appLoaded, setAppLoaded ] = useState(false)

  if (!appLoaded)
  {
    return <AppLoading
      startAsync={_initApp}
      onFinish={() => setAppLoaded(true)}
      onError={(err) => console.log(err)}
      />
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
