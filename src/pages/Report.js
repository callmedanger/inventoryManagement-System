// Report.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Report.css';

function Report() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [salesData, setSalesData] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    topProduct: ''
  });

  const fetchSalesData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales');
      const sales = response.data;

      // Calculate KPIs
      const totalSales = sales.length;
      const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
      
      // Find top selling product
      const productSales = sales.reduce((acc, sale) => {
        acc[sale.product] = (acc[sale.product] || 0) + parseInt(sale.quantity);
        return acc;
      }, {});
      
      const topProduct = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'No sales';

      setKpiData({
        totalSales,
        totalRevenue,
        topProduct
      });

      // Process data for chart based on timeRange
      const processedData = processChartData(sales, timeRange);
      setSalesData(processedData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const processChartData = (sales, range) => {
    const groupedData = sales.reduce((acc, sale) => {
      let key;
      const date = new Date(sale.date);
      
      switch(range) {
        case 'daily':
          key = sale.date;
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = sale.date;
      }

      if (!acc[key]) {
        acc[key] = {
          date: key,
          sales: 0,
          revenue: 0,
          product: sale.product
        };
      }

      acc[key].sales += parseInt(sale.quantity);
      acc[key].revenue += parseFloat(sale.amount);
      return acc;
    }, {});

    return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label">{`Date: ${label}`}</p>
          <p className="sales">{`Sales: ${payload[0].value}`}</p>
          <p className="revenue">{`Revenue: Rs ${payload[1].value.toFixed(2)}`}</p>
          <p className="product">{`Product: ${payload[0].payload.product}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="report-page" style={{ padding: '20px' }}>
      <div className="report-header" style={{ marginBottom: '20px' }}>
        <h2 className="report-heading">Sales Analytics Dashboard</h2>
        <div className="time-range-selector" style={{ marginTop: '10px' }}>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-cards" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="kpi-card" style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Total Sales</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{kpiData.totalSales}</p>
        </div>
        <div className="kpi-card" style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Rs {kpiData.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="kpi-card" style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Top Selling Product</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{kpiData.topProduct}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: '400px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Sales Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={salesData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" name="Sales" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Report;
