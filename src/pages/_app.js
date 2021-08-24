import { Provider } from 'react-redux'
import { ContextProvider } from "../app/Context";
import { SidebarContextProvider } from "../app/Sidebarcontext";
import { store } from "../app/store";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <SidebarContextProvider>
        <ContextProvider>
          <Component {...pageProps} />
          {/* <Consent /> */}
        </ContextProvider>
      </SidebarContextProvider>
    </Provider>
  );
};

export default MyApp
