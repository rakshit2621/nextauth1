// import UserPass from "@/components/Creds/UserPass";
import EmailPass from "@/components/Creds/EmailPass";
// import EmailOtp from "@/components/Creds/EmailOtp";
import React from "react";

function AuthChoice() {
  return (
    <div>
      {/* <UserPass /> */}
      <EmailPass />
      {/* <EmailOtp /> */}
    </div>
  );
}

export default AuthChoice;
