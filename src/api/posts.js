import axios from "axios";
import { API_CONFIG } from '../config/api';

// WordPress API configuration
const baseURL = API_CONFIG.WORDPRESS.BASE_URL;

// Create axios instance
const wordpressAPI = axios.create({
  baseURL,
  timeout: 10000,
});

// Fetch all posts
export const fetchPosts = async (params = {}) => {
  try {
    const response = await wordpressAPI.get("/posts", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Fetch single post by ID
export const fetchPost = async (id) => {
  try {
    const response = await wordpressAPI.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

// Fetch latest posts (for homepage)
export const fetchLatestPosts = async (limit = 3) => {
  try {
    const response = await wordpressAPI.get("/posts", {
      params: { 
        per_page: limit,
        orderby: 'date',
        order: 'desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    throw error;
  }
};

// Fetch posts by category
export const fetchPostsByCategory = async (categoryId) => {
  try {
    const response = await wordpressAPI.get("/posts", {
      params: { categories: categoryId }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryId}:`, error);
    throw error;
  }
};

// Fetch categories
export const fetchPostCategories = async () => {
  try {
    const response = await wordpressAPI.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching post categories:", error);
    throw error;
  }
};
