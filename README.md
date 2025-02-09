Full stack Library Application 

Technologies used : 

Front-end:-

1. React
2. JavaScript
3. TypseScript
4. Bootatrap

Back-end:-

1. Java
2. Spring boot

IDE Used->

1. Vs Code (Front-end)
2. Intellij Idea (Back-end)

Authorization -> 

Okta is a identity and access management pltform that helps to manage user authentication and authorization securely. It acts like a gateway that ensuring only authorized user can access your application or services. 

In my project i used okta to handle user authentication because it provide a secure and scalable solution. It allowed me to implement features like single sign-on and multi factor authentication without writing to customer code saving time and improving security of the appplication. 


FrontEnd Part ->
Authorization -> Auth:-
LoginWidget.jsx

import { Redirect } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from '../layouts/Utils/SpinnerLoading';
import OktaSignInWidget from './OktaSignInWidget';

const LoginWidget = ({ config }) => {
    const { oktaAuth, authState } = useOktaAuth();
    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.log('Sign in error: ', err);
    }

    if (!authState) {
        return (
            <SpinnerLoading/>
        );
    }

    return authState.isAuthenticated ?
    <Redirect to={{ pathname: '/' }}/>
    :
    <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError}/>;
};

export default LoginWidget;

explanation of code -> 

Redirect: Used for navigation. It redirects authenticated users to a specified path (e.g., / in this case).
useOktaAuth: A hook provided by Okta for managing authentication state and interacting with Okta's APIs.
SpinnerLoading: A reusable component (likely a spinner/loader animation) shown while the app waits for authentication state to load.
OktaSignInWidget: A custom sign-in widget component that renders the Okta login form.


LoginWidget is a functional component that accepts config as a prop. config contains Okta configuration details like client ID, issuer, etc.


oktaAuth: An object with methods to manage authentication (e.g., handle login redirects, logout).
authState: Contains the user's current authentication status (isAuthenticated), whether it's loading, and tokens.


Called when the user successfully signs in.
handleLoginRedirect: Stores tokens and redirects the user after login.


Called when there's an error during login.
Logs the error details for debugging.


If authState is null or still loading, the app shows the spinner (SpinnerLoading) to indicate the user’s authentication status is being fetched.


Authenticated: If the user is logged in (authState.isAuthenticated is true), they are redirected to the root path (/).
Not Authenticated: If the user is not logged in, the OktaSignInWidget is rendered, allowing the user to log in. This widget uses:
config: Contains settings for the widget.
onSuccess: Handles successful login.
onError: Handles login errors.


Makes LoginWidget available for use in other parts of the application.

Work FLow Of Above Code -> 

Component → useOktaAuth checks the user's authentication state.
Loading State → If authState is null, show the spinner (SpinnerLoading).
Authenticated?
Yes → Redirect to the home page ('/').
No → Show the OktaSignInWidget for login.
Login Process:
Success → onSuccess processes tokens and redirects.
Error → onError logs the error.




OktaSigninWidget.jsx

import { useEffect, useRef } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { oktaConfig } from '../lib/oktaConfig';

const OktaSignInWidget = ({ onSuccess, onError }) => {
    const widgetRef = useRef();

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


explanation of code -> 
useeffect is used to handle side effect like (fetching data from API,  set up the event listers) etc 
useref creates a mutable reference (accessing and manipulating DOM elements).
okta sign widget javascript library used to display the login form 
css for styling widget 
okta config setting like client id, issuer  for connecting to your okta account 

 OktaSignInWidget is react functional component that accepts 2 props: 
 onsuccess : A function to handle successfully login 
 on error : a "   to handle login error (invalid login).
 widgetref is a reference varible <div> 

 it checks if the refernce DOM Element is available or not if not it stops the sexection.
 oktasign is a class and okta congig is a object 

 <div ref={widgetRef}></div> -> e1 specifies the DOM element 
  widget shows the user successfully login to get the token 
 if user arise error to catch handles any error during the login 

  remove the okta sign in widget from the DOM and stps the process 
  onsucces -> for successfully login , error-> error during the login

okta sign widget is loaded inside this div making the login form visible to users
export default means oktasignwidget is available to use other parts in the app 

Working of the Code:
When the OktaSignInWidget component is mounted, the useEffect hook runs.
The widgetRef is checked to ensure that the div where the widget will be rendered is available.
The OktaSignIn widget is instantiated with the oktaConfig object, which contains essential details for connecting to your Okta instance.
The showSignInToGetTokens method is called, rendering the Okta sign-in form inside the div referenced by widgetRef.
If the user logs in successfully, the onSuccess function is triggered with the authentication tokens; if there’s an error (like invalid login), the onError function is triggered.
When the component is unmounted, the widget.remove() method cleans up by removing the Okta widget from the DOM.


Layouts-> Bookcheckoutpage-> BookCheckOutPage.tsx

import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { ReviewModel } from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Check Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = http://localhost:8080/api/books/${bookId};

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(loadedBook);
            setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId};

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId};
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: Bearer ${authState.accessToken?.accessToken},
                        'Content-Type': 'application/json'
                    }
                };
                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error('Something went wrong');
                }
                const userReviewResponseJson = await userReview.json();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [authState]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = http://localhost:8080/api/books/secure/currentloans/count;
                const requestOptions = {
                    method: 'GET',
                    headers: { 
                        Authorization: Bearer ${authState.accessToken?.accessToken},
                        'Content-Type': 'application/json'
                     }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if (!currentLoansCountResponse.ok)  {
                    throw new Error('Something went wrong!');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId};
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: Bearer ${authState.accessToken?.accessToken},
                        'Content-Type': 'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url, requestOptions);

                if (!bookCheckedOut.ok) {
                    throw new Error('Something went wrong!');
                }

                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutResponseJson);
            }
            setIsLoadingBookCheckedOut(false);
        }
        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState]);

    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutBook() {
        const url = http://localhost:8080/api/books/secure/checkout?bookId=${book?.id};
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: Bearer ${authState?.accessToken?.accessToken},
                'Content-Type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCheckedOut(true);
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = http://localhost:8080/api/reviews/secure;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: Bearer ${authState?.accessToken?.accessToken},
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} 
                        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
                        checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center alighn-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} 
                    checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}

explanation of code : 

 book and review models define the structure of the data for books and reviews 
 component are spinner, stars, checkoutandreview box , latestreview handle ui.
 useoktaauth from the okta library for authentication 

 we declared a functional component 

 it contains authentication information such as whether the user is login .

 // state variable 
 isloading is the current value of the state (true/false) and setisloading is the function used to change the value of the isloading (eg. set it to false when loading is complete)
httperror stores the error message(any error occur),
sethttperror is the function used to set the error message when an error happens 

// Review State
initailize the reviews state an empty array of type reviewmodel
reviewmodel is likely a typescript interface or type that defines the structure of the reviews ( eg. reviewer name , rating , component ).
 how it works -> reviews holds the list of reviews fetched from server or api. 
setreviews -> function is used to update the list of reviews when reviews are fecthed . 
 initaialize the totalstars with the value 0 , holds the total no. of stars (sum of ratings) from all reviews. 
To store and manage the data for reviews dynamically in the component.
settotalstars is the function to update the value when reviews are added . 
To calculate and display the average rating or total stars based on reviews.
isloadingreview is initialize the stae true , is a flag that track the reviews are being fetch from the server 
setisloadingreview  is used to update this flag to false once the data is loaded 

