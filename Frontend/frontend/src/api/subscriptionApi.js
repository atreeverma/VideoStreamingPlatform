import api from "./axios";

// toggle subscribe
export const toggleSubscription = (channelId) => {
  return api.post(`/subscriptions/c/${channelId}`);
};

// get subscriber count
export const getSubscribers = (channelId) => {
  return api.get(`/subscriptions/c/${channelId}`);
};
