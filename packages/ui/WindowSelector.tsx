import React from 'react';
import { TickWindow } from '../store/tickSlice';

type Props = {
  value: TickWindow;
  onChange: (w: TickWindow) => void;
};

export const WindowSelector: React.FC<Props> = ({ value, onChange }) => (
    <select value={value} onChange={e => onChange(e.target.value as TickWindow)}>
      {Object.values(TickWindow).map(w => (
        <option key={w} value={w}>{w}</option>
      ))}
    </select>
);