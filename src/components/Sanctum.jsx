mport React from "react";

import { Sanctum } from "react-sanctum";

const sanctumConfig = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  csrfCookieRoute: "sanctum/csrf-cookie",
  signInRoute: "login",
  signOutRoute: "logout",
  userObjectRoute: "user",
};

const App = () => (
  <div className="my-application">
    <Sanctum config={sanctumConfig}>/* Your application code */</Sanctum>
  </div>
);