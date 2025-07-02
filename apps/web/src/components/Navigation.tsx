import { Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';
import About from './About';
import StockDetails from './StockDetails';
import { RSSFeedReader } from './RSSFeedReader';
import WeatherFeedReader from './WeatherFeedReader';
import WhatToBuy from './WhatToBuy';

const Navigation = () => (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/about" element={<About />} />
    <Route path="/what-to-buy" element={<WhatToBuy />} />
    <Route path="/stock/:stockName" element={<StockDetails />} />
    <Route path="/stock/:stockName/date/:date" element={<StockDetails />} />
    <Route path="/news" element={<RSSFeedReader />} />
    <Route path="/weather" element={<WeatherFeedReader />} />
  </Routes>
);

export default Navigation;