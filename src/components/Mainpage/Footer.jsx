import React from "react"
import logo from "../../../public/logo.png"
import Image from "next/image"
import Link from "next/link"

function Footer() {
  return (
    <div className="tw-pt-10 tw-bg-dark-black tw-w-full">
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 lg:tw-grid-cols-6  tw-auto-rows-auto tw-px-2 tw-gap-y-4 tw-gap-x-3 md:tw-px-6 tw-py-6 sm:tw-gap-x-3 tw-tracking-wide">
        <div className="tw-col-span-1 md:tw-col-span-3 lg:tw-col-span-2 flex tw-flex-col tw-items-center tw-justify-between">
          <div className=" tw-justify-start tw-mb-10">
            <Image src={logo} width={134} height={68} objectFit="cover" />
            <br />
            <span className="tw-text-text-black ">
              &copy; Than Tara Entertainment Limited
            </span>
          </div>
          <div className="mt-2 tw-text-text-black">
            <p className="tw-text-sm tw-font-light tw-mb-1.5">
              Tuktuklive is a product of{" "}
              <span className="tw-font-bold tw-underline">
                Than Tara Entertainment
              </span>
              ,it is designed to make new friends and talk to strangers from
              distance. Is your life boring? Want to make friends worldwide?
              Need something funny and meaningful? Tuktuklive is what you are
              looking for!
            </p>
            <p className="tw-text-sm tw-font-light">
              Tuktuklive is a 1-on-1 online video and voice chat app with Live
              Streaming and Group chat, which opens up possibility to make
              friends from all over the world. With video Chat and Voice Chat,
              you can communicate with strangers like face to face anytime and
              anywhere.
            </p>
          </div>
        </div>
        <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 flex tw-flex-col tw-content-start tw-justify-start tw-items-center">
          <h2 className="tw-font-bold tw-py-2 tw-pl-0.5 tw-text-white-color tw-uppercase">
            Legal & Safety
          </h2>
          <div className="mt-1">
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <Link href="/privacy-policy">Privacy policy</Link>
            </p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <Link href="/term-of-use">Term of use</Link>
            </p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <Link href="">DMCA policy</Link>
            </p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <Link href="/footer/Cookies">Cookies policy</Link>
            </p>
          </div>
        </div>
        <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 flex tw-flex-col tw-content-start tw-justify-start tw-items-center">
          <h2 className="tw-font-bold tw-py-2 tw-pl-0.5 tw-text-white-color tw-uppercase">
            <Link href="/auth/modelRegisteration">work with us</Link>
          </h2>
          <div className="mt-1">
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <Link href="/auth/modelRegisteration"> become a model</Link>
            </p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              affiliate program
            </p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <Link href="/footer/Resulttip"> Tips for best result</Link>
            </p>
          </div>
        </div>
        <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 flex tw-flex-col tw-content-start tw-justify-start tw-items-center">
          <h2 className="tw-font-bold tw-py-2 tw-pl-0.5 tw-text-white-color tw-uppercase">
            Help & support
          </h2>
          <div className="mt-1">
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <Link href="/footer/Contact">contact & support</Link>
            </p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <Link href="/footer/Billing"> billing support</Link>
            </p>
          </div>
        </div>
        <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 flex tw-flex-col tw-content-start tw-justify-start tw-items-center">
          <h2 className="tw-font-bold tw-py-2 tw-pl-0.5 tw-text-white-color tw-uppercase">
            Social media
          </h2>
          <div className="mt-1">
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <a
                href="https://www.facebook.com/Dream-girl-live-107066781714593"
                target="_blank"
                className=""
              >
                Facebook
              </a>
            </p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <a
                href="https://www.instagram.com/dreamgirl_live143/"
                target="_blank"
                className=""
              >
                Instagram
              </a>
            </p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <a
                href="https://t.me/joinchat/TDrvk9rT7mtkOTU5"
                target="_blank"
                className=""
              >
                Telegram
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="tw-text-center tw-py-3">
        <div className="tw-border-t-[1px] tw-border-text-black tw-mx-auto tw-w-11/12"></div>
      </div>
      {/* <div className="tw-bg-third-color tw-flex tw-items-center tw-justify-center tw-py-2 footer-top-shadow">
        <p className="tw-text-white-color tw-capitalize tw-text-center tw-px-3">
          By using this website, you agree to our cookie policy. we use cookies
          to deliver our services.
        </p>
      </div> */}
    </div>
  )
}

export default React.memo(Footer)
