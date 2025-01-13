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