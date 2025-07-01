import AppMenu from './components/AppMenu';
import Navigation from './components/Navigation';
import './theme/theme.css';

const App = () => {
  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">MSS Showcase WebApp</h1>
          <AppMenu />
        </div>
      </header>
      <main className="app-content">
        <Navigation />
      </main>
      <footer className="app-footer">
        &copy; {new Date().getFullYear()} MSS Showcase. All rights reserved.
      </footer>
    </>
  );
};

export default App;