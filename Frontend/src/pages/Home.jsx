import React from "react";
import "../assets/css/Home.css"; 
import home1 from "../assets/images/home/home1.webp";
import home2 from "../assets/images/home/home2.webp";
import home3 from "../assets/images/home/home3.jpeg";
import home4 from "../assets/images/home/home4.avif";

export const Home = () => {
    return (
        <div className="home-container">
            <header className="hero-section">
                <div className="overlay">
                    <h1>Best and Reliable Tailoring Services</h1>
                    <button className="hero-btn">Enquire Now</button>
                </div>
            </header>

            <section className="services-section">
                <h2>Services</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <img src={home1} alt="Custom Tailoring" />
                        <h3>Custom Tailoring</h3>
                        <p>
                            We provide custom tailoring service so that you can choose all details you want, from buttons to pockets and lapels.
                        </p>
                        <button className="service-btn">Enquire Now</button>
                    </div>
                    <div className="service-card">
                        <img src={home2} alt="Altering" />
                        <h3>Altering</h3>
                        <p>
                            The perfect cut for your outfit is something we believe in. We offer best altering options to help you look classy.
                        </p>
                        <button className="service-btn">Enquire Now</button>
                    </div>
                    <div className="service-card">
                        <img src={home3} alt="Wedding Outfits" />
                        <h3>Wedding Outfit Tailoring</h3>
                        <p>
                            We help you make your big day special by providing creative stitching designs that make you shine. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>
                        <button className="service-btn">Enquire Now</button>
                    </div>
                    <div className="service-card">
                        <img src={home4} alt="Home Visit" />
                        <h3>Home Visit Tailor Services</h3>
                        <p>
                            Our tailoring experts visit your place for measurements to match your busy schedule and convenience. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>
                        <button className="service-btn">Enquire Now</button>
                    </div>
                </div>
            </section>
        </div>
    );
};
