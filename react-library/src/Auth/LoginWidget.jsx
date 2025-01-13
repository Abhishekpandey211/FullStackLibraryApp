import { Redirect } from 'react-router-dom';  // redirect is used to navigate the authenticated users to a specific page (like dashboard or / home )
import { useOktaAuth } from '@okta/okta-react'; //  useoktaauth is a hook provided by okta to make it easy login or logout
import { SpinnerLoading } from '../layouts/Utils/SpinnerLoading';  // is a loading animation that shows up while the app is checking or waiting for something like confirm if a user login it can load feel likes smoother.
import OktaSignInWidget from './OktaSignInWidget';  // okta sign widget is a component used that shows a login form provided by okta.
  
const LoginWidget = ({ config }) => {  // here login widget is a functional component which take config as a i/p config -> contains details like clent id or issuer 
    const { oktaAuth, authState } = useOktaAuth();   // okta auth ia manage authentictaion : 
    // like saves user tokens (ed. client id ) redirect them login or logout  authstate -> isquthenticated if the user login loading state 
    const onSuccess = (tokens)  => {
    oktaAuth.handleLoginRedirect(tokens);  // onsuccess is a function is used for user succesullfully login 
    
    };  
    // summary -> logininwidget component connect your app to okta 
    // manages user authentication , and redirect login - users to the correct page it uses okta auth for login / logout actions and authstate to check the login status 
 
    const onError = (err) => {  // onError function is a piece of code that handles during the signin process-> takes err as i/p somethinf taht happended 
        // during the login process (like wrong credentials or a network issue . )
        console.log('Sign in error: ', err); // itprint the error message to the cosole using cosole.log so you can see what went wromng 
    }

    if (!authState) { // authastate is undefined or null (maening the authentication state has not been loaded yet)
        return (
            <SpinnerLoading/> // if the suthentication state is not available the code will return and display the spinnerloading animation (like a spinning circle).
        );
    }

    return authState.isAuthenticated ?
    <Redirect to={{ pathname: '/' }}/>
    :
    <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError}/>;
};
 // the code checks to see if the user is already login 
 // if the user is authenticated (authstate.isauthenticated) is true:
 // redirect component is used to send the user to homepage('/')
 // authstate.isauthenticated is false :
 // The OktaSignInWidget component is displayed, showing the Okta login form.
 // congig(client id, issuer) onsuccess when the user successfully login
 // onError to handle any error that occur during login. 
export default LoginWidget;
// export default LoginWidget; means you're making the LoginWidget component available for use in other parts of your app, so other files can import and display it.