import React, { useEffect, useState } from "react"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

function Callhistory() {
  const authContext = useAuthContext
  return <div></div>
}

function Tokenhistory() {
  const authContext = useAuthContext
  const [tokenData, setTokenData] = useState()
  useEffect(() => {
    fetch("/api/website/profile/get-model-token-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => setTokenData(data.results))
      .catch((err) => console.log(err))
  }, [])
  tokenData.map((item) => console.log(item.by.name))
  return <div></div>
}

export { Callhistory, Tokenhistory }
