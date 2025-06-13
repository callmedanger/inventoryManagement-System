import React, { useState } from 'react';
import './Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([
    { product: 'Laptop Dell XPS', customer: 'John Doe', quantity: 2, amount: 1999.98, date: '2024-06-08' },
    { product: 'iPhone 15 Pro', customer: 'Jane Smith', quantity: 1, amount: 1199.99, date: '2024-06-09' },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    product: '',
    customer: '',
    quantity: '',
    amount: '',
    date: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSale = () => {
    const { product, customer, quantity, amount, date } = form;
    if (!product || !customer || !quantity || !amount || !date) {
      alert('All fields are required.');
      return;
    }

    const newSale = {
      product,
      customer,
      quantity: parseInt(quantity),
      amount: parseFloat(amount),
      date,
    };
    setSales([...sales, newSale]);
    setForm({ product: '', customer: '', quantity: '', amount: '', date: '' });
    setModalOpen(false);
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalOrders = sales.length;
  const avgOrder = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h2>Sales</h2>
        <button className="record-sale-btn" onClick={() => setModalOpen(true)}>+ Record Sale</button>
      </div>

      <div className="sales-cards">
        <div className="card">
          <span className="icon">$</span>
          <div>
            <p>Total Sales</p>
            <h3>${totalSales.toFixed(2)}</h3>
          </div>
        </div>
        <div className="card">
          <span className="icon">🛒</span>
          <div>
            <p>Total Orders</p>
            <h3>{totalOrders}</h3>
          </div>
        </div>
        <div className="card">
          <span className="icon">📈</span>
          <div>
            <p>Avg Order Value</p>
            <h3>${avgOrder}</h3>
          </div>
        </div>
      </div>

      <table className="sales-table">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>CUSTOMER</th>
            <th>QUANTITY</th>
            <th>AMOUNT</th>
            <th>DATE</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={index}>
              <td><b>{sale.product}</b></td>
              <td>{sale.customer}</td>
              <td>{sale.quantity}</td>
              <td>${sale.amount.toFixed(2)}</td>
              <td>{sale.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Record New Sale</h3>
            <input name="product" placeholder="Product Name" value={form.product} onChange={handleChange} />
            <input name="customer" placeholder="Customer Name" value={form.customer} onChange={handleChange} />
            <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
            <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} />
            <input name="date" type="date" value={form.date} onChange={handleChange} />

            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddSale}>Add</button>
              <button className="cancel-btn" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