usestae is a react hook that creates a state variable for functional component 
 a current value (isReviewLeft or isLoadingUserReview)
 a function update the value (setisreviewleft or setisloadingreview)
 isReviewLeft tracks if the user has already left a review. Initially, it’s set to false because we assume they haven’t.
 isLoadingUserReview tracks if the app is still fetching the user's review status. It starts as true to show the UI is in a "loading" state.

 // Loans count state 
 currentloanscount is a state variable is set to be initial value 0
 setcurrentloans count is a function used to update the value of currentloanscount (eg... when user borrews a book it increase the count)
isloadingcurrentlaonscount is initialized with the value true which means that initially the application is still laoding the data 
setisloadingcurrentloanscount is function is used to update the state of isloadingcurrentloans when the data is successfully loaded and flase when the data is laoding complete 

// Is Book check out ?

isCheckedOut is initialized with false because, by default, the book is not checked out.
setIsCheckedOut updates the state value to reflect whether the book is checked out or not.
isLoadingBookCheckedOut is initialized with true to show that the system is still loading or checking if the book is checked out.
setIsLoadingBookCheckedOut updates this loading state when the checking process is complete

const bookId = (window.location.pathname).split('/')[2];  -?

// USEEFFECT FOR FETCH BOOK 

useeffect hook with arrow function is fetching the book data from API
declare a fetchbook asynchronous function  because data fetching requires waiting for the API response.
constructs the API endpoint URL (book id is 1,2,3 dynamically inserted).
fetch function is used is used to fetch the HTTP reuest to the base url 
await keyword is used to wait for the server to respond before before moving to the next line 
the server reply(called the response ) is stored the response variable 
check if the response was unsuccessful (eg.  400 or 500 error).
if the response is not ok then throw an error with the message "Something went wrong!"
converts the servers reponse data into JSON  and await ensures the code waits for the conversion 

// USEEFFECT FOR FETCH BOOK REVIEW

fetch book reviews is a asunchronous function with useeffect 
review url passes the url fetch from the API
fetch function is used is used to fetch the HTTP reuest to the base url 
await keyword is used to wait for the server to respond before before moving to the next line 
the server reply(called the response ) is stored the response variable.
check if the response was unsuccessful (eg.  400 or 500 error).
if the response is not ok then throw an error with the message "Something went wrong!"
converts the servers reponse data into JSON  and await ensures the code waits for the conversion 
line extract the reviews from the response JSON. _embedded is a typically structure in restful ApI reviews hold the array object of review data 
initialize the empty array loaded reviews hold the object of reviewmodel.
initialize the weighted startreviews to 0.

 for each loop iterate over each key in responsedata and represent the properties 
 push the object  properties in loadedreview 
id property is passes the in responsedata key
useremail property is passes the in responsedata key
date property is passes in response data key
raring property is passes in response data key
book_id property is passes in response data key
 reviewDescription property is passes in response data key

this line add the rating of the current review (responsedata[key].rating) to the weighted reviews variables
this checks if loaded review is not null means available 
this line calculate the avarage star rating and rounds it to the nearest half star with one decimal place 
tofixed(1)-> format the result have one decimal place
math.round-> round the result to the nearest whole number
update the settotalstar with this number 
number(round) converts that string into a number 
This saves the fetched reviews (loadedReviews) into the reviews state so they can be shown on the page.
This tells the app that loading is done by setting the isLoadingReview state to false, so loading indicators (like spinners) can disappear
fetchreviewbook function catch the error the user trouble to sign invalid it shows error 
this stop the loading spinner.
this allow you to show an error message to the user 
this part means the code will run again whernever isreviewleft changes
if a user leaves a review the review will be fetched again 

USEEFFECT FOR FETCH USER REVIEW BOOK

useeffect hook 
asynchronus function this function will fetch the users review for a book
if the suthstate is exists and if the user is authenticated the code run
url for API request is constructed it uses the bookid and fetch the review 
it defines to set the requestoptions 
it specifies the HTTP method GET request, meaning the request retrieve the data from the server 
headers is the object is a collection of HTTP headers 
this is an authorization headers used for authentication the value is a bearer token 
 which is type of token used in authe tication . It allow the server to identify the user making the request. 
this is an Http headers used to specify the type of data being sent to the server.
application json is the value of content type header that the data sent is in the Json format. 

const userReview = await fetch(url, requestOptions); // This waits for the server's response to be pased the data as JSON and stores the result in userReviewResponseJson.
This checks if the userReview response is successful or not. The userReview.ok property is true
 if user is false then show the error 
if the response is successful. this line pass the JSON data returned by the server 
after passing the response this line update the state setisreviewleft with the data from the server (the user is review for the book).
This line sets the state isLoadingUserReview to false, which indicates that the process of fetching the review has finished
 This calls the fetchuserreview function and used .catch to handle any error that may occur during the execution of the function 
inside thecatch block that ensures that even if an error occur the loading state is set to false 
if an error occur this line sets the httperror state with the error message 
If authState changes (for example, when the user logs in or out, or when the authentication status changes), the useEffect hook will run again.

USEEFFECT FOR FETCH USER CURRENT LOANS COUNT 

 const fetchUserCurrentLoansCount = async () => it declares an asynchronous function named ftechusercureenrtloanscount
 if (authState && authState.isAuthenticated) it checks if the user is authenticated or not
 Sets the API URL where the loan count information is fetched
defines a request options for the fetch call 
method get : Http method used to retrieve data from the server 
${authState.accessToken?.accessToken}) to prove the user is authenticated.
'Content-Type': 'application/json' to indicate the type of data expected.
 Makes the API request using fetch and waits for the response
Checks if the response is not successful (ok is false).Throws an error if something went wrong.
Converts the response to JSON format.
Updates the state with the fetched loan count.
 Stops the loading state once the request completes.
  If the API request or the function throws an error, it is caught here.
 Stops the loading state even if there’s an error.
  sets the error message in the state 
  authstate represents the user authentication
 ischeked out for state variable indicate book has been checkout by user 

 USE EFFECT FOR FETCH USER CHECKED OUT BOOK

const fetchUserCurrentLoansCount = async () => it declares an asynchronous function named fetchusercheckoutbook
if (authState && authState.isAuthenticated) it checks if the user is authenticated or not
Sets the API URL where the loan count information is fetched
defines a request options for the fetch call
method get : Http method used to retrieve data from the server
${authState.accessToken?.accessToken}) to prove the user is authenticated.
'Content-Type': 'application/json' to indicate the type of data expected.
 Makes the API request using fetch and waits for the response
 Checks if the response is not successful (ok is false).Throws an error if something went
 Converts the response to JSON format.
   Updates the state with the fetched loan count.
  Stops the loading state once the request completes.
   If the API request or the function throws an error, it is caught here.
  Stops the loading state even if there’s an error.
  sets the error message in the state
  authstate represents the user authentication
  ischeked out for state variable indicate book has been checkout by user

