import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1] || "";
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  try {
    const postPromise = apiRequest("/users/profilePosts").catch(err => {
      console.error("Error fetching profile posts:", err);
      return { data: { userPosts: [], savedPosts: [] } };
    });

    return defer({
      postResponse: postPromise,
    });
  } catch (err) {
    console.error("Error in profilePageLoader:", err);
    return defer({
      postResponse: Promise.resolve({ data: { userPosts: [], savedPosts: [] } }),
    });
  }
};
