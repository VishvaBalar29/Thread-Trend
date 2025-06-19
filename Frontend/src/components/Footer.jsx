import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Thread & Trend</h3>
          <p>Your one-stop solution for tailoring management. Track orders, measurements, and customer details seamlessly.</p>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="">Home</a></li>
            <li><a href="/design">Designs</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">contact</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Contact</h4>
          <p>Email: support@threadtrend.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: Surat, Gujarat, India</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Thread & Trend. All rights reserved.
      </div>
    </footer>
  );
};
