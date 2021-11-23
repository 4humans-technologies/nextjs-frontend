import next from "next"
import router from "next/router"
import React, { useEffect, useState } from "react"
import { useAuthUpdateContext } from "../../app/AuthContext"
import ThePlanCard from "./ThePlanCard"

const initialData = [
  {
    id: "sfd098",
    name: "Basic Plan",
    price: 40,
    validityDays: 30,
  },
  {
    id: "sfd0sda98",
    name: "Pro Plan",
    price: 70,
    validityDays: 60,
  },
  {
    id: "sfd032498",
    name: "Knight Plan",
    price: 100,
    validityDays: 90,
  },
]

function ChooseChatPlan(props) {
  const [chatPlans, setChatPlans] = useState([])
  const { setIsChatPlanActive } = props
  const authUpdateCtx = useAuthUpdateContext()

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
        if (data.actionStatus === "success") {
          setIsChatPlanActive(true)
          const lcUser = JSON.parse(localStorage.getItem("user"))
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...lcUser,
              relatedUser: {
                ...data.updatedUser,
                wallet: lcUser.relatedUser.wallet,
              },
            })
          )
          authUpdateCtx.readFromLocalStorage()
          authUpdateCtx.updateWallet(
            chatPlans.find((plan) => plan._id === planId),
            "dec"
          )
        } else {
          alert("Chat plan not brought!")
        }
      })
      .catch((err) => {
        if (err.reasonCode === "low-balance") {
          const res = window.confirm(
            err.message + " Do you want to buy new coins ?"
          )
          if (res) {
            return router.push("/user/payment")
          }
        }
        return
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