This if statement checks if any of the loading states (isLoading, isLoadingReview, etc.) is true.
These variables likely come from component state (like useState
If any of these states are true, it returns a SpinnerLoading component.
This component is likely a custom component that displays a loading animation.
 This if statement checks if there is an http error 
httperror is a state variable it stores any error message form http request
if httperror exists it display a error meassage inside a <div>
bootstarp css  <div className='container m-5'> for layout margin
inside p message is display inside a <p> with the error meassage 


This synchroous function is used to check out a book.
url stores the endpoint of your backend API where the book checkout request is sent.
method: 'PUT': Specifies the HTTP method as PUT for updating data. headers: Defines the request headers
Authorization : adds a bearer token from the users authenctication state 
 Content-Type': 'application/json': Indicates the request body (if any) will be in JSON format.
fetch(url, requestOptions): Sends a request to the specified URL with the specified options.
 if (!checkoutResponse.ok): Checks if the response was successful (200-299). If
not, it throws an error.
setIsCheckedOut(true): Updates the state to indicate that the book has been checked out.
This function is called when the user clicks the "Check out" button.


This defines an asynchronous function named submitReview.
It takes two parameters: starInput and reviewDescription.
starInput: The number of stars the user wants to give the book.
 reviewDescription: The description of the review the user wants to leave.
Initializes a variable bookId of type number with an initial value of 0.
If the book object has an id property, it assigns that value to bookId.
Creates a new instance of the ReviewRequestModel class, passing in the starInput, book
Id, and reviewDescription as arguments.
The URL for the review endpoint is defined as a string variable named url.
The request options are defined as an object with the following properties:
method: 'POST': Specifies the HTTP method as POST for creating new data.
headers: Defines the request headers
Authorization : adds a bearer token from the users authenctication state
'Content-Type': 'application/json': Indicates the request body (if any) will be
in JSON format.
body: JSON.stringify(reviewRequestModel): Converts the reviewRequestModel object
into a JSON string and assigns it to the request body.
const returnResponse = await fetch(url, requestOptions): Sends a request to the
specified URL with the specified options.
if (!returnResponse.ok): Checks if the response was successful (200-299). If
not, it throws an error.
setIsReviewLeft(true): Updates the state to indicate that a review has been left.

    














CheckoutAndReviewBox.tsx

import { Link } from "react-router-dom"; 
import BookModel from "../../models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{ book: BookModel | undefined, mobile: boolean, 
    currentLoansCount: number, isAuthenticated: any, isCheckedOut: boolean, 
    checkoutBook: any, isReviewLeft: boolean, submitReview: any }> = (props) => {
   
    function buttonRender() {
        if (props.isAuthenticated) {
            if (!props.isCheckedOut && props.currentLoansCount < 5) {
                return (<button onClick={() => props.checkoutBook()} className='btn btn-success btn-lg'>Checkout</button>)
            } else if (props.isCheckedOut) {
                return (<p><b>Book checked out. Enjoy!</b></p>)
            } else if (!props.isCheckedOut) {
                return (<p className='text-danger'>Too many books checked out.</p>)
            }
        }
        return (<Link to={'/login'} className='btn btn-success btn-lg'>Sign in</Link>)
    }
    
    function reviewRender() {
        if (props.isAuthenticated && !props.isReviewLeft) {
            return(
            <p>
                <LeaveAReview submitReview={props.submitReview}/>
            </p>
            )
        } else if (props.isAuthenticated && props.isReviewLeft) {
            return(
            <p>
                <b>Thank you for your review!</b>
            </p>
            )
        }
        return (
        <div>
            <hr/>
            <p>Sign in to be able to leave a review.</p>
        </div>
        )
    }
    
    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>{props.currentLoansCount}/5 </b>
                        books checked out
                    </p>
                    <hr />
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className='text-success'>
                            Available
                        </h4>
                        :
                        <h4 className='text-danger'>
                            Wait List
                        </h4>
                    }
                    <div className='row'>
                        <p className='col-6 lead'>
                            <b>{props.book?.copies} </b>
                            copies
                        </p>
                        <p className='col-6 lead'>
                            <b>{props.book?.copiesAvailable} </b>
                            available
                        </p>
                    </div>
                </div>
                {buttonRender()}
                <hr />
                <p className='mt-3'>
                    This number can change until placing order has been complete.
                </p>
                {reviewRender()}
            </div>
        </div>
    );
}

explanation of above code -> 

link used for navigation to the login page 
typescript book structure 
a component that allow users to submit review 
book: The selected book (or undefined if not loaded).
mobile: A boolean to adjust the layout for mobile devices.
currentLoansCount: Number of books the user has checked out.
isAuthenticated: Indicates if the user is logged in.
isCheckedOut: Indicates if this book is already checked out by the user.
checkoutBook: Function to checkout the book.
isReviewLeft: Indicates if the user has already left a review.
submitReview: Function to submit a review.

If the user is logged in:
If the book is not checked out and the user has checked out fewer than 5 books, show the "Checkout" button.
If the book is already checked out, show "Book checked out. Enjoy!".
 If the user has checked out 5 or more books, show "Too many books checked out" in red.
If the user is not logged in, show a "Sign in" button linking to the login page.

If the user is logged in and hasn't reviewed the book, show the LeaveAReview component.
If the user is logged in and has already reviewed, show "Thank you for your review!".
if the user is not logged in, prompt them to sign in to leave a review.
Layout changes based on the mobile prop for responsive design.
Displays how many books the user has checked out (e.g., 2/5).
Shows if the book is Available (in green) or on the Wait List (in red).
Shows the total copies and available copies of the book.
Calls buttonRender() to show the correct checkout button or message.
Calls reviewRender() to handle the review section.


Work flow of above code->

If the user is login(authenticated) 
If the book is not checked out and the user has fewer than 5 checked-out books, a "Checkout" button is shown.
If the book is already checked out, a message saying "Book checked out. Enjoy!" appears.
If the user has checked out 5 or more books, it shows "Too many books checked out."
If the user is not logged in, a "Sign in" button linking to the login page is shown.
Review Section : If the user is logged in and hasn't left a review, the LeaveAReview component is shown to allow submitting a review.
If the user has already reviewed the book, a "Thank you for your review!" message is shown.
If the user is not logged in, a prompt to sign in before leaving a review is displayed.
Book Availability : The component shows whether the book is Available (if copies are available) or on the Wait List (if no copies are available), along with the number of copies and available copies.
Responsive Layout : The layout adjusts based on the mobile prop to ensure the design is responsive for both mobile and desktop views.


LatestReview.tsx-> 


import { Link } from "react-router-dom";  
import { Review } from "../Utils/Review"; 
import { ReviewModel } from "../../models/ReviewModel";


