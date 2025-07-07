
import AppMenu from './components/AppMenu';
import Navigation from './components/Navigation';
import HeaderUserMenu from './components/HeaderUserMenu';
import Breadcrumbs from './components/Breadcrumbs';
import './theme/theme.css';

const App = () => {
  return (
    <>
      <div className="app-container ergonomic-flex">
        <header className="app-header ergonomic-section">
          <div className="header-content ergonomic-flex header-menu-flex">
            <HeaderUserMenu />
            <h1 className="app-title ergonomic-title">MSS Showcase WebApp</h1>
            <div className="header-menu-flex">
              <AppMenu />
            </div>
          </div>
        </header>
        <Breadcrumbs />
        <main className="app-content ergonomic-main">
          <Navigation />
        </main>
        <footer className="app-footer ergonomic-section">
          <div className="footer-inner">
            &copy; {new Date().getFullYear()} MSS Showcase. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;