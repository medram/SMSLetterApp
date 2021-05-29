import { SAVE_CONTACTS, TOGGLE_BUTTON_STATUS, FIRST_START, TOGGLE_INCOMING_CALLS, TOGGLE_OUTGOING_CALLS } from "../actions/auth"


const initialState = {
    firstStart: true,
    buttonStatus: false,
    contactList: [],
    settings: {
        incomingCalls: true,
        outgoingCalls: true
    },
}

const mainReducer = (state = initialState, action) => {

    switch(action.type)
    {
        case TOGGLE_BUTTON_STATUS:
        {
            let value = !!action.payload ? action.payload : !state.buttonStatus
            return { ...state, buttonStatus: value }
        }

        case SAVE_CONTACTS:
            return { ...state, contactList: action.payload }

        case FIRST_START:
            return { ...state, firstStart: action.payload }

        case TOGGLE_INCOMING_CALLS:
        {

            let value = !!action.payload ? action.payload : !state.settings.incomingCalls
            return { ...state, settings: { ...state.settings, incomingCalls: value } }
        }

        case TOGGLE_OUTGOING_CALLS:
        {
            let value = !!action.payload ? action.payload : !state.settings.outgoingCalls
            return { ...state, settings: { ...state.settings, outgoingCalls: value } }
        }

        default:
            return state
    }
}

export default mainReducer
