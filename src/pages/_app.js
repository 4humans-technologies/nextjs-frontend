import { Provider } from 'react-redux'
import { store } from '../app/store'
import Consent from "../components/Consent";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      {/* <Consent /> */}
    </Provider>
  );
};

export default MyApp