export const LatestReviews: React.FC<{
    reviews: ReviewModel[], bookId: number | undefined, mobile: boolean
}> = (props) => { // Latest review is a functional component 

    return (
        <div className={props.mobile ? 'mt-3' : 'row mt-5'}>  
            <div className={props.mobile ? '' : 'col-sm-2 col-md-2'}>
                <h2>Latest Reviews: </h2>
            </div>

            <div className='col-sm-10 col-md-10'>
                {props.reviews.length > 0 ?
                    <>
                        {props.reviews.slice(0, 3).map(eachReview => (
                            <Review review={eachReview} key={eachReview.id}></Review>
                        ))}

                        <div className='m-3'>
                            <Link type='button' className='btn main-color btn-md text-white'
                                to={`/reviewlist/${props.bookId}`}>
                                Reach all reviews.
                            </Link>
                        </div>
                    </>
                    :
                    <div className='m-3'>
                        <p className='lead'>
                            Currently there are no reviews for this book
                        </p>
                    </div>
                }
            </div>
        </div>


explanation of this code->

Link: Used for navigation between pages without refreshing the browser. 
Review: A component that displays a single review.
ReviewModel: A TypeScript model that defines the structure of a review (e.g., id, content, author).
Latest review is a functional component 
Props received by this component:
reviews: An array of reviews (ReviewModel[]).
bookId: The ID of the book (used for navigation).
mobile: A boolean that checks if the user is on a mobile device (for styling).

If mobile is true, it adds a small top margin (mt-3).
If not, it uses Bootstrap classes for a larger layout (row mt-5).
Shows the title "Latest Reviews:".
If not on mobile, it takes up 2 columns in the grid (col-sm-2).
It takes the first 3 reviews (slice(0, 3)).
Each review is passed to the Review component.
key eachReview.uniquely identifies each review (important for performance).
Button that navigates to a page showing all reviews for the book.
The link leads to /reviewlist/{bookId} (e.g., /reviewlist/5).

work flow of this code-> 

Props: It receives reviews (an array of reviews), bookId (used for navigation), and mobile (a boolean for layout adjustments).

Layout:

If mobile is true, it adds a small margin for mobile screens.
If mobile is false, it uses a larger layout with Bootstrap classes for desktop screens.
Displaying Reviews:

It shows the title "Latest Reviews:", slices the first 3 reviews, and displays them using the Review component with unique keys for each review.
Navigation:

It includes a button that links to /reviewlist/{bookId} to view all reviews for the book.

ReviewListPage -> ReviewListPage.tsx

import { useEffect, useState } from 'react';
import { ReviewModel } from "../../../models/ReviewModel";
import { Pagination } from '../../Utils/Pagination';
import { Review } from '../../Utils/Review';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Book to lookup reviews
    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBookReviewsData = async () => {

            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].book_id,
                    reviewDescription: responseData[key].reviewDescription,
                });
            }

            setReviews(loadedReviews);
            setIsLoading(false);
        };
        fetchBookReviewsData().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }


    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? 
            reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div className="container mt-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id} />
                ))}
            </div>

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}

explanation of the code-> 

reviewlistpage with arraw function 
reviews: Stores fetched review data.
isLoading: Indicates if data is being loaded (true by default).
httpError: Captures any errors during data fetching.
currentPage: Tracks the current page number.
reviewsPerPage: Number of reviews shown per page (fixed at 5).
totalAmountOfReviews: Total number of reviews fetched.
totalPages: Total number of pages available

// Book to lookup reviews

Extracts the book ID from the URL. Example: /books/123 → bookId = 123.
bookId: The ID of the book for which reviews are being fetched.
runs the currentpage function 
Builds the API URL to fetch reviews for a specific book, using pagination.
purpose sends a get request to the api url(review url) to fetch review. 
await : waits for the server to rspond before moving to the next line 
responsereview : stores the servers reponse 
check if the response status successfully response
if the response is not okay it throws a message 
converts the raw response into a JSON Objects 
Purpose: Accesses the list of reviews in the _embedded object returned by the API.
responseData: Now holds the array of reviews.
totalElements: Total number of reviews for the book.
totalPages: Total number of available pages based on reviewsPerPage.
State Updates: These values are stored in state for pagination control.
Updates the total amount of reviews and total pages based on the API response.
initailize the empty array loadedreviews to store the review data 
Loop: Iterates over each review in responseData.
Push: Formats the data into ReviewModel objects and adds them to loadedReviews.
Fields Included:
id: Review ID
userEmail: Email of the user who wrote the review
date: Date when the review was submitted
rating: Rating given to the book
book_id: ID of the book being reviewed
reviewDescription: Text content of the review
setreviews  show the new loadedreviews into the review state
hide the loading spinner b/c the data has been succesfully fetched 
Error Catching: If anything goes wrong in fetchBookReviewsData, this .catch() block runs.
setIsLoading(false): Stops the loading spinner.
setHttpError(error.message): Saves the error message in httpError to inform the user.
Dependency: Runs fetchBookReviewsData every time currentPage changes (for pagination).
Effect: Clicking on a different page in pagination fetches new reviews.
 shows a loading spinner while fetching the data 
displays an error message if the data fetching failse.
reviewsPerPage: The number of reviews to show per page (set to 5).
f currentPage = 2 and reviewsPerPage = 5: -> 2*5 = 10
Purpose: Determines the position of the last review on the current page.
IOLR = 10 RPP = 5 -> 10 -5 = 5 
Purpose: Finds the position of the first review on the current page
If the last item (reviewsPerPage * currentPage) is less than or equal to the total reviews, use that value.
Otherwise, use totalAmountOfReviews to prevent overflow
Case 1: currentPage = 3, reviewsPerPage = 5, totalAmountOfReviews = 12
5 * 3 = 15 → Exceeds 12, so lastItem = 12.
Case 2: currentPage = 2, 5 * 2 = 10 → Within range, so lastItem = 10.
Purpose: Ensures the UI displays the correct "last item number" without exceeding the total number of reviews.
Takes in pageNumber and updates currentPage with setCurrentPage.
Purpose: Updates the currentPage state when the user clicks a pagination button
Displays the heading "Comments:" followed by the number of reviews currently loaded.
reviews.length dynamically shows how many reviews are displayed on the page
Shows the range of reviews currently displayed.
indexOfFirstReview + 1 → The starting review number on the current page.
lastItem → The last review number displayed on the current page.
totalAmountOfReviews → The total number of reviews in the database.
row: A Bootstrap class for creating a horizontal grid layout.
reviews.map(): Loops through the reviews array and displays each review.
<Review review={review} />: Renders each review using the Review component.
key={review.id}: Provides a unique key (React requires this for performance optimization
Condition: Only shows the Pagination component if there’s more than 1 page (totalPages > 1).
Pagination Component: Renders page numbers/buttons for navigation.
Props Passed:
currentPage: Current active page.
totalPages: Total number of pages.
paginate: Function to change the current page when a user clicks a page button.


HomePage -> HomePage.tsx


import { Carousel } from "./components/Carousel";
import { ExploreTopBooks } from "./components/ExploreTopBooks";
import { Heros } from "./components/Heros";
import { LibraryServices } from "./components/LibraryServices";

export const HomePage = () => {
    return(
        <>
           <ExploreTopBooks/>
           <Carousel/>
           <Heros/>
           <LibraryServices/>
        </>
    );
}


explanation of the code-> 

This line imports the Carousel component from the components folder
This imports the ExploreTopBooks component, which probably shows a list or section for the top books available in the library.
This imports the Heros component. This could be a section with banners or highlighted content,
This imports the LibraryServices component, which might explain the different services the library offers (like borrowing, reading rooms, etc.).
function react component called homepage The export keyword makes the component is available to be used on other APP
{<ExploreTopBooks/> displays the top books section.
<Carousel/> displays a rotating slideshow or image carousel.
<Heros/> shows highlighted content or promotional banners.
<LibraryServices/> shows the library's services.

HomePage -> components -> Carousel.tsx

import { ReturnBook } from "./ReturnBook";
import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const Carousel = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const booksPerSlide = 3; // Adjust this to show more/less books per carousel slide

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl = "http://localhost:8080/api/books";
            const url = `${baseUrl}?page=0&size=9`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    const errorDetails = `Error ${response.status}: ${response.statusText}`;
                    throw new Error(`Failed to fetch books. ${errorDetails}`);
                }

                const responseJson = await response.json();
                const responseData = responseJson._embedded?.books || [];

                const loadedBooks: BookModel[] = responseData.map((book: any) => ({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    description: book.description,
                    copies: book.copies,
                    copiesAvailable: book.copiesAvailable,
                    category: book.category,
                    img: book.img,
                }));

                setBooks(loadedBooks);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message || "Something went wrong while fetching books.");
            }
        };

        fetchBooks();
    }, []);

    if (isLoading) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p className="alert alert-danger">{httpError}</p>
                <p>Please try again later or contact support if the issue persists.</p>
            </div>
        );
    }

    const renderSlides = () => {
        const slides = [];
        for (let i = 0; i < books.length; i += booksPerSlide) {
            slides.push(
                <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
                    <div className="row d-flex justify-content-center align-items-center">
                        {books.slice(i, i + booksPerSlide).map((book) => (
                            <ReturnBook book={book} key={book.id} />
                        ))}
                    </div>
                </div>
            );
        }
        return slides;
    };

    return (
        <div className="container mt-5" style={{ height: 550 }}>
            <div className="homepage-carousel-title">
                <h3>Find your next "I stayed up too late reading" book.</h3>
            </div>
            <div
                id="carouselExampleControls"
                className="carousel carousel-dark slide mt-5 d-none d-lg-block"
                data-bs-interval="false"
            >
                {/* Desktop Carousel */}
                <div className="carousel-inner">{renderSlides()}</div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleControls"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleControls"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Mobile View */}
            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    {books.length > 0 ? (
                        <ReturnBook book={books[0]} key={books[0].id} />
                    ) : (
                        <p>No books available.</p>
                    )}
                </div>
            </div>
            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to="/search">
                    View More
                </Link>
            </div>
        </div>
    );
};

