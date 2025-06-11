import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@mss-frontend/store';
import { fetchStockNames } from '@mss-frontend/store/stockNamesSlice';
import { useNavigate } from 'react-router-dom';
import '../theme/theme.css';

const Welcome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state: RootState) => state.stockNames);

  useEffect(() => {
    dispatch(fetchStockNames());
  }, [dispatch]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      navigate(`/stock/${selected}`);
    }
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to MSS Showcase web application!</h1>
      <p>
        Please select an item from the dropdown below.
      </p>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <select onChange={handleSelect} defaultValue="">
          <option value="" disabled>Select a stock</option>
          {items.map((item: string) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Welcome;