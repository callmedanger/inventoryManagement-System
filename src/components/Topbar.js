import React from 'react';
import '../components/topbar.css';

function Topbar() {
  return (
    <div className="topbar">
      {/* <input type="text" placeholder="Search Transactions" /> */}
      <div className="buttons">
        <button className="sale">+ Add Sale</button>
        <button className="purchase">+ Add Purchase</button>
      </div>
    </div>
  );
}

export default Topbar;
