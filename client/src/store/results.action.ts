import axios from "axios";
import { Product } from "@/utils/interfaces";

export const SET_DATA_REQUEST = "[RESULTS] SET REQUEST";
export const SET_DATA_SUCCESS = "[RESULTS] SET SUCCESS";
export const SET_DATA_FAILED = "[RESULTS] SET FAILED";

export const createUserData =
  (user: any): any =>
  async (dispatch: any) => {
    dispatch({ type: SET_DATA_REQUEST });

    return axios.post(`${process.env.SERVER_API}/products/`, user).then(() => {
      axios
        .get(`${process.env.SERVER_API}/products/`)
        .then(({ data }) => {
          dispatch({
            type: SET_DATA_SUCCESS,
            payload: data,
          });

          return data;
        })
        .catch((error) => {
          dispatch({
            type: SET_DATA_FAILED,
            error,
          });

          return error;
        });
    });
  };

export const getProductData = (): any => async (dispatch: any) => {
  dispatch({ type: SET_DATA_REQUEST });
  return axios
    .get(`${process.env.SERVER_API}/ads/`)
    .then(({ data }) => {
      // Parse the JSON string into a JavaScript object
      const parsedData = JSON.parse(data.ads_data);
      // Process the data
      const processedData = {
        list: processData(parsedData.ads_data),
      };
      dispatch({
        type: SET_DATA_SUCCESS,
        payload: processedData,
      });

      return data;
    })
    .catch((error) => {
      dispatch({
        type: SET_DATA_FAILED,
        error,
      });

      return error;
    });
};

export const updateAddData =
  (ad_data: any): any =>
  (dispatch: any) => {
    const { id, price } = ad_data;

    return axios
      .put(`${process.env.SERVER_API}/ads/?id=${id}`, { price })
      .then((response: any) => {
        axios
          .get(`${process.env.SERVER_API}/ads/`)
          .then(({ data }) => {
            // Parse the JSON string into a JavaScript object
            const parsedData = JSON.parse(data.ads_data);
            // Process the data
            const processedData = {
              list: processData(parsedData.ads_data),
            };
            dispatch({
              type: SET_DATA_SUCCESS,
              payload: processedData,
            });

            return data;
          })
          .catch((error) => {
            dispatch({
              type: SET_DATA_FAILED,
              error,
            });

            return error;
          });
        return response.data;
      });
  };

const processData = (data: any) => {
  let result = [];
  for (const key in data) {
    const obj = {
      id: key,
      Allowed_Spend_per_Ad: data[key].Allowed_Spend_per_Ad,
      Cost_Share_Rate: data[key].Cost_Share_Rate,
      spend: data[key].spend,
    };
    result.push(obj);
  }
  return result;
};
