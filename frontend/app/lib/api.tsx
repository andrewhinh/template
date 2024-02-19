"use server";

import { cookies } from "next/headers";

const removeTrailingSlash = (url: string | undefined) =>
  url ? url.replace(/\/$/, "") : "";

// Only add port for localhost
const apiUrlBase = removeTrailingSlash(process.env.API_URL);
const apiUrlPort = process.env.API_PORT ? `:${process.env.API_PORT}` : "";
const apiUrl = `${apiUrlBase}${apiUrlPort}`;

const sendRequest = async (route: string, method: string, data: any = null) => {
  let request: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.API_KEY || "",
      Cookie: cookies().toString(),
    },
    credentials: "include",
  };

  let body = null;
  if (data !== null && (method === "PATCH" || method === "POST")) {
    body = JSON.stringify(data);
  }
  if (body !== null) {
    request = { ...request, body };
  }

  const response = await fetch(`${apiUrl}${route}`, request);
  let result = null;
  if (response.redirected) {
    result = {
      url: response.url,
    };
  } else {
    result = await response.json();
  }

  const receivedCookies = response.headers.getSetCookie();
  if (receivedCookies) {
    receivedCookies.forEach((cookie) => {
      cookies().set({
        name: cookie.split("=")[0],
        value: cookie.split("=")[1].split(";")[0],
        httpOnly: true,
        maxAge: parseInt(cookie.split(";")[2].split("=")[1]),
        path: "/",
        sameSite: "none",
        secure: true,
      });
    });
  }

  // can't check if response.ok here because server errors aren't passed to client components
  return result;
};

export { sendRequest };
