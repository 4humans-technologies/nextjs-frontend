export default function Spinner(props) {
  return (
    <div className="tw-fixed tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-grid tw-place-items-center tw-bg-[rgba(0,0,0,0.56)] tw-z-[500] tw-backdrop-blur-sm">
      <div className="tw-flex tw-flex-col tw-pt-4 tw-px-6 tw-bg-gray-50 tw-rounded-md">
        <div className="tw-grid tw-place-items-center tw-flex-grow">
          <span className="tw-relative tw-z-[500]">
            <div className="time-5"></div>
          </span>
        </div>
        <div className="tw-flex-grow">
          <p className="tw-capitalize tw-font-mono tw-font-medium tw-text tw-text-center tw-text-first-color tw-my-4 tw-max-w-[150px]">
            {props.loadingText || "Please Wait..."}
          </p>
        </div>
      </div>
    </div>
  )
}
