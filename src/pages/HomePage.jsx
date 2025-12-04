import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaHeart, FaCompass, FaGlobeAmericas, FaRoute } from 'react-icons/fa';
import styles from '../styles/HomePage.module.css';

function HomePage() {
  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section id="home" className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80" 
            alt="Beautiful beach destination" 
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={styles.heroContentWrapper}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>EXPLORE THE WORLD</span>
            <h1 className={styles.heroTitle}>
              Welcome to <span className={styles.highlight}>TravelVibes</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Discover your perfect travel experience. Choose your vibe, explore destinations, and plan your dream journey.
            </p>
            <Link to="/vibes" className={styles.ctaButton}>
              <span>Let's Get Started</span>
              <i className={`fas fa-arrow-right ${styles.ctaIcon}`}></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Plan Your Perfect Trip</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to discover, explore, and organize your next adventure in one place.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={`${styles.iconContainer} ${styles.iconVibe}`}>
              <FaCompass className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Find Your Vibe</h3>
            <p className={styles.cardDescription}>
              Nature? Culture? Food? Romance? Choose the vibe that suits you - we'll bring you the right destinations.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.iconContainer} ${styles.iconLocation}`}>
              <FaGlobeAmericas className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Filter by Country & City</h3>
            <p className={styles.cardDescription}>
              Pick your dream country and city. We'll recommend perfect places matching your vibe.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.iconContainer} ${styles.iconAttraction}`}>
              <FaMapMarkedAlt className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Browse Attractions</h3>
            <p className={styles.cardDescription}>
              View cards with a photo, location, type, hours, and rating. Save the ones you love.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.iconContainer} ${styles.iconItinerary}`}>
              <FaRoute className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Build Your Itinerary</h3>
            <p className={styles.cardDescription}>
              See all your favorite places in one list, and organize them into your dream trip.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.aboutSection}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutImageWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80" 
              alt="Traveler with backpack" 
              className={styles.aboutImage}
            />
          </div>
          
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutTitle}>Redefining How You Travel</h2>
            <p className={styles.aboutText}>
              Travel Vibes isn't just another booking site. We believe that the best journeys start with a <strong>feeling</strong>. Whether you're craving the energy of a bustling city night, the peace of a forest clearing, the flavors of a local market, or the quiet comfort of a sunset promenade, we understand that <em>vibes matter</em>.
            </p>
            <p className={styles.aboutText}>
              Born from a passion for exploration and built with a community of travelers, we've curated experiences over towns, maps. Let us guide you to your next unforgettable memory.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <h4>50k+</h4>
                <p>Happy Travelers</p>
              </div>
              <div className={styles.statItem}>
                <h4>120+</h4>
                <p>Countries</p>
              </div>
              <div className={styles.statItem}>
                <h4>1M+</h4>
                <p>Vibes Matched</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What Travelers Say</h2>
          <p className={styles.sectionSubtitle}>Real stories from people who found their perfect place.</p>
        </div>
        
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className={styles.quoteText}>"I used to spend hours researching. With Travel Vibes, I just clicked 'Nature' and found the most incredible hidden gems in Costa Rica."</p>
            <div className={styles.userInfo}>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Sarah Jenkins" className={styles.userAvatar} />
              <div className={styles.userName}>
                <h5>Sarah Jenkins</h5>
                <span>Nature Lover</span>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.stars}>
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className={styles.quoteText}>"The 'Foodie' vibe suggestions were spot on! I ate my way through Tokyo and discovered places I never would have found on my own."</p>
            <div className={styles.userInfo}>
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Mike Ross" className={styles.userAvatar} />
              <div className={styles.userName}>
                <h5>Mike Ross</h5>
                <span>Culinary Explorer</span>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.stars}>
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className={styles.quoteText}>"Finally, a travel site that understands it's about the *feeling*. The Romantic Escape vibe helped me plan the perfect anniversary trip."</p>
            <div className={styles.userInfo}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Emily Chen" className={styles.userAvatar} />
              <div className={styles.userName}>
                <h5>Emily Chen</h5>
                <span>Romantic Traveler</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
