import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import styles from '../styles/Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.column}>
            <h2 className={styles.brandTitle}>Travel Vibes</h2>
            <p className={styles.brandDesc}>
              Curating unforgettable travel experiences based on your personal vibe. 
              Find your rhythm in the world.
            </p>
          </div>

          {/* Discover Column */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Discover</h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}><Link to="/vibes" className={styles.link}>Vibes</Link></li>
              <li className={styles.linkItem}><Link to="/explore" className={styles.link}>Explore</Link></li>
              <li className={styles.linkItem}><Link to="/create-trip" className={styles.link}>Plan a Trip</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Company</h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <a 
                  href="#about" 
                  onClick={(e) => {
                    e.preventDefault();
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={styles.link}
                  style={{cursor: 'pointer'}}
                >
                  About Us
                </a>
              </li>
              <li className={styles.linkItem}><span className={styles.link} style={{cursor: 'pointer'}}>Careers</span></li>
              <li className={styles.linkItem}><span className={styles.link} style={{cursor: 'pointer'}}>Contact</span></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className={styles.column}>
            <h3 className={styles.heading}>Follow Us</h3>
            <div className={styles.socialLinks}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaTwitter />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>&copy; {currentYear} Travel Vibes. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <span className={styles.legalLink} style={{cursor: 'pointer'}}>Privacy Policy</span>
            <span className={styles.legalLink} style={{cursor: 'pointer'}}>Terms of Service</span>
            <span className={styles.legalLink} style={{cursor: 'pointer'}}>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
