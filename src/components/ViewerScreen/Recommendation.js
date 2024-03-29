import React, { useState, useEffect } from "react"
import { useAuthContext } from "../../app/AuthContext"
import Boxgroup from "../Mainpage/Boxgroup"

function Recommendation(props) {
  const [boxGroupData, setBoxGroupData] = useState([])
  const ctx = useAuthContext()

  useEffect(() => {
    if (ctx.loadedFromLocalStorage) {
      let mounted = true

      fetch("/api/website/compose-ui/get-ranking-online-models")
        .then((res) => res.json())
        .then((data) => {
          if (!mounted) {
            return
          }
          const transformedData = data.resultDocs.map((model) => {
            return {
              ...model,
              relatedUserId: model._id,
            }
          })
          setBoxGroupData((prev) => {
            return [
              {
                title: "Recommended Models",
                data: transformedData,
              },
            ]
          })
        })
        .catch((error) => {})
      return () => {
        mounted = false
      }
    }
  }, [ctx.loadedFromLocalStorage])
  return (
    <div className="tw-my-0 tw-bg-first-color tw-mt-[-32px] tw-border-t tw-border-second-color tw-pb-10">
      {boxGroupData.map((data, index) => {
        return (
          <Boxgroup
            parent={props.parent}
            groupTitle={data.title}
            data={data.data}
            key={`${index}_boxGroup_&HJK`}
          />
        )
      })}
    </div>
  )
}

export default Recommendation
