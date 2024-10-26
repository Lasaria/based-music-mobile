import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { tokenManager } from "../utils/tokenManager";

export default function Index() {
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        console.log("Checking for access token...");
        const tokens = await tokenManager.getAccessToken();

        if (tokens) {
          console.log("Access token found:", tokens);
          setRedirectPath("/homeIndex");
        } else {
          console.log("No access token found, redirecting to welcome page.");
          setRedirectPath("/welcome");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setRedirectPath("/welcome");
      }
    };

    checkToken();
  }, []);

  if (redirectPath) {
    console.log("Redirecting to:", redirectPath);
    return <Redirect href={redirectPath} />;
  }

  return null; // Render nothing while checking the token
}
