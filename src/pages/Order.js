import React, { useState } from 'react';
import './Order.css'; // Keep your CSS file

const OrderTable = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const orders = [
        { id: 1, fullName: 'ADMI ZAKARYAE', mobile: '0651886151', totalAmount: 300 },
        { id: 2, fullName: 'ADMI ZAKARYAE', mobile: '0651886151', totalAmount: 300 },
        // ... other orders
    ];

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div className="order-table-container">
            <div className="table-header">
                <div className="header-item">ID</div>
                <div className="header-item">Full Name</div>
                <div className="header-item">Mobile</div>
                <div className="header-item">Total Amount</div>
                <div className="header-item">Order Details</div>
            </div>
            {orders.map((order) => (
                <div className="table-row" key={order.id}>
                    <div className="row-item id-column">{order.id}</div>
                    <div className="row-item full-name-column">
                        <span className="avatar">Z</span> {order.fullName}
                    </div>
                    <div className="row-item">{order.mobile}</div>
                    <div className="row-item">{order.totalAmount}</div>
                    <div className="row-item">
                        <button
                            className="order-details-button"
                            onClick={() => handleOpenModal(order)}
                        >
                            ORDER DETAILS
                        </button>
                    </div>
                </div>
            ))}

            <div className="table-footer">
                <div className="pagination-info">1-13 of 22</div>
                <div className="pagination-controls">
                    <button className="pagination-arrow">&lt;</button>
                    <button className="pagination-arrow">&gt;</button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="modal-close" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <h2>Order Details</h2>
                        <p><strong>ID:</strong> {selectedOrder.id}</p>
                        <p><strong>Full Name:</strong> {selectedOrder.fullName}</p>
                        <p><strong>Mobile:</strong> {selectedOrder.mobile}</p>
                        <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTable;
