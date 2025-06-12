import AppMenu from './components/AppMenu';
import Navigation from './components/Navigation';
import './theme/theme.css';

const App = () => {
  return (
    <>
      <header className="app-header">
        MSS Showcase WebApp
      </header>
      <AppMenu />
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