import next from "next"
import router from "next/router"
import React, { useEffect, useState } from "react"
import { useAuthUpdateContext } from "../../app/AuthContext"
import useModalContext from "../../app/ModalContext"
import ThePlanCard from "./ThePlanCard"
import { toast } from "react-toastify"

function ChooseChatPlan(props) {
  const [chatPlans, setChatPlans] = useState([])
  const modalCtx = useModalContext()

  useEffect(() => {
    fetch("/api/website/stream/get-active-chat-plans")
      .then((res) => res.json())
      .then((data) => {
        setChatPlans(data.plans)
      })
      .catch((err) => alert(err.message))
  }, [])

  const buyPlan = (planId) => {
    fetch("/api/website/stream/private-chat/buy-chat-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId: planId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        modalCtx.hideModal()
        if (data.actionStatus === "success") {
          const lcUser = JSON.parse(localStorage.getItem("user"))
          const newLcUser = {
            ...lcUser,
            relatedUser: {
              ...data.updatedViewer,
              wallet: {
                ...lcUser.relatedUser.wallet,
                currentAmount:
                  lcUser.relatedUser.wallet.currentAmount -
                  parseInt(data.planPrice),
              },
            },
          }
          localStorage.setItem("user", JSON.stringify(newLcUser))
          // authUpdateCtx.readFromLocalStorage()
          // authUpdateCtx.updateWallet(parseInt(data.planPrice), "dec")
          /**
           * currently i will reload the site but later i will do the proper smooth transition
           */
          window.location.reload()
        } else {
          alert("Chat plan not brought! Server error")
        }
      })
      .catch((err) => {
        toast.error(err.message, {
          autoClose: 2800,
          icon: <span className="tw-text-xl">😥</span>,
        })
        setTimeout(() => {
          toast.success("Click on this pop-up to buy coins", {
            onClick: () => {
              router.push("/user/payment")
            },
            position: "top-center",
            autoClose: false,
            icon: <span className="tw-text-xl">💰</span>,
          })
        }, [3000])
        return modalCtx.hideModal()
      })
  }

  return (
    <div className="">
      <h2 className="tw-mb-4 tw-text-center tw-text-lg tw-text-white-color">
        Select The Plan
      </h2>
      {/*  */}
      <div className="tw-border-t tw-border-text-black  tw-w-10/12 md:tw-w-9/12 lg:tw-w-7/12 tw-mx-auto"></div>
      <div className=" tw-mt-4 tw-flex tw-flex-wrap tw-justify-center tw-items-center tw-py-6">
        {chatPlans.map((plan, index) => {
          return (
            <ThePlanCard
              key={`${index}_sdaslda*&*)`}
              name={plan.name}
              price={plan.price}
              validityDays={plan.validityDays}
              buyThisPlan={() => buyPlan(plan._id)}
            />
          )
        })}
      </div>
      <div className="tw-border-t tw-border-text-black tw-mt-4 tw-w-10/12 md:tw-w-9/12 lg:tw-w-7/12 tw-mx-auto"></div>
    </div>
  )
}

export default ChooseChatPlan
