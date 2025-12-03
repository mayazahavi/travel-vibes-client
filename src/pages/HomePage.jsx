import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaHeart, FaCompass, FaWater, FaCity, FaMountain, FaUtensils } from 'react-icons/fa';
import styles from '../styles/HomePage.module.css';

function HomePage() {
  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Your <span className={styles.highlight}>Travel Vibe</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Don't just go somewhere. Feel something. 
            We help you find destinations that match your mood and style.
          </p>
          <Link to="/vibes" className={styles.ctaButton}>
            Find My Vibe
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <span className={styles.eyebrow}>ABOUT US</span>
              <h2 className={styles.sectionTitle}>More Than Just a Trip Planner</h2>
              <p className={styles.aboutText}>
                We believe travel is personal. It's not about checking off landmarks, 
                it's about the feeling you get when you're there. Whether you crave 
                urban energy, quiet nature, or culinary adventures, we curate the world for you.
              </p>
              
              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.iconWrapper}>
                    <FaCompass className={`${styles.featureIcon} ${styles.iconVibe}`} />
                  </div>
                  <h3 className={styles.featureTitle}>Vibe-Based Search</h3>
                  <p className={styles.featureDescription}>Filter destinations by how you want to feel, not just where you want to go.</p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.iconWrapper}>
                    <FaHeart className={`${styles.featureIcon} ${styles.iconLove}`} />
                  </div>
                  <h3 className={styles.featureTitle}>Curated Gems</h3>
                  <p className={styles.featureDescription}>Hand-picked locations that authentically match your selected travel style.</p>
                </div>
              </div>
            </div>
            
            <div className={styles.aboutImageWrapper}>
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80" 
                alt="Traveler looking at map" 
                className={styles.aboutImage}
              />
              <div className={styles.experienceBadge}>
                <span className={styles.badgeNumber}>10k+</span>
                <span className={styles.badgeText}>Trips Planned</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What Travelers Say</h2>
            <p className={styles.sectionSubtitle}>Real stories from people who found their perfect place.</p>
          </div>
          
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quoteText}>"I used to spend hours researching. With Travel Vibes, I just clicked 'Nature' and found the most incredible hidden gems in Costa Rica."</p>
              <div className={styles.userInfo}>
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Sarah Jenkins" className={styles.userAvatar} />
                <div>
                  <div className={styles.userName}>Sarah Jenkins</div>
                  <div className={styles.userRole}>Nature Lover</div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quoteText}>"The 'Foodie' vibe suggestions were spot on! I ate my way through Tokyo and discovered places I never would have found on my own."</p>
              <div className={styles.userInfo}>
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Mike Ross" className={styles.userAvatar} />
                <div>
                  <div className={styles.userName}>Mike Ross</div>
                  <div className={styles.userRole}>Culinary Explorer</div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quoteText}>"Finally, a travel site that understands it's about the *feeling*. The Romantic Escape vibe helped me plan the perfect anniversary trip."</p>
              <div className={styles.userInfo}>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Emily Chen" className={styles.userAvatar} />
                <div>
                  <div className={styles.userName}>Emily Chen</div>
                  <div className={styles.userRole}>Romantic Traveler</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
