// import React from 'react';
// import '../pages/Dashboard.css'

// function Dashboard() {
//   return (
//     <div className="dashboard">
//       <div className="cards">
//         <div className="card blue">
//           <h4>Total Receivable</h4>
//           <p>Rs 73,100</p>
//           <span>From 4 Parties</span>
//         </div>
//         <div className="card green">
//           <h4>Total Payable</h4>
//           <p>Rs 7,540</p>
//           <span>From 1 Party</span>
//         </div>
//         <div className="card large">
//           <h4>Total Sale</h4>
//           <p>Rs 212,080</p>
//           {/* Add chart later */}
//         </div>
        
//       </div>
//       <div className="reports">
//         <button>Sale Report</button>
//         <button>All Transactions</button>
//         <button>Daybook Report</button>
//         <button>Party Statement</button>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCube, FaDollarSign, FaChartLine, FaRegFileAlt, FaChartBar } from 'react-icons/fa';

const styles = {
  pageContainer: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentWrapper: {
    maxWidth: '1000px',
    width: '100%',
  },
  dashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  headerTitle: {
    fontSize: '24px',
    margin: 0,
  },
  headerTimestamp: {
    fontSize: '12px',
    color: '#666',
  },
  matrixGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '160px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  statCardIcon: {
    fontSize: '28px',
    position: 'absolute',
    top: '20px',
    right: '20px',
    opacity: 0.4,
  },
  statCardTitle: {
    fontSize: '14px',
    marginBottom: '10px',
    color: '#555',
  },
  statCardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#222',
  },
  statCardDescription: {
    fontSize: '12px',
    color: '#777',
    marginTop: 'auto',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  },
  summaryCardValue: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  summaryCardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  avgValueContainer: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  },
  avgValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  avgDescription: {
    fontSize: '14px',
    color: '#666',
  },
  cashFlowCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  },
  cashFlowHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  cashFlowItem: {
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cashFlowItemTitle: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  cashFlowAmount: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: '8px',
    backgroundColor: '#ddd',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressBarFilled: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: '4px',
  },
};

function App() {
  const cashIn = 2505;
  const cashOut = 750;
  const netCashFlow = cashIn - cashOut;
  const totalForBarCalculation = Math.abs(cashIn) + Math.abs(cashOut);
  const clampedPercentage = totalForBarCalculation > 0 ? (netCashFlow / totalForBarCalculation) * 100 : 0;

  const [productCount, setProductCount] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    // Fetch product count from backend
    axios.get('http://localhost:5000/api/products/count')
      .then(response => {
        console.log('Product count fetched:', response.data.count); // Debugging log
        setProductCount(response.data.count);
      })
      .catch(error => {
        console.error('Error fetching product count:', error);
      });

    // Fetch total inventory value from backend
    axios.get('http://localhost:5000/api/products/inventory-value')
      .then(response => {
        console.log('Inventory value fetched:', response.data.totalValue); // Debugging log
        setInventoryValue(response.data.totalValue);
      })
      .catch(error => {
        console.error('Error fetching inventory value:', error);
      });

    // Fetch low stock count from backend
    axios.get('http://localhost:5000/api/products/low-stock')
      .then(response => {
        console.log('Low stock count fetched:', response.data.lowStockCount); // Debugging log
        setLowStockCount(response.data.lowStockCount);
      })
      .catch(error => {
        console.error('Error fetching low stock count:', error);
      });
  }, []);

  const renderStatCard = (title, value, description, icon, isAlert = false) => (
    <div style={styles.statCard}>
      <div style={styles.statCardTitle}>{title}</div>
      <div style={{ ...styles.statCardValue, ...(isAlert ? { color: 'red' } : {}) }}>{value}</div>
      <div style={styles.statCardDescription}>{description}</div>
      <div style={styles.statCardIcon}>{icon}</div>
    </div>
  );

  const renderSummaryCard = (title, value) => (
    <div style={styles.summaryCard}>
      <div style={styles.summaryCardValue}>{value}</div>
      <div style={styles.summaryCardTitle}>{title}</div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.dashboardHeader}>
          <h1 style={styles.headerTitle}>Dashboard Overview</h1>
          <div style={styles.headerTimestamp}>Last updated: 6/12/2025, 1:23:15 PM PKT</div>
        </div>

        {/* Matrix Box Style for Top 4 */}
        <div style={styles.matrixGrid}>
          {renderStatCard("Total Products", productCount, "Active SKUs", <FaCube />)}
          {renderStatCard("Inventory Value", `$${inventoryValue}`, "Total stock worth", <FaDollarSign />)}
          {renderStatCard("Low Stock Alert", lowStockCount, "Items need reorder", <FaChartLine />, lowStockCount > 0)}
          {renderStatCard("Net Cash Flow", "$1,755", "This period", <FaRegFileAlt />)}
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {renderSummaryCard("Total Sales", "2")}
          {renderSummaryCard("Total Purchases", "1")}
          {renderSummaryCard("Invoices Generated", "0")}
        </div>

        {/* Average Order Value */}
        <div style={styles.avgValueContainer}>
          <div style={styles.avgValue}>$1253</div>
          <div style={styles.avgDescription}>Avg. Order Value</div>
        </div>

        {/* Cash Flow Analysis */}
        <div style={styles.cashFlowCard}>
          <div style={styles.cashFlowHeader}>
            <FaDollarSign style={{ marginRight: '10px', color: '#28a745' }} />
            Cash Flow Analysis
          </div>
          <div style={styles.cashFlowItem}>
            <div>
              <div style={styles.cashFlowItemTitle}>Cash In (Sales)</div>
              <div style={styles.cashFlowAmount}>${cashIn}</div>
            </div>
            <FaChartLine size={20} />
          </div>
          <div style={styles.cashFlowItem}>
            <div>
              <div style={styles.cashFlowItemTitle}>Cash Out (Purchases)</div>
              <div style={styles.cashFlowAmount}>${cashOut}</div>
            </div>
            <FaChartBar size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontWeight: 'bold' }}>Net Cash Flow</span>
              <span style={{ fontWeight: 'bold' }}>${netCashFlow}</span>
            </div>
            <div style={styles.progressBarContainer}>
              <div
                style={{ ...styles.progressBarFilled, width: `${clampedPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
