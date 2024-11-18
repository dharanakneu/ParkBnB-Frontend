// src/axios.js

import axios from "axios";

// Set the base URL for all API requests
axios.defaults.baseURL = "http://localhost:8080";

// Optionally, you can configure headers or other defaults here if needed
// axios.defaults.headers.common["Authorization"] = "Bearer " + token;
export default axios;