explanation of this code -> 

ReturnBook: A component that displays individual book details.
useEffect & useState: React hooks to manage side effects (like data fetching) and component state.
BookModel: A model that defines the structure of a book object.
SpinnerLoading: A component that shows a loading spinner while data is being fetched.
Link: Used for navigation between pages without reloading the app.
books: Stores the fetched books. Starts as an empty array.
isLoading: Tracks if the data is still loading. Starts as true.
httpError: Stores error messages if fetching fails. Starts as null.
booksPerSlide: Defines how many books to show per carousel slide (3 in this case).
Runs when the component ([] dependency).
fetchBooks function fetches the first 9 books from the backend.
Sends a GET request to the backend API.
If the response is not OK (e.g., 404 or 500 error), it throws an error.
Converts the response into JSON format.
Extracts the list of books (_embedded.books).

After formatting the data, the loadedBooks array is stored in the component state using the setBooks function. 
This updates a loading state variable (also managed by useState) to false
If something goes wrong during the data fetching or processing, the code inside this block runs.
if an error occur it ensures the loading spinner is turned off isloading false
httperror function stores the error message in the component state. if no error message is provided 
Calls fetchBooks() once when the component loads.
dependency arrray with useeffect it fetches the data From api.
While Loading: Shows a spinner.
On Error: Displays the error message.
renderSlides: Divides books into groups of 3 and creates a carousel slide for each group.
The first slide is marked as active.
for mobile view it shows the first book is not empty using the return book component 
if no books available it displays no books available . 

// WORK FLOW SUMMARY
Step 1: Component initializes states (books, isLoading, httpError).
Step 2: useEffect triggers fetchBooks to fetch data from the backend API.
If successful, books are stored in the books state, and isLoading is set to false.
If there’s an error, isLoading is set to false, and the error message is stored in httpError.
Step 3: Component renders based on states:
Loading: Shows the SpinnerLoading component.
Error: Displays the error message.
Data Loaded: Groups the books into slides and displays them in a carousel.
Step 4: For mobile view, displays only the first book or a "No books available" message if there are no books.

ExploreTopBooks.tsx->

import { Link } from "react-router-dom";

export const ExploreTopBooks = () => {
    return(
        <div className='p-5 mb-4 bg-dark header'>
            <div className='container-fluid py-5 text-white
            d-flex justify-content-center align-items-center'>
                <div>
                    <h1 className='display-4 fw-bold'>Find your next adventure</h1>
                    <p className='col-md-8 fs-4'>Where would you like to go next?</p>
                    <Link type='button' className='btn main-color btn-lg text-white' to='/search'>Explore Top Books</Link>
                </div>
            </div>
        </div>
    );
}

Link -> It provides client side navigation, allow you to navigate to different routes without refreshing the broweser 
ExploreTopBooks -> is a FC exported for use inother parts of the app
it return the jsx that describe the structure of the hero section 
h1 heading shows and p for paragraph 

Heroes.tsx

import { useOktaAuth } from "@okta/okta-react";  
import { Link } from "react-router-dom";

