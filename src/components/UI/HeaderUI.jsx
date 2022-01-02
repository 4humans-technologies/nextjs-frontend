import React from "react"
import { useRouter } from "next/router"
import BarChartIcon from "@material-ui/icons/BarChart"

import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"

function Headerui(props) {
  const updateAuthContext = useAuthUpdateContext()
  const authContext = useAuthContext()
  const router = useRouter()

   const profileRouter = () => {
     if (authContext.user.userType == "Model") {
       router.push(`/${authContext.user.user.username}/profile`)
     } else {
       router.push(`/user/${authContext.user.user.username}`)
     }
   }
   return (
     <div>
       <div className="tw-items-center sm:tw-flex-row tw-flex-col  tw-absolute tw-z-[105] sm:tw-top-0 tw-top-20 tw-right-1  tw-bg-second-color tw-w-9/12 tw-py-4 tw-px-4">
         <div className="tw-flex tw-justify-between tw-px-2  ">
           <div className="tw-flex tw-items-center">
             <div className="tw-rounded-full tw-bg-green-400 tw-h-2 tw-w-2 tw-flex tw-items-center tw-justify-center"></div>
             <p className="tw-pl-1 tw-pr-2">
               {props.liveModels ? props.liveModels : 0}
             </p>
             <p>LIVE </p>
           </div>

           <div className="tw-flex tw-items-center tw-pl-4">
             <BarChartIcon />
             <p>Top Model</p>
           </div>
         </div>
         <div className="tw-flex ">
           <button
             className="tw-rounded-full sm:tw-py-4 tw-py-2 tw-px-4 sm:tw-px-6 tw-bg-white-color tw-text-black sm:tw-mr-2 tw-m-2 md:tw-m-0 tw-text-center tw-my-4 tw-text-sm md:tw-text-base"
             onClick={() =>
               authContext.isLoggedIn
                 ? updateAuthContext.logout()
                 : (router.push("/auth/viewerRegistration"),
                   props.manu((prev) => !prev))
             }
           >
             {authContext.isLoggedIn ? "Logout" : "Sign Up"}
           </button>

           <button
             className={`tw-rounded-full sm:tw-py-4 tw-py-2 tw-px-4 sm:tw-px-6 tw-text-white tw-border-2 sm:tw-mr-2 tw-m-2 md:tw-m-0 tw-text-center tw-text-sm md:tw-text-base `}
             onClick={() => {
               authContext.isLoggedIn
                 ? profileRouter()
                 : router.push("/auth/login")
               props.manu((prev) => !prev)
             }}
           >
             {authContext.isLoggedIn ? "Profile" : "Login"}
           </button>
         </div>
       </div>
     </div>
   )
}

export default Headerui
