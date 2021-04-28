import { CHANGE_BUTTON_STATUS } from "../actions/auth"

const initialState = {
    buttonStatus: false
}

const mainReducer = (state = initialState, action) => {

    switch(action.type)
    {
        case CHANGE_BUTTON_STATUS:
            return {...state, buttonStatus: !state.buttonStatus}
        default:
            return state
    }
}

export default mainReducer
