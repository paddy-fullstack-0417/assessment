import * as Actions from './user.action';

const initialState = {
  user: null,
  isLoading: false,
  error: null
}

const user = (state = initialState, action: any) => {
  switch (action.type) {
    case Actions.LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true
      }
    }
    case Actions.LOGIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        payload: action.payload
      }
    }
    case Actions.LOGIN_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    case Actions.LOGIN_DONE: {
      return {
        ...state,
        isLoading: false
      }
    }
    default: {
      return state;
    }
  }
}

export default user;
