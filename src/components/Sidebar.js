import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaMoneyBill, FaChartLine, FaSignOutAlt, FaRegFileAlt, FaChartBar } from 'react-icons/fa';
import '../components/Sidebar.css';

function Sidebar({ onLogout }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();           // Update login state in parent
        navigate('/login');   // Redirect to login
    };

    return (
        <div className="sidebar">
            <h2>Inventory</h2>
            <ul>
                <li className={pathname === '/' ? 'active' : ''}>
                    <Link to="/">
                        <FaHome /> <span>Home</span>
                    </Link>
                </li>
                <li className={pathname === '/items' ? 'active' : ''}>
                    <Link to="/items">
                        <FaBox /> <span>Products</span>
                    </Link>
                </li>
                <li className={pathname === '/sale' ? 'active' : ''}>
                    <Link to="/sale">
                        <FaMoneyBill /> <span>Sales</span>
                    </Link>
                </li>
                 {/* <li className={pathname === '/order' ? 'active' : ''}>
                    <Link to="/order">
                        <FaJediOrder /> <span>Orders</span>
                    </Link>
                </li> */}
                <li className={pathname === '/reports' ? 'active' : ''}>
                    <Link to="/reports">
                        <FaChartLine /> <span>Reports</span>
                    </Link>
                </li>

                {/* Logout Button */}
                <li onClick={handleLogout} className="logout">
                    <span>
                        <FaSignOutAlt /> <span>Logout</span>
                    </span>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
