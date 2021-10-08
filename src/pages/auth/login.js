import { useAuthContext, useAuthUpdateContext } from "../../app/AuthContext";
import LoginComponent from "../../components/model/Login"
import PageHoc from "../../components/PageHoc";
import useFetchInterceptor from "../../hooks/useFetchInterceptor";
import { useRouter } from "next/router"

// export default Login
let fetchIntercepted = false;
const Login = () => {
    const ctx = useAuthContext()
    const updateCtx = useAuthUpdateContext()
    useFetchInterceptor(fetchIntercepted)
    fetchIntercepted = true
    const router = useRouter()

    if (ctx.isLoggedIn) {
        router.push("/")
    }

    return (!ctx.isLoggedIn ? < LoginComponent /> : (
        <div className="tw-min-h-screen tw-grid tw-place-items-center">
            <div className="tw-p-3 tw-text-center">
                <h1 className="tw-font-medium tw-text-xl tw-mb-5">
                    You are already Logged In
                </h1>
                <button className="tw-px-4 tw-py-2 tw-shadow tw-rounded tw-bg-red-500 tw-text-white-color" onClick={updateCtx.logout}>
                    Logout
                </button>
            </div>
        </div>
    ))
}

export default Login