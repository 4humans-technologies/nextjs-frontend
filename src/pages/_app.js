import { Provider } from 'react-redux'
import { ContextProvider } from "../app/Context";
import { SidebarContextProvider } from "../app/Sidebarcontext";
import { ViewerContextProvider } from "../app/Viewercontext";
import { ModalContextProvider } from "../app/ModalContext"
import { store } from "../app/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";


const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ViewerContextProvider>
        <SidebarContextProvider>
          <ContextProvider>
            <ModalContextProvider>
              <Component {...pageProps} />
            </ModalContextProvider>
            {/* <Consent /> */}
          </ContextProvider>
        </SidebarContextProvider>
      </ViewerContextProvider>
    </Provider>
  );
};

export default MyApp
