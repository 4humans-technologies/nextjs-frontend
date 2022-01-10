function ThePlanCard(props) {
  return (
    <div className="tw-bg-second-color tw-rounded tw-text-center tw-py-3 tw-px-8 md:tw-px-10 lg:tw-px-14 xl:tw-px-16 tw-mx-3 tw-my-3 tw-flex-grow-0 tw-flex-shrink-0 tw-text-text-black">
      <h2 className="tw-mb-3 tw-font-medium">{props.name}</h2>
      <h2 className="tw-font-medium tw-text-2xl tw-text-white-color">
        {props.validityDays} Days
      </h2>
      <p className="tw-mt-3 tw-text-text-black tw-font-medium">
        {props.price} coins{" "}
      </p>
      <div className="tw-my-3 tw-text-center">
        <button
          onClick={props.buyThisPlan}
          className="tw-py-2 tw-px-4 tw-capitalize tw-bg-dreamgirl-red tw-text-white-color tw-font-semibold tw-rounded-full"
        >
          Buy This
        </button>
      </div>
    </div>
  )
}

export default ThePlanCard
