import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext"
import LoginComponent from "../../components/model/Login"
import PageHoc from "../../components/PageHoc"
import { useRouter } from "next/router"

// export default Login
const Login = () => {
  const ctx = useAuthContext()
  const updateCtx = useAuthUpdateContext()
  const router = useRouter()

  if (ctx.isLoggedIn) {
    router.replace("/")
  }

  return !ctx.isLoggedIn ? (
    <LoginComponent />
  ) : (
    <div className="tw-min-h-screen tw-grid tw-place-items-center">
      <div className="tw-p-3 tw-text-center">
        <h1 className="tw-font-medium tw-text-xl tw-mb-5">
          You are already Logged In
        </h1>
        <button
          className="tw-mx-4  tw-px-4 tw-py-2 tw-rounded-full tw-bg-none hover:tw-bg-white hover:tw-text-black hover:tw-border tw-border-white tw-capitalize"
          onClick={updateCtx.logout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Login
