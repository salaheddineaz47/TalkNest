import axios from "axios";
import { configureEcho } from "@laravel/echo-react";

window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import("./echo.js");
