import AppMenu from './components/AppMenu';
import Welcome from './components/Welcome';
import NavigationExample from './components/NavigationExample';
import './theme/theme.css';

const App = () => {
  return (
    <>
      <header className="app-header">
        MSS Showcase WebApp
      </header>
      <AppMenu />
      <main className="app-content">
        <NavigationExample />
      </main>
      <footer className="app-footer">
        &copy; {new Date().getFullYear()} MSS Showcase. All rights reserved.
      </footer>
    </>
  );
};

export default App;