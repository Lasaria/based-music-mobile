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
          console.log("Access token found");
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
    console.log(
      "\n" +
      "\n" +
      "\n" +
      "\n" +
      "\n" +
      "--------------------------!! LOG START POINT AFTER SESSION REFRESH !!-------------------------------" +
      "\n" +
      "Redirecting to: " +
      redirectPath +
      "\n" +
      "---------------------------------------------------------------------------------------------------" +
      "\n"
    );
    console.log("Redirecting to:", redirectPath);
    return <Redirect href={redirectPath} />;
  }

  return null; // Render nothing while checking the token
}
