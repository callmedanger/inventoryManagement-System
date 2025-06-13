import React, { useState } from 'react';
import './Product.css';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

function Product() {
  const initialProducts = [
    { name: 'Laptop Dell XPS', sku: 'LPT001', category: 'Electronics', quantity: 25, price: '$999.99' },
    { name: 'iPhone 15 Pro', sku: 'IPH001', category: 'Electronics', quantity: 15, price: '$1199.99' },
    { name: 'Gaming Chair', sku: 'CHR001', category: 'Furniture', quantity: 8, price: '$299.99' },
    { name: 'Wireless Mouse', sku: 'MOU001', category: 'Accessories', quantity: 50, price: '$29.99' },
    { name: 'Monitor 4K', sku: 'MON001', category: 'Electronics', quantity: 12, price: '$399.99' },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    price: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddProduct = () => {
    const { name, sku, category, quantity, price } = newProduct;
    if (!name || !sku || !category || !quantity || !price) {
      alert('All fields are required!');
      return;
    }

    const updatedList = [
      ...products,
      { ...newProduct, quantity: Number(quantity) }
    ];
    setProducts(updatedList);
    setFilteredProducts(updatedList);
    setNewProduct({ name: '', sku: '', category: '', quantity: '', price: '' });
    setShowModal(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const getStatus = (quantity) => {
    if (quantity <= 10) return 'Low Stock';
    if (quantity <= 20) return 'Medium Stock';
    return 'In Stock';
  };

  const getStatusClass = (status) => {
    if (status === 'Low Stock') return 'status low';
    if (status === 'Medium Stock') return 'status medium';
    return 'status in';
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h2>Products</h2>
        <button className="add-product-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, SKU, or category..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>SKU</th>
            <th>CATEGORY</th>
            <th>QUANTITY</th>
            <th>PRICE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => {
              const status = getStatus(item.quantity);
              return (
                <tr key={index}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.sku}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td><span className={getStatusClass(status)}>{status}</span></td>
                  <td>
                    <FaEdit className="action-icon edit" />
                    <FaTrash className="action-icon delete" />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No products found</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Add Product</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="SKU"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />
            <input
              type="text"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={handleAddProduct} className="add-btn">Add</button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
