import { useEffect, useRef } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { oktaConfig } from '../lib/oktaConfig';
// useeffect is a hook in react that perform some actions like:-> changing the webpage , fetching data from server , listening events (like when a user clciks a button)
// okta sign widget javascript library used to display the login form 
// css for styling widget 
// okta config setting like client id, issuer  for connecting to your okta account 

const OktaSignInWidget = ({ onSuccess, onError }) => {
    const widgetRef = useRef();

    // OktaSignInWidget is react functional component that accepts 2 props: 
    // onsuccess : A function to handle successfully login 
    // on error : a "   to handle lofin error (invalid login).
    // 


    useEffect(() => {
        if (!widgetRef.current) {
            return;
        }

        const widget = new OktaSignIn(oktaConfig);

        widget.showSignInToGetTokens({
            el: widgetRef.current,
        }).then(onSuccess).catch(onError);

        return () => widget.remove();
    }, [onSuccess, onError]);

    return (
        <div className='container mt-5 mb-5'>
            <div ref={widgetRef}></div>
        </div>
    );
};

export default OktaSignInWidget;