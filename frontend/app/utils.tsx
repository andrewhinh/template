import { UserBackend, useConst } from "./providers";
import { sendRequest } from "./lib/api";
import { useAccount } from "./account/providers";

const useGetUser = () => {
  const setUser = useSetUser();
  const getSentFriendRequests = useGetSentFriendRequests();
  const getIncomingFriendRequests = useGetIncomingFriendRequests();
  const getFriends = useGetFriends();

  return () => {
    return new Promise((resolve, reject) => {
      sendRequest("/user/", "GET").then((data) => {
        if (data.detail) reject();
        else {
          setUser(data);
          getSentFriendRequests();
          getIncomingFriendRequests();
          getFriends();
          resolve(data);
        }
      });
    });
  };
};

const useUpdateUser = () => {
  const { state, dispatch } = useAccount();
  const setUser = useSetUser();
  const { canUpdateUser } = state;

  return (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    request: UserBackend
  ) => {
    e.preventDefault();

    if (!canUpdateUser) return;

    let showUpdateUser = false;
    if (request.profile_picture || request.username || request.fullname) {
      showUpdateUser = true;
    }

    dispatch({ type: "SET_UPDATE_USER_ERROR_MSG", payload: "" });

    if (showUpdateUser)
      dispatch({ type: "SET_UPDATE_USER_LOADING", payload: true });

    sendRequest("/user/update", "PATCH", request).then((data) => {
      if (data.detail) {
        dispatch({
          type: "SET_UPDATE_USER_ERROR_MSG",
          payload: data.detail,
        });
        if (showUpdateUser) {
          dispatch({
            type: "SET_UPDATE_USER_LOADING",
            payload: false,
          });
        }
      } else {
        setUser(data);
        if (showUpdateUser) {
          dispatch({ type: "SET_UPDATE_USER_LOADING", payload: false });
        }
        dispatch({ type: "SET_CAN_UPDATE_USER", payload: false });
      }
    });
  };
};

const useSetUser = () => {
  const { dispatch: constDispatch } = useConst();

  return (data: UserBackend) => {
    constDispatch({ type: "SET_JOIN_DATE", payload: data.join_date });
    constDispatch({
      type: "SET_PROVIDER",
      payload: data.provider,
    });
    constDispatch({
      type: "SET_PROFILE_PICTURE",
      payload: data.profile_picture,
    });
    constDispatch({ type: "SET_EMAIL", payload: data.email });
    constDispatch({
      type: "SET_USERNAME",
      payload: data.username,
    });
    constDispatch({
      type: "SET_FULLNAME",
      payload: data.fullname,
    });
    constDispatch({
      type: "SET_ACCOUNT_VIEW",
      payload: data.account_view,
    });
    constDispatch({
      type: "SET_IS_SIDEBAR_OPEN",
      payload: data.is_sidebar_open,
    });
    constDispatch({
      type: "SET_UID",
      payload: data.uid,
    });
  };
};

const useGetSentFriendRequests = () => {
  const { dispatch } = useConst();

  return () => {
    sendRequest("/friends/requests/sent", "GET").then((data) => {
      dispatch({
        type: "SET_SENT_FRIEND_REQUESTS",
        payload: data,
      });
    });
  };
};

const useGetIncomingFriendRequests = () => {
  const { dispatch } = useConst();

  return () => {
    sendRequest("/friends/requests/incoming", "GET").then((data) => {
      dispatch({
        type: "SET_INCOMING_FRIEND_REQUESTS",
        payload: data,
      });
    });
  };
};

const useGetFriends = () => {
  const { dispatch } = useConst();

  return () => {
    sendRequest("/friends/", "GET").then((data) => {
      dispatch({
        type: "SET_FRIENDS",
        payload: data,
      });
    });
  };
};

export {
  useGetUser,
  useUpdateUser,
  useSetUser,
  useGetSentFriendRequests,
  useGetIncomingFriendRequests,
  useGetFriends,
};
