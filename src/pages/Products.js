import React, { useState, useEffect } from 'react';
import './Product.css';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';

function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    price: '',
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    quantity: '',
    price: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/all', { withCredentials: true });
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      alert('Failed to load products.');
    }
  };

  const handleAddProduct = async () => {
    const { name, sku, category, quantity, price } = newProduct;
    if (!name || !sku || !category || !quantity || !price) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/products/add', {
        name, sku, category, quantity: Number(quantity), price,
      });

      if (res.status === 200) {
        alert('Product added successfully!');
        setNewProduct({ name: '', sku: '', category: '', quantity: '', price: '' });
        setShowModal(false);
        fetchProducts();
      } else {
        alert(res.data.error || 'Failed to add product.');
      }
    } catch (err) {
      console.error('Add product error:', err);
      alert('Server error.');
    }
  };

  const handleDeleteProduct = async (sku) => {
    const confirmDelete = window.confirm(`Are you sure to delete SKU: ${sku}?`);
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/products/${sku}`, { withCredentials: true });
      if (res.status === 200) {
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh list
      } else {
        alert(res.data.error || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server error.');
    }
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

  const getStatusClass = (quantity) => {
    if (quantity <= 10) return 'status-circle red';
    return 'status-circle green';
  };

  const handleUpdateProduct = async () => {
    const { name, category, quantity, price } = editForm;
    if (!name || !category || !quantity || !price) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/products/${editingProduct.sku}`, {
        name,
        category,
        quantity: Number(quantity),
        price
      });

      if (res.status === 200) {
        alert('Product updated successfully!');
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert(res.data.error || 'Update failed.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Server error.');
    }
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
                  <td><span className={getStatusClass(item.quantity)}>{status}</span></td>
                  <td>
                    <FaEdit
                      className="action-icon edit"
                      onClick={() => {
                        setEditingProduct(item);
                        setEditForm({
                          name: item.name,
                          category: item.category,
                          quantity: item.quantity,
                          price: item.price
                        });
                      }}
                    />
                    <FaTrash
                      className="action-icon delete"
                      onClick={() => handleDeleteProduct(item.sku)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No products found</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal for Adding Product */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Add Product</h3>
            <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            <input type="text" placeholder="SKU" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
            <input type="text" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
            <input type="number" placeholder="Quantity" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} />
            <input type="text" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
            <div className="modal-actions">
              <button onClick={handleAddProduct} className="add-btn">Add</button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing Product */}
      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Product (SKU: {editingProduct.sku})</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={editForm.quantity}
              onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
            />
            <input
              type="text"
              placeholder="Price"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleUpdateProduct} className="add-btn">Update</button>
              <button onClick={() => setEditingProduct(null)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
