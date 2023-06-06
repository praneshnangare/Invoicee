import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY, CLIENT_ID } from "../../helpers/constants";

const useAuth = () => {
  const user = {};
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);

  const login = async () => {
    console.log("logging in")
    await window.gapi.load("client", async () => {
      try {
        await window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://sheets.googleapis.com/$discovery/rest?version=v4",
          ],
          scope: "https://www.googleapis.com/auth/spreadsheets",
          plugin_name: "invoicee",
        });
        const isLoggedIn = await window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.get();
        if (!isLoggedIn) {
          const response = await window.gapi.auth2.getAuthInstance().signIn();
          console.log(response);
        } else {
          setLoggedIn(true);
        }
        navigate("/create-invoice");
      } catch (error) {
        console.error("Error updating Google Sheet:", error);
      }
    });
  };

  const logout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log("User signed out.");
      navigate("/");
    });
  };

  return {
    login,
    logout,
    user,
  };
};

export default useAuth;
