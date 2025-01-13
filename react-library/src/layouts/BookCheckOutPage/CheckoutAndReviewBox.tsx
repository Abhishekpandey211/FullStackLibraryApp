import { Link } from "react-router-dom"; // link used for navigation to the login page 
import BookModel from "../../models/BookModel"; // typescript book structure 
import { LeaveAReview } from "../Utils/LeaveAReview"; // a component that allow users to submit review 

export const CheckoutAndReviewBox: React.FC<{ book: BookModel | undefined, mobile: boolean, 
    currentLoansCount: number, isAuthenticated: any, isCheckedOut: boolean, 
    checkoutBook: any, isReviewLeft: boolean, submitReview: any }> = (props) => {
    // book: The selected book (or undefined if not loaded).
    // mobile: A boolean to adjust the layout for mobile devices.
    // currentLoansCount: Number of books the user has checked out.
    // isAuthenticated: Indicates if the user is logged in.
    // isCheckedOut: Indicates if this book is already checked out by the user.
    // checkoutBook: Function to checkout the book.
    // isReviewLeft: Indicates if the user has already left a review.
    // submitReview: Function to submit a review.
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

    // If the user is logged in:
    // If the book is not checked out and the user has checked out fewer than 5 books, show the "Checkout" button.
    // If the book is already checked out, show "Book checked out. Enjoy!".
    // If the user has checked out 5 or more books, show "Too many books checked out" in red.
    // If the user is not logged in, show a "Sign in" button linking to the login page.

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
    // If the user is logged in and hasn't reviewed the book, show the LeaveAReview component.
    // If the user is logged in and has already reviewed, show "Thank you for your review!".
    // If the user is not logged in, prompt them to sign in to leave a review.


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
// Layout changes based on the mobile prop for responsive design.
// Displays how many books the user has checked out (e.g., 2/5).
// Shows if the book is Available (in green) or on the Wait List (in red).
// Shows the total copies and available copies of the book.
// Calls buttonRender() to show the correct checkout button or message.
// Calls reviewRender() to handle the review section.