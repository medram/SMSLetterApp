import { createStore, combineReducers } from 'redux'
import authReducer from './reducers/authReducer'

const reducers = combineReducers({
    auth: authReducer
})

export default createStore(reducers)
