import React from "react"
import AlbumPurchase from "./NotificationTypes/AlbumPurchase"
import ViewerFollowedModel from "./NotificationTypes/ViewerFollowedModel"
import ViewerTipped from "./NotificationTypes/ViewerTipped"

function Notifications(props) {
  return (
    <span
      style={{ display: props.show ? "inline" : "none" }}
      className="tw-absolute tw-left-0 tw-top-10 tw-bg-dark-black/30 tw-backdrop-blur tw-p-2 tw-w-64 tw-translate-x-[-50%] notif-wrapper"
    >
      <div className="tw-overflow-y-auto tw-h-52 notif-container">
        {props.notifications.length > 0 ? (
          props.notifications.map((notif, index) => {
            switch (notif.tag) {
              case "viewer-follow":
                return (
                  <ViewerFollowedModel
                    name={notif.data.name}
                    message={notif.message}
                    profileImage={notif.data.profileImage}
                    dateTime={`${Math.floor(
                      (Date.now() - notif.time) / 3600000
                    )}h ago`}
                  />
                )
                break
              case "viewer-coins-gift":
                return (
                  <ViewerTipped
                    message={notif.message}
                    modelGot={notif.data.modelGot}
                    dateTime={`${Math.floor(
                      (Date.now() - notif.time) / 3600000
                    )}h ago`}
                  />
                )
              case "video-album-purchase" || "image-album-purchase":
                return (
                  <AlbumPurchase
                    albumType={notif.tag}
                    message={notif.message}
                    dateTime={`${Math.floor(
                      (Date.now() - notif.time) / 3600000
                    )}h ago`}
                    debited={notif.data.debited}
                  />
                )
              default:
                break
            }
          })
        ) : (
          <div className="tw-bg-second-color/80 tw-rounded tw-mb-2 tw-px-2 tw-py-2">
            <p className="tw-text-white-color tw-capitalize">
              no Notifications
            </p>
          </div>
        )}
      </div>
    </span>
  )
}

export default Notifications
