import AppMenu from './components/AppMenu';
import Navigation from './components/Navigation';
import HeaderUserMenu from './components/HeaderUserMenu';
import './theme/theme.css';

const App = () => {
  return (
    <>
      <header className="app-header">
        <div className="header-content" style={{ display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
          <HeaderUserMenu />
          <h1 className="app-title" style={{ flex: 1, textAlign: 'center', margin: 0 }}>MSS Showcase WebApp</h1>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <AppMenu />  
          </div>
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