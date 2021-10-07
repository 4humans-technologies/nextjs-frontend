import { useAuthContext } from "../../app/AuthContext";
import LoginComponent from "../../components/model/Login"
import PageHoc from "../../components/PageHoc";
import useFetchInterceptor from "../../hooks/useFetchInterceptor";

// export default Login
let fetchIntercepted = false;
const Login = () => {
    const ctx = useAuthContext()
    useFetchInterceptor(fetchIntercepted)
    fetchIntercepted = true
    return (!ctx.isLoggedIn && < LoginComponent />)
}

export default Login