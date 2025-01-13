import { Link } from "react-router-dom"; // Link: Used for navigation between pages without refreshing the browser. 
import { Review } from "../Utils/Review"; // Review: A component that displays a single review.
import { ReviewModel } from "../../models/ReviewModel"; // ReviewModel: A TypeScript model that defines the structure of a review (e.g., id, content, author).


export const LatestReviews: React.FC<{
    reviews: ReviewModel[], bookId: number | undefined, mobile: boolean
}> = (props) => { // Latest review is a functional component 
// Props received by this component:
// reviews: An array of reviews (ReviewModel[]).
// bookId: The ID of the book (used for navigation).
// mobile: A boolean that checks if the user is on a mobile device (for styling).
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
    );
}
  // If mobile is true, it adds a small top margin (mt-3).
  // If not, it uses Bootstrap classes for a larger layout (row mt-5).

  // Shows the title "Latest Reviews:".
  // If not on mobile, it takes up 2 columns in the grid (col-sm-2).

  // It takes the first 3 reviews (slice(0, 3)).
  // Each review is passed to the Review component.
  // key eachReview.uniquely identifies each review (important for performance).

  // Button that navigates to a page showing all reviews for the book.
  // The link leads to /reviewlist/{bookId} (e.g., /reviewlist/5).