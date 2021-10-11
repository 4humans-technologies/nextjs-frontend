import React, { useState } from "react"
import Image from "next/image"

function SingleGift({ imageUrl, price, name, _id, selectHandler, selected }) {
  const finalImageUrl = "http://192.168.1.104:8080" + imageUrl
  return (
    <div
      className={`tw-mx-2 tw-py-2 tw-px-6 ${
        selected ? "tw-bg-second-color" : "hover:tw-bg-second-color"
      } tw-transition tw-rounded tw-text-center`}
      id={_id}
      onClick={() => selectHandler(_id)}
    >
      <div className="tw-h-[80px] tw-w-[80px] tw-grid tw-place-items-center tw-mb-4 tw-mx-auto">
        <Image
          src={finalImageUrl}
          width={80}
          height={80}
          objectFit="cover"
          className=""
        />
      </div>
      <p className="tw-text-center tw-mb-2 tw-text-white-color tw-text-sm">
        {name}
      </p>
      <p className="tw-font-light tw-text-center tw-font-mono tw-text-sm tw-text-yellow-400">
        {price} coins
      </p>
    </div>
  )
}

function BrowseGifts({ closeBrowseGiftsSection, gifts, buyGifts }) {
  const [selectedGift, setSelectedGift] = useState(null)
  const [showBuyButton, setShowBuyButton] = useState(false)

  const selectHandler = (id) => {
    setSelectedGift(id)
    setShowBuyButton(true)
  }

  const initBuy = () => {
    buyGifts(selectedGift)
  }
  return (
    <div className="tw-relative tw-bg-dark-black tw-pb-4">
      <div className="tw-py-2 tw-px-4 tw-overflow-x-scroll  gift-container tw-w-full">
        <div className="tw-flex tw-flex-row tw-flex-nowrap tw-justify-between tw-mt-2">
          {gifts.map((gift) => (
            <SingleGift
              key={gift._id}
              price={gift.price}
              name={gift.name}
              _id={gift._id}
              imageUrl={gift.imageUrl}
              selectHandler={selectHandler}
              selected={selectedGift === gift._id ? true : false}
            />
          ))}
        </div>
      </div>
      <button
        onClick={() => closeBrowseGiftsSection()}
        className="tw-absolute tw-py-1 tw-px-3 tw-rounded-md tw-font-mono tw-font-bold tw-text-sm tw-text-red-500 tw-top-4 tw-right-8 tw-bg-second-color"
      >
        X
      </button>
      {showBuyButton && (
        <div className="tw-flex tw-justify-center tw-items-center tw-mt-4">
          <button
            className="tw-flex-shrink-0 tw-flex-grow-0 tw-bg-yellow-500 tw-text-white-color tw-font-semibold tw-px-4 tw-py-2 tw-rounded"
            onClick={initBuy}
          >
            Buy This Gift
          </button>
        </div>
      )}
    </div>
  )
}

export default BrowseGifts