export const Heros = () => {
  const { authState } = useOktaAuth();    
  return (
    <div>
      <div className="d-none d-lg-block">
        <div className="row g-0 mt-5">
          <div className="col-sm-6 col-md-6">
            <div className="col-image-left"></div>
          </div>
          <div className="col-4 col-md-4 container d-flex justify-content-center align-items-center">
            <div className="m1-2">
              <h1>What Have you been reading?</h1>
              <p className="lead">
              The library team would love to know what you have been reading.
              Whether it is to learn a new skill or grow within one,
              we will be able to provide the top content for you!
              </p>
              {authState?.isAuthenticated ?
               <Link type="button" className="btn main-color btn-lg text-white"
               to="search">Explore top books</Link> 
               :
               <Link className="btn main-color btn-lg text-white" to="/login">
                Sign Up
              </Link> 

              }
              
            </div>
          </div>
        </div>
        <div className="row g-0">
          <div
            className="col-4 col-md-4 container d-flex
                justify-content-center align-items-center"
          >
            <div className="m1-2">
              <h1>Our Collection is Always Changing!</h1>
              <p className="lead">
                Try to check as our daily collection is always changing! we work
                nonstop to provide the most accurate book selection possible For
                our Luv 2 code students! We are diligent about our book
                selection and our book is always going too our priority
              </p>
            </div>
          </div>
          <div className="col-sm-6 col-md-6">
            <div className="col-image-right"></div>
          </div>
        </div>
      </div>
      {/* mobile heros */}
      <div className="d-lg-none">
        <div className="container">
            <div className="m-2">
                <div className="col-image-left"></div>
                <div className="mt-2">
                <h1>What Have you been reading?</h1>
              <p className="lead">
                The Library team would love to know What you have been reading
                whether it is to learn new skills or grow within one, We will be
                able to provide the top content for you
              </p>
              {authState?.isAuthenticated ?
              <Link type="button" className="btn main-color btn-lg text-white"
              to="search">Explore Top Books</Link>
              :
              <Link className="btn main-color btn-lg text-white" to="/login">
              Sign Up
            </Link>

              }
          
                </div>
            </div>
            <div className="m-2">
                <div className="col-image-right"></div>
                <div className="mt-2">
                <h1>Our Collection is Always Changing!</h1>
              <p className="lead">
                Try to check as our daily collection is always changing! we work
                nonstop to provide the most accurate book selection possible For
                our Luv 2 code students! We are diligent about our book
                selection and our book selection and our book is always going
                too our priority
              </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

Explanation of this code ->

depencies it used to access authenticated user 
Link component is to create  navigation link for routing with in the app
The Heroes component is used another part in the app
authstate is check for authenticated user / check the status 
It shows for the Dekstop view for larger scrren and small screen for mobile views 
If user is authenticated user is true then it shows a button "Explore Top Book" and if the user is not login It shows a "Sign Up" button


LibraryServices.tsx->

import { useOktaAuth } from "@okta/okta-react";
import { Link } from "react-router-dom";

export const LibraryServices = () => {
    const { authState} = useOktaAuth();
    return(
        <div className="container my-5">
            <div className="row p-4 align-items-center border shadow-lg">
                <div className="col-lg-7 p-3">
                    <h1 className="display-4 fw-bold">
                       We Can't What are you looking for?
                    </h1>
                    <p className="lead">
                        If you cannot find what are looking for,
                        send our Library admin's a personal message!
                    </p>
                    <div className="d-grid gap-2 justify-content-md-start mb-4 mb-lg-3">
                        {authState?.isAuthenticated ? 
                        <Link to="/messages" type="button" className="btn main-color btn-lg px-4 me-md-2 fw-bold text-white">
                            Library Services
                            </Link>
                            :

                             <Link className="btn main-color btn-lg text-white" to="/login">
                            Sign Up
                            </Link>

                        }
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 shadow-lg lost-image"></div>
            </div>
        </div>
    );
}

explanation of the code-> 

USeOkta Auth : A hook is provide authentication details about the current user 
Link : A Component that create a link to navigate b/w pages. 
USeoktaAuth : Retrieves the current authentication state (eg., is the user login or logout)
authState?.isAuthenticated: This checks whether the user is authenticated(login in).
if the user is successfully login they see the "Library Services" button.
if not login they see the "Sign Up" button.

ReturnBook.tsx-> 

import React from "react";
import BookModel from "../../../models/BookModel";
import { Link } from "react-router-dom";

export const ReturnBook: React.FC<{book: BookModel}> = (props) => {
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                {props.book.img?
                    <img
                        src={props.book.img}
                        width='151'
                        height='233'
                        alt="book"
                    />
                    :
                    <img
                        src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                        width='151'
                        height='233'
                        alt="book"
                  />
                }
                
                <h6 className='mt-2'>{props.book.title}</h6>
                <p>{props.book.author}</p>
                <Link className='btn main-color text-white' to={`checkout/${props.book.id}`}>Reserve</Link>
            </div>
        </div>
    );
};

explanation the code -> 

React : This line imports the react library, which is essential for creating react component. It allow you to use (JSX)
BookModel : BookModel is likely a typescript interface or class that define the structure of the BookModel
Link : is used to navigate a different Pages in a react Apllication without reloading the page 
export : This line declare a FC (ReturnBook).
Takes a sinlge props : an Object type of BookModel
And Also can be used to another part of the application 

ManageLibraryPage -> ManageLibraryPage.tsx

import { useOktaAuth } from "@okta/okta-react"
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () => {

    const { authState } = useOktaAuth();

    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    function addBookClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
    }

    function changeQuantityOfBooksClickFunction(){
        setChangeQuantityOfBooksClick(true);
        setMessagesClick(false);
    }

    function messagesClickFucntion(){
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(true);
    }

    if(authState?.accessToken?.claims.userType === undefined){
        return <Redirect to='/home'/>
    }

    return(
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tabs" role="tablist">
                        <button onClick={addBookClickFunction} className="nav-link active" id="nav-add-book-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-add-book" type="button" role="tab" aria-controls="nav-add-book"
                            aria-selected="false">
                            Add new book
                        </button>
                        <button onClick={changeQuantityOfBooksClickFunction} className="nav-link" id="nav-quantity-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-quantity" type="button" role="tab" aria-controls="nav-quantity"
                            aria-selected="true">
                           Change Quantity
                        </button>
                        <button onClick={messagesClickFucntion} className="nav-link" id="nav-messages-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages"
                            aria-selected="false">
                            Messages
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel"
                       aria-labelledby="nav-add-book-tab">
                       <AddNewBook/>
                    </div>
                    <div className="tab-pane fade" id="nav-quantity" role="tabpanel" aria-labelledby="nav-quantity-tab">
                       {changeQuantityOfBooksClick ? <ChangeQuantityOfBooks/> : <></>}
                    </div>
                    <div className="tab-pane fade" id="nav-messages" role="tabpanel" aria-labelledby="nav-messages-tab">
                        {messagesClick ? <AdminMessages/> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}

explanation of the code -> 
Add New Book: Lets admins add new books to the library.
Change Quantity: Allows admins to adjust the number of copies for existing books.
Messages: Displays admin messages.

useoktauth to get the users authentication state(authstate). 
usestate : ChangequnatityofBooksClick -> Tru if the "Change Qunatity" tab is selected
messageClick : True if the "Message " tab is selected 

addBookClickFunction: Resets all states so only the "Add New Book" tab is active.
changeQuantityOfBooksClickFunction: Activates the "Change Quantity" tab by setting changeQuantityOfBooksClick to true.
messagesClickFucntion: Activates the "Messages" tab by setting messagesClick to true
checks if the login user has a usertype claims in their token 
if not it redirect them to the /home page 

h3 tag display the title  "MAnage Library".
navigation bar : contains buttons representing different tabs 
Add New Book , Change Quantity, Messages
These buttons are part of a bootstrap tabs 
Event handlers : onclcik attribute to trigger a function when clicked 
addBookClickFunction: For adding a new book.
changeQuantityOfBooksClickFunction: For changing the quantity of books.
messagesClickFucntion: For accessing the messages.
<AddNewBook/> : This is always displayed the "Add new BOok " tab is clciked 
<ChangeQuantityOfBooks/>  : is true it shows the oomponent otherwise it shows an empty fragement <></>
<AdminMessages/> Conditionally based on the state variable if messageClick is true it show the component MESSAGECLICK

components ->  AddNewBooks.tsx


import { useOktaAuth } from "@okta/okta-react";  
import { useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";

export const AddNewBook = () => { // Defines the AddNewBook component.

    const { authState } = useOktaAuth();

    //Add New Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    
    function categoryField(value: string){  
        setCategory(value); 
    }

    async function base64ConversionForImages(e: any) {
       if(e.target.files[0]){
        getBase64(e.target.files[0]);
       } 

        }

    function getBase64(file: any){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setSelectedImage(reader.result);
        };
        reader.onerror= function (error){
            console.log('Error',error);
        }
    }

    async function submitNewBook() {
    const url = `http://localhost:8080/api/admin/secure/add/book`;
    if(authState?.isAuthenticated && title !== '' && author !== '' && category !== 'Category'
        && description !== '' && copies >= 0){
            const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
            book.img = selectedImage;
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book)
            };

            const submitNewBookResponse = await fetch(url, requestOptions);
            if(!submitNewBookResponse.ok){
                throw new Error('Something went wrong!');
            }
            setTitle('');
            setAuthor('');
            setDescription('');
            setCopies(0);
            setCategory('Category');
            setSelectedImage(null);
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
   }

   return(
        <div className="container mt-5 mb-5">
            {displaySuccess && 
               <div className="alert alert-success" role="alert">
                  Book Added Successfully
               </div>
            }
            {displayWarning && 
               <div className="alert alert-danger" role="alert">
                All fields must be filled out 
               </div>
             }
             <div className="card">
                <div className="card-header">
                    Add a new Book
                </div>
                <div className="card-body">
                    <form method="POST">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" name="title" required
                                    onChange={e => setTitle(e.target.value)} value={title}/>
                            </div>
                            <div className="col-md-3 mb-3">
                               <label className="form-label">Author</label>
                               <input type="test" className="form-control" name="author" required
                                   onChange={e => setAuthor(e.target.value)} value={author}/>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Category</label>
                                <button className="form-control btn btn-secondary dropdown-toggle" type="button"
                                  id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {category}
                                  </button>
                                  <ul id="addNewBookId" className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a onClick={() => categoryField('FE')} className="dropdown-item">Front End</a></li>
                                    <li><a onClick={() => categoryField('BE')} className="dropdown-item">Back End</a></li>
                                    <li><a onClick={() => categoryField('Data')} className="dropdown-item">Data</a></li>
                                    <li><a onClick={() => categoryField('DevOps')} className="dropdown-item">DevOps</a></li>
                                  </ul>
                            </div>
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}
                               onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Copies</label>
                            <input type="number" className="form-control" name="Copies" required
                               onChange={e => setCopies(Number(e.target.value))} value={copies}/>
                        </div>
                        <input type="file" onChange={e => base64ConversionForImages(e)}/>
                        <div>
                            <button type="button" className="btn btn-primary mt-3" onClick={submitNewBook}>
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
             </div>
        </div>
    );
}


