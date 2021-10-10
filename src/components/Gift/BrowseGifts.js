import React, { useState } from "react"
import Image from "next/image"

function SingleGift({ imageUrl, price, name, _id }) {
  return (
    <div className="tw-mx-3 tw-p-2 " id={_id}>
      <Image width={100} height={100} objectFit="contain" className="tw-mb-2" />
      <p className="tw-text-center tw-font-medium tw-mb-2">{name}</p>
      <p className="tw-font-light tw-font-mono tw-text-sm">{price} coins</p>
    </div>
  )
}

function BrowseGifts({
  closeBrowseGiftsSection,
  setChosenGift,
  gifts,
  buyGifts,
}) {
  const [selectedGift, setSelectedGift] = useState(null)
  const [showBuyButton, setShowBuyButton] = useState(false)
  return (
    <div className="tw-my-2 tw-py-2 tw-px-4 tw-overflow-x-scroll tw-relative">
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-justify-between">
        {gifts.map((gift) => (
          <SingleGift
            key={gift._id}
            price={gift.price}
            name={gift.name}
            _id={gift._id}
            imageUrl={gift.imageUrl}
          />
        ))}
      </div>
      <button className="tw-absolute tw-p-2 tw-font-mono tw-font-semibold tw-text-lg tw-text-red-500 tw-top-4 tw-right-4">X</button>
    </div>
  )
}

export default BrowseGifts
