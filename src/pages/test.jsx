import React, { useState } from "react"
import { DropdownButton, Dropdown, Button } from "react-bootstrap"

function test() {
  const [itemstate, setItemState] = useState([
    {
      id: 0,
      fileName: "",
      price: 0,
    },
  ])
  const [showInput, setShowInput] = useState(false)
  const [input, setInput] = useState({
    name: "",
    price: 0,
  })
  const [albumNuber, setAlbumNumber] = useState(0)

  return (
    <div className="tw-h-screen">
      <div className="tw-max-h-8 tw-my-4">
        {showInput && (
          <div>
            <input
              type="text"
              name="fileName"
              onInput={(e) =>
                setInput((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <input
              type="number"
              name="price"
              className="tw-mx-8"
              onInput={(e) =>
                setInput((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
            />
            <Button
              onClick={() => {
                setItemState((prev) => [
                  ...prev,
                  {
                    id: itemstate.id + 1,
                    fileName: input.name,
                    price: input.price,
                  },
                ]),
                  setShowInput(false)
              }}
            >
              Done
            </Button>
          </div>
        )}
      </div>
      <DropdownButton id="dropdown-basic-button " title="Dropdown button">
        {itemstate.map((item, index) => (
          <Dropdown.Item onClick={() => setAlbumNumber(index)}>
            {item.fileName}
          </Dropdown.Item>
        ))}
        <Dropdown.Item onClick={() => setShowInput((prev) => !prev)}>
          create new
        </Dropdown.Item>
      </DropdownButton>

      <div className="tw-h-10 tw-w-20 tw-border-indigo-500 tw-text-white">
        {itemstate[albumNuber].fileName}
      </div>
    </div>
  )
}

export default test