explanation of the code ->

useOktaAuth: Hook from Okta React SDK to manage user authentication.
useState: React hook to manage component state.
AddBookRequest: A custom model for book data structure.
Defines the AddNewBook component.
authState: Holds the authentication status and access token from Okta.
title, author, description, copies, category, and selectedImage: State variables for form input values.
displayWarning and displaySuccess: Control success/warning message displays.
A function named categoryField is declared.
It takes one argument value, which must be a string
This line calls a function named setCategory, passing the value as an argument.
base64ConversionForImages  passes with event parameter 
base64ConversionForImages  : -  Converting an image to Base64 is useful when: ->  You want to store or transfer image data as a string.
console.log(e);
this functionn accept getbase 64 accept a parameter called file
getBase64 function is used to convert the selected image to base64 format
this creates a new filereader object filereader is used to read file content and convert it into different fromats (like base 64)
this tells the reader to read the file as a dataurl 
 when file successfully read the onload event 
reader.result contains the base 64 string of the file 
setSelectedImage(reader.result); stores the base64 string in a state or varible (assuming setSelectedImage is a React state setter function).
asynchronous function submitNewBook.async keyword allows the use of await inside the function to handle asynchronus function 
Defines the API endpoint URL where the book data will be sent via a POST request.
check if the user is authenticated Title, author, description fields are not empty, and the category isn't set to its default placeholder ('Category').
Copies count is a non-negative number (copies >= 0).
Creates a new instance of the AddBookRequest class using user-provided data (title, author, etc.).
Sets an optional img property to store the selected image.
Defines the request options for the API call:
 method: 'POST' specifies the HTTP method.
headers includes:
Authorization: Adds a Bearer token for secure access.
 Content-Type: Indicates that the request body is in JSON format.
body: Contains the serialized book data as a JSON string.
Sends the request to the API and waits (await) for the response.
Checks if the request was unsuccessful.If so, throws an error with the message 'Something went wrong!'.
Clears all form fields (title, author, etc.).Hides the warning message and displays the success message.
If any validation condition fails, it shows a warning message (setDisplayWarning(true)) and hides the success message.

AdminMessage.tsx->

