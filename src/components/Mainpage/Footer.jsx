import React from "react";
import TwitterIcon from "@material-ui/icons/Twitter";
import logo from "../../../public/logo.png"
import Image from "next/image"

function Footer() {
  return (
    <div className="tw-pt-10 tw-bg-dark-black">
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 lg:tw-grid-cols-6  tw-auto-rows-auto tw-px-2 tw-gap-y-4 tw-gap-x-3 md:tw-px-6 tw-py-6 sm:tw-gap-x-3 tw-tracking-wide">
        <div className="tw-col-span-1 md:tw-col-span-3 lg:tw-col-span-2 flex tw-flex-col tw-items-center tw-justify-between">
          <div className="flex tw-items-center tw-justify-start tw-mb-10">
            <Image src={logo} width={134} height={68} objectFit="cover" />
            {/* <img src={logo} alt="" /> */}
          </div>
          <div className="mt-2 tw-text-text-black">
            <p className="tw-text-sm tw-font-light tw-mb-1.5">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur expedita possimus accusantium excepturi
              delectus quod corporis consequuntur velit rem
            </p>
            <p className="tw-text-sm tw-font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem quia ad vero corrupti commodi a
              sit quas repellendus sunt, veritatis quasi.
            </p>
          </div>
        </div>
        <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 flex tw-flex-col tw-content-start tw-justify-start tw-items-center">
          <h2 className="tw-font-bold tw-py-2 tw-pl-0.5 tw-text-white-color tw-uppercase">Legal & Safety</h2>
          <div className="mt-1">
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">Privacy policy</p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">Term of use</p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">DMCA policy</p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">Cookies policy</p>
          </div>
        </div>
        <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 flex tw-flex-col tw-content-start tw-justify-start tw-items-center">
          <h2 className="tw-font-bold tw-py-2 tw-pl-0.5 tw-text-white-color tw-uppercase">work with us</h2>
          <div className="mt-1">
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">become a model</p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">affiliate program</p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">tips for best result</p>
          </div>
        </div>
        <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 flex tw-flex-col tw-content-start tw-justify-start tw-items-center">
          <h2 className="tw-font-bold tw-py-2 tw-pl-0.5 tw-text-white-color tw-uppercase">Help & support</h2>
          <div className="mt-1">
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">contact & support</p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">billing support</p>
          </div>
        </div>
        <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 flex tw-flex-col tw-content-start tw-justify-start tw-items-center">
          <h2 className="tw-font-bold tw-py-2 tw-pl-0.5 tw-text-white-color tw-uppercase">Social media</h2>
          <div className="mt-1">
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">
              <a href="#">Twitter</a>
            </p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">Instagram</p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">Youtube</p>
            <p className="tw-text-text-black tw-text-sm tw-py-2 tw-font-light tw-pl-0.5 tw-border-t-[1px] tw-border-text-black tw-capitalize">Facebook</p>
          </div>
        </div>
      </div>
      <div className="tw-text-center tw-py-3">
        <div className="tw-border-t-[1px] tw-border-text-black tw-mx-auto tw-w-11/12"></div>
      </div>
      <div className="tw-bg-third-color tw-flex tw-items-center tw-justify-center tw-py-2 footer-top-shadow">
        <p className="tw-text-white-color tw-capitalize tw-text-center tw-px-3">By using this website, you agree to our cookie policy. we use cookies to deliver our services.</p>
      </div>
    </div>
  );
}

export default Footer;
