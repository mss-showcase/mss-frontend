import { Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';
import About from './About';
import StockDetails from './StockDetails';
import { RSSFeedReader } from './RSSFeedReader';
import WeatherFeedReader from './WeatherFeedReader';
import MobileAppInfo from './MobileAppInfo';

const Navigation = () => (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/about" element={<About />} />
    <Route path="/stock/:stockName" element={<StockDetails />} />
    <Route path="/news" element={<RSSFeedReader />} />
    <Route path="/weather" element={<WeatherFeedReader />} />
    <Route path="/mobile" element={<MobileAppInfo />} />
  </Routes>
);

export default Navigation;