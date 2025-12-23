import React from 'react';
import './Delivery.css';

const Delivery = () => {
  const orders = [
    {
      customer: 'Gojo Sulaiman',
      orderNo: '2201223FJAQG',
      products: [
        {
          name: 'T-Shirt Groot Black',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
          price: '100.000₫',
          status: 'Need to be sent',
          statusDetail: 'Before 28/05/2022',
          quantity: 1,
          deliveryService: 'J&T',
        },
        {
          name: 'Sepatu Nike',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
          price: '800.000₫',
          status: 'Need to be sent',
          statusDetail: 'Before 28/05/2022',
          quantity: 1,
          deliveryService: 'J&T',
        },
      ],
    },
    {
      customer: 'Alan',
      orderNo: '2197139TYQPWO',
      products: [
        {
          name: 'T-Shirt Love Kills',
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop',
          price: '100.000₫',
          status: 'Need to be sent',
          statusDetail: 'Before 28/05/2022',
          quantity: 2,
          deliveryService: 'Sicepat',
        },
      ],
    },
  ];

  return (
    <div className="delivery-container">
      <header className="delivery-header">
        <h1 className="delivery-title">Delivery</h1>
        <div className="header-actions">
          <div className="date-selector">
            <span>May 2022</span>
            <span className="dropdown-icon">▼</span>
          </div>
        </div>
      </header>

      <div className="card filter-card">
        <div className="tabs">
          <button className="tab-item">All</button>
          <button className="tab-item">Not Paid (3)</button>
          <button className="tab-item active">Need to Send (5)</button>
          <button className="tab-item">Sent (10)</button>
          <button className="tab-item">Finished (2)</button>
          <button className="tab-item">Cancellation</button>
          <button className="tab-item">Return</button>
        </div>
        <div className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-label">No. Order</span>
            <input type="text" placeholder="Enter the no. order" className="search-input"/>
          </div>
          <button className="search-btn">Search</button>
          <button className="reset-btn">Reset</button>
        </div>
      </div>

      <div className="card orders-card">
        <div className="tabs second-tabs">
          <button className="tab-item active-secondary">All (18)</button>
          <button className="tab-item">Need to handle</button>
          <button className="tab-item">Return</button>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product name</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Action</th>
              <th>Delivery Services</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, orderIndex) => (
              <React.Fragment key={orderIndex}>
                <tr className="customer-row">
                  <td colSpan="6">
                    <div className="customer-info">
                      <span className="customer-name">
                        {order.customer}
                      </span>
                      <span className="order-no">Order No. {order.orderNo}</span>
                    </div>
                  </td>
                </tr>
                {order.products.map((product, productIndex) => (
                  <tr key={productIndex} className="product-row">
                    <td>
                      <div className="product-info">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.price}</td>
                    <td>
                      <div>{product.status}</div>
                      <div className="status-detail">{product.statusDetail}</div>
                    </td>
                    <td>{product.quantity}</td>
                    <td><a href="#" className="action-link">Arrange Delivery</a></td>
                    <td>{product.deliveryService}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Delivery;
