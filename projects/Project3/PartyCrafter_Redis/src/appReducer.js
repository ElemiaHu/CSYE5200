import { LOGIN_STATUS, ACTIONS } from "./constants";

export const initialState = {
    loginStatus: LOGIN_STATUS.NOT_LOGGED_IN,
    userId: -1,
    username: '',
    error: '',
}
  
function reducer(state, action) {
    switch(action.type) {

        case ACTIONS.LOG_IN:
            return {
                loginStatus: LOGIN_STATUS.IS_LOGGED_IN,
                userId: action.userId,
                username: action.username,
                error: '',
            }

        case ACTIONS.LOG_OUT:
            return {
                loginStatus: LOGIN_STATUS.NOT_LOGGED_IN,
                userId: -1,
                username: '',
                error: '',
            }

        case ACTIONS.LOG_PENDING: 
            return {
                ...state,
                loginStatus: LOGIN_STATUS.PENDING,
            }
        
        case ACTIONS.REPORT_ERROR:
            return {
                ...state,
                error: action.error,
            }
        
        default:
            throw new Error({ error: 'unknown-action', detail: action });
    }
}

export default reducer;