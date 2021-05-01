import { createStore, combineReducers } from 'redux'
import authReducer from './reducers/authReducer'
import mainReducer from './reducers/mainReducer'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';


const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const reducers = persistReducer(rootPersistConfig, combineReducers({
    auth: authReducer,
    main: mainReducer
}))

const store = createStore(reducers)
const persistor = persistStore(store)

export { store, persistor }
