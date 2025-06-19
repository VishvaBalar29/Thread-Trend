import "../assets/css/About.css";
import about1 from "../assets/images/about/about1.jpg"

export const About = () => {
  return (
    <div className="about-page">
     

      <section className="about-content">
        <div className="about-image">
          <img src={about1} alt="Thread & Trend Team" />
        </div>

        <div className="about-text">
          <p>
            <strong>Thread & Trend</strong> was born from a simple yet powerful idea — to simplify and modernize the tailoring experience. What started as a small team in Gujarat quickly grew into a mission to transform how custom clothing is managed, from order to delivery. <br />Whether you're stitching a blouse, gown, or suit, Thread & Trend makes it seamless. Customers enjoy an easy, personalized experience, while tailors gain control and clarity over their workflow.
          </p>

          <h3>🌟 Key Features</h3>
          <ul>
            <li>⚡ Easy Order & Item Management</li>
            <li>📏 Digital Measurements (Default + Custom)</li>
            <li>🎨 Upload Your Own Designs</li>
            <li>📦 Track Orders in Real-time</li>
            <li>📋 Customer History and Fit Records</li>
            <li>💬 Inquiry and Feedback Support</li>
          </ul>

          <h3>🚚 How We Deliver</h3>
          <p>
            We proudly offer <strong>free fitting and alterations</strong> for every order — because your comfort matters. Once the stitching is done, we deliver it to your doorstep with love, and a perfect fit is always guaranteed.
          </p>

          <p>
            At <strong>Thread & Trend</strong>, we don’t just stitch garments — we stitch confidence, convenience, and customer happiness.
          </p>
        </div>
      </section>
    </div>
  );
};