import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const AdminMessage: React.FC<{ message: MessageModel, 
    submitResponseToQuestion: any }> = (props, key) => {

    const [displayWarning, setDisplayWarning] = useState(false);
    const [response, setResponse] = useState('');

    function submitBtn() {
        if (props.message.id !== null && response !== '') {
            props.submitResponseToQuestion(props.message.id, response);
            setDisplayWarning(false);
        } else {
            setDisplayWarning(true);
        }
    }

    return (
        <div key={props.message.id}>
            <div className='card mt-2 shadow p-3 bg-body rounded'>
                <h5>Case #{props.message.id}: {props.message.title}</h5>
                <h6>{props.message.userEmail}</h6>
                <p>{props.message.question}</p>
                <hr/>
                <div>
                    <h5>Response: </h5>
                    <form action="PUT">
                        {displayWarning && 
                            <div className='alert alert-danger' role='alert'>
                                All fields must be filled out.
                            </div>
                        }
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'> Description </label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3} 
                                onChange={e => setResponse(e.target.value)} value={response}></textarea>
                        </div>
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitBtn}>
                                Submit Response
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

explanation of this code -> 

useState is imported from React to manage component state.
MessageModel is imported from a local file, likely defining the structure of message data.
declares a functional components AdminMessage using typescript type annotation 
message: MessageModel: A message object of type MessageModel.
submitResponseToQuestion: any: A function to handle the response submission (typed as any for flexibility).
props holds these passed properties.
displayWarning: Manages whether a warning message should be displayed (false by default).
response: Holds the value of the user’s response ('' initially).
submit button handler clicks the submit button
if the message has an id and the response is not null / empty
it calls the submitResponseToQuestion function with the message id and response
Hides the warning message.
Otherwise, displays the warning message by setting displayWarning to true.
the message card inside a div, using props.message.id as a unique key.
Defines a card layout for the message display using Bootstrap classes.
Displays the message title, user email, and question.
A horizontal line is added to separate the message from the response section.
The response section includes a form with a textarea for the user to input their response.
The form includes a submit button to submit the response.

AdminMessages.tsx -> 

import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import AdminMessageRequest from '../../../models/AdminMessageRequest';
import MessageModel from '../../../models/MessageModel';
import { Pagination } from '../../Utils/Pagination';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { AdminMessage } from './AdminMessage';

export const AdminMessages = () => {
    
    const { authState } = useOktaAuth();

    // Normal Loading Pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);
    
    // Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const messagesResponseJson = await messagesResponse.json();

                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, currentPage, btnSubmit]);

    if (isLoadingMessages) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }


    async function submitResponseToQuestion(id: number, response: string) {
        const url = `http://localhost:8080/api/messages/secure/admin/message`;
        if (authState && authState?.isAuthenticated && id !== null && response !== '') {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            };

            const messageAdminRequestModelResponse = await fetch(url, requestOptions);
            if (!messageAdminRequestModelResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-3'>
            {messages.length > 0 ? 
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}/>
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}

explanation of this code -> 

useOktaAuth hook from the @okta/okta-react package, which is used to handle authentication-
related tasks, such as checking the user's authentication status and logging out.
useEffect allows you to run code at specific points in a component’s lifecycle 
useState is used to create and manage state variables in a functional component.
AdminMessageRequest might define the structure for sending requests to an API for admin messages.
MessageModel could represent the structure of a message, like its content, sender, or timestamp
Pagination: A utility component for dividing large datasets into pages and navigating between them.
SpinnerLoading: Likely a component for showing a loading spinner during data fetch operations.
AdminMessage: A custom component to display individual admin messages.

This line defines and exports a React functional component called AdminMessages
This line uses the useOktaAuth hook from the Okta library to get the user's authentication state. The authState object contains information about whether the user is authenticated.
this initailize a state variable isloadingmeassages with the value true indicates that messages is loaded 
setisloading is the function used to update this state 
httpError with the value null 
sethttperror upadtes this error state 
message initialized an empthy array the type messagesmodel[] objects
setmessages update this state with the fetched messages
messagesperpage is set to 5, which likely defines how many ,essages to display per page
currentpage with the value 1 representing the current page number in pagination
setcurrent page updates this state.
totalpages with the value 0 representing the total number of pages avalialble for the ,essahes
settotalpage updates this state 

Defines an asynchronous function named fetchUserMessages to fetch user messages from the backend.
Ensures that the user is authenticated by checking authState and authState.isAuthenticated before fetching data.
Constructs the API URL dynamically based on the current page and number of messages per page.
Defines requestOptions for the API request:
Uses the GET method.
 Sets Authorization with a Bearer token (from authState.accessToken) to authenticate the request.
Specifies the content type as JSON.
Sends an asynchronous fetch request to the given URL with the defined requestOptions.
Checks if the response status is not OK (non-2xx status).Throws an error if something went wrong.
Converts the response data to JSON format and stores it in messagesResponseJson.
Updates the messages state with the fetched messages.
Updates the total pages state with the total number of pages available for the messages.
Sets isLoadingMessages to false to indicate that the messages are loaded.
Catches any errors that occur during the fetch request and sets isLoadingMessages to false.
stores the error message in httpError
Scrolls the browser window to the top of the page.
useEffect will run when authState, currentPage, or btnSubmit changes.

checks if the isloadingmessages varible is true 
This variable likely tracks whether the application is in the process of loading messages.
If isLoadingMessages is true, the component immediately returns a loading spinner (SpinnerLoading component).
 This checks if the httpError variable contains any error
 If httpError has a value, it returns a <div> element styled with Bootstrap classes
containing the error message.


Declares an async function named submitResponseToQuestion.
This function takes two parameters: id and response.
id: number — The identifier of a specific message.response: string — The admin's response to the message.
Defines the API endpoint URL where the message update request will be sent.
Checks if the user is authenticated and if the id and response are not empty.
Creates an object called messageAdminRequestModel by calling the AdminMessageRequest class constructor with the given id and response.
method: 'PUT': The request will update data on the server.
headers: Provides metadata for the request:
Authorization: Uses a Bearer token for secure access.
'Content-Type': 'application/json': Indicates that the body contains JSON data.
body: The JSON data to be sent in the request body.
Sends the HTTP request using fetch() and waits for the server's response.
Why await: Ensures the code waits for the response before moving forward.
If the response is not OK (200-299), it throws an error with a generic
If unsuccessful, throws an error with the message 'Something went wrong!'.
state variable btnSubmit between true and false.


This defines a function paginate that takes a pageNumber as a parameter (of type number).
It calls setCurrentPage(pageNumber), which updates the state variable currentPage to the given pageNumber.
This returns JSX
checking if the messages length is > 0 
If there are messages, render a header (<h5>) that displays "Pending Q/A."
This line loops through each message in the messages array using the map() function.
For each message, it renders/display the AdminMessage component.
message={message}: The current message object.
key={message.id}: A unique key for efficient rendering.
submitResponseToQuestion={submitResponseToQuestion}: A function for handling question responses.
If there are more than one page (totalPages > 1), it renders the Pagination component.
The Pagination component receives:
currentPage: The current page state.
totalPages: The total number of pages.
paginate={paginate}: The function to handle page changes.

ChangeQuantityOfBook.tsx-> 

import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { useOktaAuth } from "@okta/okta-react";

export const ChangeQuantityOfBook: React.FC<{ book: BookModel, deleteBook: any}> = (props, key) => {

    const { authState } = useOktaAuth();
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetchBookInState = () => {
            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
            props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0);
        };
        fetchBookInState();
    }, []);

    async function increaseQuantity() {
        const url = `http://localhost:8080/api/admin/secure/increase/book/quantity?bookId=${props.book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if(!quantityUpdateResponse.ok){
            throw new Error("Something Went Wrong!");
        }
        setQuantity(quantity + 1);
        setRemaining(quantity + 1);
    }

    async function decreaseQuantity(){
        const url = `http://localhost:8080/api/admin/secure/decrease/book/quantity?bookId=${props.book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        const quantityUpdateResponse = await fetch(url, requestOptions);
        if(!quantityUpdateResponse.ok){
            throw new Error("Something Went Wrong!");
        }
        setQuantity(quantity - 1);
        setRemaining(quantity - 1);
    }

    async function deleteBook() {
        const url = `http://localhost:8080/api/admin/secure/delete/book?bookId=${props.book?.id}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        const UpdateResponse = await fetch(url, requestOptions);
        if(!UpdateResponse.ok){
            throw new Error("Something Went Wrong!");
        }

        props.deleteBook();
    }


    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                                width='123' height='196' alt='Book' />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                                width='123' height='196' alt='Book' />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>{props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className='card-text'> {props.book.description} </p>
                    </div>
                </div>
                <div className='mt-3 col-md-4'>
                    <div className='d-flex justify-content-center algin-items-center'>
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Books Remaining: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className='mt-3 col-md-1'>
                    <div className='d-flex justify-content-start'>
                        <button className='m-1 btn btn-md btn-danger' onClick={deleteBook}>Delete</button>
                    </div>
                </div>
                <button className='m1 btn btn-md main-color text-white' onClick={increaseQuantity}>Add Quantity</button>
                <button className='m1 btn btn-md btn-warning' onClick={decreaseQuantity}>Decrease Quantity</button>
            </div>
        </div>
    );
}

explanation of this code -> 

useEffect: A React hook that allows side effects (like fetching data) in functional components.
useState: A hook to manage state within a component.
BookModel: An imported model that represents a book's structure.
useOktaAuth: A hook from Okta for authentication purposes to manage secure API requests

Defines a React functional component ChangeQuantityOfBook.
This component expects props containing:
A book of type BookModel.
A function deleteBook to delete the book.

authState: Extracted from Okta for authentication token access.
quantity: Holds the current book quantity (setQuantity updates it).
remaining: Holds the number of available copies (setRemaining updates it).

fetchBookInState: A function to initialize quantity and remaining state based on the book's properties (copies and copiesAvailable). Defaults to 0 if the properties are missing.

Constructs a PUT request to increase the book quantity using the book's ID.
Authorization: Adds a Bearer token from authState for secure access.

Sends the request and checks if it was successful.
If not successful, throws an error.
Updates both quantity and remaining by incrementing their values.
Constructs a PUT request to decrease the book quantity using the book's ID.
Authorization: Adds a Bearer token from authState for secure access.

Sends the request and checks if it was successful.
If not successful, throws an error.
Updates both quantity and remaining by decrementing their values.

Constructs a DELETE request to remove the book.
Sends the request and checks for success.
Calls props.deleteBook() to inform the parent component that the book has been deleted.


ChangeQuantityOfBooks.tsx -> 

import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";


export const ChangeQuantityOfBooks = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [bookDelete, setBookDelete] = useState(false);
    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `http://localhost:8080/api/books?page=${currentPage - 1}&size=${booksPerPage}`;
            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })

    }, [currentPage, bookDelete]);


    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteBook = () => setBookDelete(!bookDelete);

    if(isLoading){
        return (
        <SpinnerLoading/>
        );
    }
    
    if(httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return(
        <div className="container mt-5">
            {totalAmountOfBooks > 0 ? 
            <>
            <div className="mt-3">
                <h3>NUmber of results: ({totalAmountOfBooks})</h3>
            </div>
            <p>
                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
            </p>
            {books.map(book => (
            <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook}/>
            ))}
            </>
            :
            <h5>Add a book before changing quantity</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}

        </div>
    );
}


explanation of this code -> 






    
        







