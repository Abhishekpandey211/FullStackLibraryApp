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
                The Library team would love to know What you have been reading
                whether it is to learn new skills or grow within one, We will be
                able to provide the top content for you
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