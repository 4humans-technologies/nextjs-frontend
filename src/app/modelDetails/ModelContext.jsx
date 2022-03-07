import React, { useContext, createContext } from "react"
import { useState } from "react"

// Create the two context for the element one for update and other to use it

const ModelListContext = React.createContext()
const ModelListUpdateContext = React.createContext()

// Now the provider that will wrap all the element ,it will have the
// Both the context modelList and update that it will pass to the other component

export const ModelListContextProvider = ({ children }) => {
  // List of the all the element that need for the thing
  const [list, setUpdateList] = useState()

  // Update the list of the model
  const handelModelListUpdate = ({ data }) => {
    setUpdateList([...data.resultDocs])
  }

  return (
    <>
      <ModelListContext.Provider value={list}>
        <ModelListUpdateContext.Provider value={{ handelModelListUpdate }}>
          {children}
        </ModelListUpdateContext.Provider>
      </ModelListContext.Provider>
    </>
  )
}

// Now to use the the both provide make custome hook for the use in other element
export const useModelList = () => {
  return useContext(ModelListContext)
}

export const useUpdateModelList = () => {
  return useContext(ModelListUpdateContext)
}

// export default { useModelList, useUpdateModelList, ModelListContextProvider }
