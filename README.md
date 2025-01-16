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































