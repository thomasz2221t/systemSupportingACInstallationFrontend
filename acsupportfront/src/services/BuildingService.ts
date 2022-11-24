import axios from "axios";
import API_URL from "utils/ApiUrl";
import authHeader from "./auth/AuthHeaders";

const getUserBuildings = (userId: number) => {
  console.log(authHeader());
  return axios.get(`${API_URL}/building/user/${userId}`, {
    headers: authHeader(),
  });
};

export default getUserBuildings;
