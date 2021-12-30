import React, { useState, useEffect } from "react"
import CreateIcon from "@material-ui/icons/Create"
import useModalContext from "../../app/ModalContext"
import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext" // <-- AuthContext

import {
  EmailChange,
  PasswordChange,
  CoverUpdate,
  ProfileUpdate,
} from "../UI/Profile/Emailpassword"

function UserProfile() {
  const [followerData, setFollowerData] = useState([])
  const modelCtx = useModalContext()
  const authContext = useAuthContext()
   const authUpdateContext = useAuthUpdateContext()
   // regarding user profile
   const [infoedited, setInfoedited] = useState(false)

   const [profileEdit, setProfileEdit] = useState({
     hobbies: authContext.user.user?.relatedUser?.hobbies || [],
   })

   const [userDetails, setuserDetails] = useState(null)

   useEffect(() => {
     fetch("/api/website/profile/viewer/get-followed-models-detail")
       .then((resp) => resp.json())
       .then((data) => setuserDetails(data))
   }, [])

   let profileImage = ""
   let coverImage = ""
   if (authContext.user.user) {
     profileImage = authContext.user.user?.relatedUser?.profileImage
     coverImage = authContext.user.user?.relatedUser?.coverImage
   }

   const profileEditHandler = async () => {
     const fet = await fetch(
       "/api/website/profile/viewer/update-profile-info",
       {
         method: "PUT",
         headers: {
           "Content-type": "application/json",
         },
         body: JSON.stringify([
           {
             field: "hobbies",
             value: profileEdit.hobbies,
           },
         ]),
       }
     )

     const resp = await fet.json()

     authUpdateContext.updateNestedPaths((prev) => ({
       ...prev,
       user: {
         ...prev.user,
         user: {
           ...prev.user.user,
           relatedUser: {
             ...prev.user.user.relatedUser,
             hobbies: profileEdit.hobbies,
           },
         },
       },
     }))

     //  let store = JSON.parse(localStorage.getItem("user"))
     //  store.relatedUser.hobbies = profileEdit.hobbies

     //  localStorage.setItem("user", JSON.stringify(store))
   }

   // Is to get the data of the user following

   useEffect(() => {
     fetch("/api/website/profile/viewer/get-followed-models-detail")
       .then((res) => res.json())
       .then((data) => setFollowerData(data.models))
   }, [])

   // To update profile Info
   // I need a function

   return (
     <div className="tw-bg-dark-background">
       {/* Cover page */}
       <div className="tw-w-full tw-relative  tw-bg-dark-background ">
         <img
           src={
             authContext.user.user.relatedUser?.coverImage
               ? `${authContext.user.user.relatedUser.coverImage}`
               : "/cover-photo.png"
           }
           className="tw-w-full md:tw-h-80 tw-object-cover tw-object-center"
         />
         <p
           className=" tw-absolute tw-z-10 tw-bottom-4 tw-bg-dark-background tw-text-white-color tw-right-8 tw-py-2 tw-px-4 tw-rounded-full tw-cursor-pointer"
           onClick={() => modelCtx.showModalWithContent(<CoverUpdate />)}
         >
           <CreateIcon className="tw-mr-2" />
           Background
         </p>
       </div>
       {/* Circular name  */}
       <div className="tw-w-full tw-bg-first-color tw-h-28 tw-flex tw-pl-8 tw-relative">
         <img
           className="tw-rounded-full tw-w-32 tw-h-32 flex tw-items-center tw-justify-center tw-absolute tw-z-10 tw-mt-[-3%] tw-bg-green-400 tw-shadow-lg"
           src={authContext.user.user.relatedUser?.profileImage}
         ></img>
         {authContext.user.user.username ==
           window.location.pathname.split("/")[2] && (
           <CreateIcon
             className="md:tw-ml-24 md:tw-mt-12 tw-mt-16 tw-ml-28 tw-text-white-color tw-z-10 tw-absolute tw-bg-dark-background tw-rounded-full tw-cursor-pointer"
             fontSize="medium"
             onClick={() => modelCtx.showModalWithContent(<ProfileUpdate />)}
           />
         )}

         <div className="tw-font-extrabold tw-text-2xl tw-text-white tw-ml-44 tw-flex  md:tw-mt-4 tw-mt-8">
           {authContext ? authContext.user.user.relatedUser?.name : null}
           {authContext.user.user.relatedUser?.gender == "Female" ? (
             <img src="/femaleIcon.png" className="tw-w-8 tw-h-8 tw-ml-4" />
           ) : (
             <img src="/maleIcon.png" className="tw-w-8 tw-h-8 md:tw-ml-4 " />
           )}
         </div>
       </div>
       {/* name and profile */}
       <div className="tw-grid md:tw-grid-cols-7 tw-grid-cols-1 md:tw-gap-4   md:tw-py-2 hover:tw-shadow-lg tw-rounded-t-xl tw-rounded-b-xl tw-text-white tw-w-full tw-bg-dark-background">
         <div className="md:tw-col-span-4 tw-col-span-1 tw-grid tw-grid-cols-4 ">
           <div className="md:tw-col-span-4 tw-col-span-1 tw-grid tw-grid-cols-4 tw-bg-first-color  tw-py-4 md:tw-my-0 tw-mt-4 tw-mb-4 tw-rounded-t-lg tw-rounded-b-lg tw-pl-4">
             <div className="md:tw-col-span-1 tw-col-span-2   ">
               <p>Intrested in</p>
               <p>UserName</p>
               <p>About Me</p>
               <p>Gender</p>
             </div>
             <div className="md:tw-col-span-3 tw-col-span-2 ">
               <p>EveryOne</p>
               <p>{authContext.user.user.username}</p>
               <p
                 className="tw-bg-first-color tw-rounded tw-flex"
                 onInput={(e) => {
                   setProfileEdit((prev) => ({
                     ...prev,
                     hobbies: e.target.textContent.split(","),
                   }))
                   setInfoedited(true)
                 }}
                 contentEditable="true"
                 suppressContentEditableWarning={true}
               >
                 {authContext.user.user.relatedUser?.hobbies.map(
                   (item) => item
                 )}
               </p>
               <p>{authContext.user.user.relatedUser?.gender}</p>
             </div>
             {infoedited && (
               <button
                 type="submit"
                 onClick={() => {
                   setInfoedited(false)
                   profileEditHandler()
                 }}
                 className="tw-rounded-full tw-px-4 tw-border-2 tw-border-white-color tw-font-medium tw-mt-4"
               >
                 Save
               </button>
             )}
           </div>
           {/* Email */}
           <div className="md:tw-col-span-4 tw-col-span-1 tw-grid tw-grid-cols-4 tw-bg-first-color tw-my-8 tw-px-4 tw-rounded-t-lg tw-rounded-b-lg tw-py-4 ">
             <div className="tw-col-span-4 tw-flex tw-justify-between">
               <p className="tw-flex tw-my-4 ">
                 <p>My Email</p>
                 <span className="tw-ml-4 tw-text-lg tw-font-semibold ">
                   {authContext.user.user.relatedUser?.email}
                 </span>
               </p>
               <div className="tw-my-auto">
                 <button
                   className="tw-rounded-full  tw-border-2 tw-border-white-color tw-font-medium tw-px-2"
                   onClick={() =>
                     modelCtx.showModalWithContent(<EmailChange />)
                   }
                 >
                   Change Email
                 </button>
               </div>
             </div>
           </div>
           {/* Email */}
           {/* password */}
           <div className="md:tw-col-span-4 tw-col-span-1 tw-grid tw-grid-cols-4  tw-bg-first-color tw-px-4  tw-rounded-t-lg tw-rounded-b-lg tw-py-4">
             <div className="tw-col-span-4 tw-flex tw-justify-between">
               <p className=" tw-flex tw-my-4">
                 <p>My Password</p>
                 <span className="tw-ml-4 tw-font-semibold">xxxxxxxx</span>
               </p>
               <div className="tw-my-auto">
                 <button
                   className="tw-rounded-full tw-px-2 tw-border-2 tw-border-white-color tw-font-medium "
                   onClick={() =>
                     modelCtx.showModalWithContent(<PasswordChange />)
                   }
                 >
                   Change Password
                 </button>
               </div>
             </div>
           </div>
         </div>
         {/* Password */}

         <div className="tw-bg-first-color md:tw-col-span-3 tw-col-span-1 md:tw-my-0 tw-my-4 tw-rounded-t-lg tw-rounded-b-lg tw-justify-items-start ">
           <h1 className="tw-pl-4 tw-pt-4">Dummy Freinds</h1>
           {/* Problem with useEffect and useState is that it is update after all data loaded that you have to remmembember */}
           <div className="tw-max-h-96   tw-text-white tw-overflow-y-auto">
             {followerData ? (
               <div className="tw-flex tw-flex-wrap tw-justify-between">
                 {followerData.map((item) => (
                   <div className="tw-text-center tw-my-4">
                     <img
                       className="tw-rounded-full tw-w-32 tw-h-32 tw-mx-2"
                       src={item.profileImage}
                     />
                     <h2 className="tw-my-2 ">{item.username}</h2>
                   </div>
                 ))}
               </div>
             ) : (
               <h1>No Friends</h1>
             )}
           </div>
         </div>
       </div>
     </div>
   )
}

export default UserProfile
