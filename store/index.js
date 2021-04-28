import { createStore, combineReducers } from 'redux'
import authReducer from './reducers/authReducer'
import mainReducer from './reducers/mainReducer'

const reducers = combineReducers({
    auth: authReducer,
    main: mainReducer
})

export default createStore(reducers)
