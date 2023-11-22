import { Dispatch } from "redux";
import axios from "axios";

export const LOGIN_REQUEST = '[USER] LOGIN REQUEST';
export const LOGIN_SUCCESS = '[USER] LOGIN SUCCESS';
export const LOGIN_FAILURE = '[USER] LOGIN FAILURE';
export const LOGIN_DONE = '[USER] LOGIN DONE';

export const loginWithPassword: any = (credential: any) => (dispatch: Dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  return axios.post(`${process.env.SERVER_API}/login/`, credential)
    .then(response => {
      if (response.data.success) {
        localStorage.setItem('access-token', response.data.token);
        dispatch(loginWithToken());
      } else {
        dispatch({ type: LOGIN_DONE })
      }

      return response.data;
    })
    .catch(error => {
      dispatch({
        type: LOGIN_FAILURE,
        error
      });

      throw new Error(error);
    });
}

export const loginWithToken: any = () => (dispatch: Dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  const accessToken: string | null = localStorage.getItem('access-token');
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  return axios.get(`${process.env.SERVER_API}/token/`)
    .then(response => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data
      });

      return response.data;
    })
    .catch(error => {
      dispatch({
        type: LOGIN_FAILURE,
        error
      });

      localStorage.removeItem('access-token');

      throw new Error(error);
    });
}


export const registerUser: any = (credential: any) => async (dispatch: Dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  return axios.post(`${process.env.SERVER_API}/register/`, credential)
    .then(response => {
      dispatch({ type: LOGIN_DONE });

      return response.data;
    })
    .catch(error => {
      dispatch({
        type: LOGIN_FAILURE,
        error
      });

      throw new Error(error);
    });
}