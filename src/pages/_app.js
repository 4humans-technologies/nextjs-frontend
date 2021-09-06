import { Provider } from 'react-redux'
import { ContextProvider } from "../app/Context";
import { SidebarContextProvider } from "../app/Sidebarcontext";
import { ViewerContextProvider } from "../app/Viewercontext";
import { store } from "../app/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";


const MyApp = ({ Component, pageProps }) => {
  return (
      <Provider store={store}>
        <ViewerContextProvider>
          <SidebarContextProvider>
            <ContextProvider>
              <Component {...pageProps} />
              {/* <Consent /> */}
            </ContextProvider>
          </SidebarContextProvider>
        </ViewerContextProvider>
      </Provider>
  );
};

export default MyApp
