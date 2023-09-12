import '../styles/globals.css'
import {applyMiddleware, createStore} from "redux";
import cookieReducer from "../redux/cookieReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import {SSRProvider} from "react-bootstrap";
import { GoogleAnalytics } from "nextjs-google-analytics";

// init redux store
export const store = createStore(cookieReducer, composeWithDevTools(applyMiddleware(thunk)));

function MyApp({Component, pageProps}) {
    return (
        <SSRProvider>
            <Provider store={store}>
                <GoogleAnalytics trackPageViews gaMeasurementId={process.env.NEXT_PUBLIC_GA_MESSUREMENT_ID}/>
                <Component {...pageProps} />
            </Provider>
        </SSRProvider>
    );

}

export default MyApp
