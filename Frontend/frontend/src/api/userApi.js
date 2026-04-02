import api from "./axios";

export const getChannelProfile = (username) =>
  api.get(`/users/c/${username}`);