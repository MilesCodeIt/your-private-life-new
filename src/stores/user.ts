import { createStore } from "solid-js/store";

export const [user, setUser] = createStore({
  loaded: false,
  logged_in: false,
  
  username: "",
  id: ""
});
