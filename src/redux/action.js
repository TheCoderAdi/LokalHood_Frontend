import axios from "axios";
import { server } from "./store";

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "loadUserRequest",
    });
    const { data } = await axios.get(`${server}/me`, {
      withCredentials: true,
      credentials: "include",
    });

    console.log(data);

    dispatch({
      type: "loadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "loadUserFailure",
      payload: error.response.data.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({
      type: "logoutRequest",
    });

    const { data } = await axios.get(`${server}/logout`, {
      withCredentials: true,
    });

    dispatch({
      type: "logoutSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "logoutfailure",
      payload: error.response.data.message,
    });
  }
};

export const updateProfile = (formData, type) => async (dispatch) => {
  try {
    dispatch({
      type: "updateProfileRequest",
    });

    const { data } = await axios.post(
      `${server}/${type}/update-profile`,
      formData,
      {
        withCredentials: true,
      },
      {
        "Content-Type": "multipart/form-data",
      }
    );

    dispatch({
      type: "updateProfileSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "updateProfileFailure",
      payload: error.response.data.message,
    });
  }
};
