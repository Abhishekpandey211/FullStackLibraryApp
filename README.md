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

useeffect hook with arrow function is fetching the book data from API
declare a fetchbook asynchronous function  because data fetching requires waiting for the API response.
constructs the API endpoint URL (book id is 1,2,3 dynamically inserted).
fetch function is used is used to fetch the HTTP reuest to the base url 
await keyword is used to wait for the server to respond before before moving to the next line 
the server reply(called the response ) is stored the response variable 
check if the response was unsuccessful (eg.  400 or 500 error).
if the response is not ok then throw an error with the message "Something went wrong!"
converts the servers reponse data into JSON  and await ensures the code waits for the conversion 
