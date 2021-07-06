import { SAVE_CONTACTS, TOGGLE_BUTTON_STATUS, FIRST_START, TOGGLE_CALL_TYPE } from "../actions/auth"


const initialState = {
    firstStart: true,
    buttonStatus: false,
    contactList: [],
    settings: {
        incoming: true,
        outgoing: true,
        answeredExternally: true,
        missed: false,
        voicemail: false,
        rejected: false,
        blocked: false,
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

        case TOGGLE_CALL_TYPE:
        {
            let callType = action.payload.type
            let value = action.payload.value
            return { ...state, settings: { ...state.settings, [callType]: value } }
        }

        default:
            return state
    }
}

export default mainReducer
