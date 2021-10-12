import React from "react"
import { useRouter } from "next/router"

function submitFile() {
  const router = useRouter()
  setTimeout(() => {
    router.replace("/")
  }, 1000)
  return (
    <div>
      <h1>Thanks MODELNAME ,Our Team will soon connect you </h1>
    </div>
  )
}

export default submitFile
