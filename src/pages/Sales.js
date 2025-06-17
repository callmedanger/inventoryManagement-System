import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('product'); // 'product' or 'customer'
  const [modalOpen, setModalOpen] = useState(false);
  const [product, setProduct] = useState('');
  const [customer, setCustomer] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  // Automatically calculate amount
  const amount = quantity && price ? (parseInt(quantity) * parseFloat(price)).toFixed(2) : '';

  // Fetch all sales from backend
  const fetchSales = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sales');
      setSales(res.data);
      setFilteredSales(res.data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Filter sales based on search query and type
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter(sale => {
        const searchValue = searchQuery.toLowerCase();
        if (searchType === 'product') {
          return sale.product.toLowerCase().includes(searchValue);
        } else {
          return sale.customer.toLowerCase().includes(searchValue);
        }
      });
      setFilteredSales(filtered);
    }
  }, [searchQuery, searchType, sales]);

  // Add new sale
  const handleAddSale = async () => {
    try {
      await axios.post('http://localhost:5000/api/sales/add', {
        product,
        customer,
        quantity,
        amount,
        date
      });
      setModalOpen(false);
      setProduct('');
      setCustomer('');
      setQuantity('');
      setPrice('');
      setDate('');
      fetchSales();
    } catch (err) {
      console.error('Error adding sale:', err);
    }
  };

  // Delete sale by ID
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await axios.delete(`http://localhost:5000/api/sales/delete/${id}`);
        fetchSales();
      } catch (err) {
        console.error('Error deleting sale:', err);
      }
    }
  };

  return (
    <div className="sales-container">
      {/* Summary Cards */}
      <div className="sales-summary-cards">
        <div className="card">
          <h4>Total Sales</h4>
          <p>{sales.length}</p>
        </div>
        <div className="card">
          <h4>Total Quantity Sold</h4>
          <p>{sales.reduce((acc, curr) => acc + parseInt(curr.quantity), 0)}</p>
        </div>
        <div className="card">
          <h4>Total Amount</h4>
          <p>Rs {sales.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Header, Search, and Button */}
      <div className="sales-header">
        <h2>Sales</h2>
        <div className="sales-controls">
          <div className="search-container">
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type-select"
            >
              <option value="product">Search by Product</option>
              <option value="customer">Search by Customer</option>
            </select>
            <div className="search-box">
              <input
                type="text"
                placeholder={`Search by ${searchType === 'product' ? 'product' : 'customer'} name...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button className="record-sale-btn" onClick={() => setModalOpen(true)}>
            Record Sale
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <table className="sales-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Customer</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.product}</td>
              <td>{sale.customer}</td>
              <td>{sale.quantity}</td>
              <td>Rs {sale.amount}</td>
              <td>{sale.date}</td>
              <td>
                <button
                  onClick={() => handleDelete(sale.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Record a Sale</h3>
            <input
              type="text"
              placeholder="Product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price per Unit"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              disabled
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddSale}>
                Add
              </button>
              <button className="cancel-btn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
