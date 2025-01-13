import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { ReviewModel } from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";
// book and review models define the structure of the data for books and reviews 
// component are spinner, stars, checkoutandreview box , latestreview handle ui.
// useoktaauth from the okta library for authentication 
export const BookCheckoutPage = () => { // we declared a functional component 

    const { authState } = useOktaAuth(); // it contains authentication information such as whether the user is login .

    //state variables 
    const [book, setBook] = useState<BookModel>();  // book holds the book data fetch from the backend , setbook update the book state.
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    // isloading is the current value of the state (true/false) and setisloading is the function used to change the value of the isloading (eg. set it to false when loading is complete)
    // httperror stores the error message(any error occur),
    // sethttperror is the function used to set the error message when an error happens 

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    // initailize the reviews state an empty array of type reviewmodel
    // reviewmodel is likely a typescript interface or type that defines the structure of the reviews ( eg. reviewer name , rating , component ).
    // how it works -> reviews holds the list of reviews fetched from server or api. 
    // setreviews -> function is used to update the list of reviews when reviews are fecthed . 
    //  initaialize the totalstars with the value 0 , holds the total no. of stars (sum of ratings) from all reviews. 
    //  To store and manage the data for reviews dynamically in the component.
    // settotalstars is the function to update the value when reviews are added . 
    // To calculate and display the average rating or total stars based on reviews.
    // isloadingreview is initialize the stae true , is a flag that track the reviews are being fetch from the server 
    // setisloadingreview  is used to update this flag to false once the data is loaded 

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
    // usestae is a react hook that creates a state variable for functional component 
    // a current value (isReviewLeft or isLoadingUserReview)
    // a function update the value (setisreviewleft or setisloadingreview)
    // isReviewLeft tracks if the user has already left a review. Initially, it’s set to false because we assume they haven’t.
    // isLoadingUserReview tracks if the app is still fetching the user's review status. It starts as true to show the UI is in a "loading" state.


    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);
    // currentloanscount is a state variable is set to be initial value 0
    // setcurrentloans count is a function used to update the value of currentloanscount (eg... when user borrews a book it increase the count)
    // isloadingcurrentlaonscount is initialized with the value true which means that initially the application is still laoding the data 
    // setisloadingcurrentloanscount is function is used to update the state of isloadingcurrentloans when the data is successfully loaded and flase when the data is laoding complete 

    // Is Book Check Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);
    // isCheckedOut is initialized with false because, by default, the book is not checked out.
    // setIsCheckedOut updates the state value to reflect whether the book is checked out or not.
    // isLoadingBookCheckedOut is initialized with true to show that the system is still loading or checking if the book is checked out.
    // setIsLoadingBookCheckedOut updates this loading state when the checking process is complete

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => { // useeffect hook with arrow function is fetching the book data from API
        const fetchBook = async () => { // declare a fetchbook asynchronous function  because data fetching requires waiting for the API response.
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;  // constructs the API endpoint URL (book id is 1,2,3 dynamically inserted).

 
            const response = await fetch(baseUrl);
            // fetch function is used is used to fetch the HTTP reuest to the base url 
            // await keyword is used to wait for the server to respond before before moving to the next line 
            // the server reply(called the response ) is stored the response variable 

            if (!response.ok) {
                throw new Error('Something went wrong!');
            } // check if the response was unsuccessful (eg.  400 or 500 error).
            // if the response is not ok then throw an error with the message "Something went wrong!"

            const responseJson = await response.json(); // converts the servers reponse data into JSON  and await ensures the code waits for the conversion 

            const loadedBook: BookModel = {   // the loaded book variable is used to store the book information  and book model is a typescripttype or interface that defines the structure of the book object 
                id: responseJson.id, // assigns the book unique id from responseJSON to the id 
                title: responseJson.title,  // assign the book title 
                author: responseJson.author, // assign the book author 
                description: responseJson.description, // assign the book description 
                copies: responseJson.copies, // assign the book copies 
                copiesAvailable: responseJson.copiesAvailable, // assign the book copies available 
                category: responseJson.category, // assign the book category 
                img: responseJson.img, // assign the image of the book 
            };
            
            setBook(loadedBook);
            // setbook is a function that updates the book state with the loaded book data from the API
            setIsLoading(false);
            // setisloading is a function that updates the isloading state to false indicating that the data
        };
        fetchBook().catch((error: any) => { // calls the fetchbook function and handles any error that occure during the fetch if an error is thrown the catch block executes 


            setIsLoading(false); // ensures the laoding is turned off even if the error occurs 
            setHttpError(error.message); // update the httperror state with the error message, allowing the UI to display error
        })
    }, [isCheckedOut]); // dependency array for the useeffect , the fetchbook function will run again whenever ischeckout chnages 

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

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
                const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
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
                const url = `http://localhost:8080/api/books/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: { 
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
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
                const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
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
        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
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
        const url = `http://localhost:8080/api/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
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