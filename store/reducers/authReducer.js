import { AUTH_LOGIN, AUTH_LOGOUT } from "../actions/auth"

const initialState = {
    user: {
        id: 0,
        username: "",
        email: "",
        profile_image: "",
        first_name: "",
        last_name: "",
        phone: "",
        date_joined: ""
    },
    token: '',
    isAuth: false,
}

const authReducer = (state = initialState, action) => {
    switch(action.type)
    {
        case AUTH_LOGIN:
            const payload = action.payload
            return {...state, user: payload.user, token: payload.token, isAuth: true}
        case AUTH_LOGOUT:
            return {...state, user: {}, token: '', isAuth: false}
        default:
            return state
    }
}

export default authReducer
