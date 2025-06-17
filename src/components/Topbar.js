import React from 'react';
import { Link } from 'react-router-dom';
import '../components/topbar.css';

function Topbar() {
  return (
    <div className="topbar">
      {/* <input type="text" placeholder="Search Transactions" /> */}
      <div className="buttons">
        <Link to="/sale">
          <button className="sale"> + Add Sale</button>
        </Link>
        <button className="purchase">+ Add Purchase</button>
      </div>
    </div>
  );
}

export default Topbar;
