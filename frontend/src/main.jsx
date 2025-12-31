import React from "react";
import ReactDOM from "react-dom/client";
// 1. استيراد المكتبة
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import {GoogleOAuthProvider} from "@react-oauth/google";
// 2. إنشاء نسخة من المحرك (QueryClient)
const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = "693404681858-973lei1dqln8petnv9fcvu7nprua47a8.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 3. تغليف التطبيق بالـ Provider وتمرير المحرك له */}
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
