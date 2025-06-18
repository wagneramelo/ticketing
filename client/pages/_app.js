import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Link from "next/link";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <Link className="navbar-brand" href="/">
          Ticketing App
        </Link>
        {!currentUser ? (
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link" href="/auth/signup">
                Sign Up
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/auth/signin">
                Sign In
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link" href="/auth/signout">
                Sign Out
              </Link>
            </li>
          </ul>
        )}
      </nav>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, currentUser: data.currentUser };
};

export default AppComponent;
