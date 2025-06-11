import { Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';
import About from './About';
import StockDetails from './StockDetails'; // <-- create this component

const NavigationExample = () => (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/about" element={<About />} />
    <Route path="/stock/:stockName" element={<StockDetails />} /> {/* Hidden route */}
  </Routes>
);

export default NavigationExample;