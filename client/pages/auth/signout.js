import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

export default function SignOut() {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      // Redirect to the home page after successful sign out
      window.location.href = "/";
    },
  });

  useEffect(() => {
    // Call the doRequest function to sign out the user
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
}
