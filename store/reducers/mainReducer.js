import { SAVE_CONTACTS, TOGGLE_BUTTON_STATUS, FIRST_START } from "../actions/auth"


const initialState = {
    firstStart: true,
    buttonStatus: false,
    contactList: [],
}

const mainReducer = (state = initialState, action) => {

    switch(action.type)
    {
        case TOGGLE_BUTTON_STATUS:
            let value = !!action.payload ? action.payload : !state.buttonStatus
            return { ...state, buttonStatus: value }
        case SAVE_CONTACTS:
            return { ...state, contactList: action.payload }
        case FIRST_START:
            return { ...state, firstStart: action.payload }
        default:
            return state
    }
}

export default mainReducer
