// src/pages/ExplorePage.js
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import styles from "../styles/ExplorePage.module.css";

function ExplorePage() {
  const [searchParams] = useSearchParams();
  const selectedVibe = searchParams.get('vibe') || '';

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // טעינת רשימת מדינות מ-REST Countries API
  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
        const data = await response.json();

        // Convert to format suitable for react-select
        const formattedCountries = data.map(country => ({
          value: country.cca2,
          label: `${country.flag} ${country.name.common}`,
          name: country.name.common,
          code: country.cca2
        }));

        // Sort alphabetically
        formattedCountries.sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        console.log('Loaded countries:', formattedCountries.length);
      } catch (error) {
        console.error('Failed to load countries:', error);
        // Fallback to mock data
        const mockCountries = [
          { value: 'IL', label: '🇮🇱 Israel', name: 'Israel', code: 'IL' },
          { value: 'US', label: '🇺🇸 United States', name: 'United States', code: 'US' },
          { value: 'FR', label: '🇫🇷 France', name: 'France', code: 'FR' },
          { value: 'JP', label: '🇯🇵 Japan', name: 'Japan', code: 'JP' },
          { value: 'IT', label: '🇮🇹 Italy', name: 'Italy', code: 'IT' },
          { value: 'ES', label: '🇪🇸 Spain', name: 'Spain', code: 'ES' },
          { value: 'DE', label: '🇩🇪 Germany', name: 'Germany', code: 'DE' },
          { value: 'GB', label: '🇬🇧 United Kingdom', name: 'United Kingdom', code: 'GB' }
        ];
        setCountries(mockCountries);
        setError('Using demo data - API temporarily unavailable');
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  // טעינת ערים כשמדינה נבחרת
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedCountry) {
        setCities([]);
        setSelectedCity(null);
        return;
      }

      try {
        // Using countriesnow API for cities (free API)
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country: selectedCountry.name
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            const formattedCities = data.data.slice(0, 20).map(city => ({
              value: city,
              label: city
            }));
            setCities(formattedCities);
          } else {
            throw new Error('Invalid API response');
          }
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
        // Fallback to mock cities based on country
        const mockCitiesByCountry = {
          'IL': ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beer Sheva', 'Eilat', 'Netanya', 'Herzliya'],
          'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio'],
          'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg'],
          'JP': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe'],
          'IT': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna'],
          'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia'],
          'DE': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf'],
          'GB': ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds', 'Newcastle', 'Bristol']
        };

        const mockCities = mockCitiesByCountry[selectedCountry?.code] || ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beer Sheva', 'Eilat'];
        const formattedCities = mockCities.map(city => ({
          value: city,
          label: city
        }));

        setCities(formattedCities);
        if (!error) setError('Using demo data for cities - API temporarily unavailable');
      }
    };

    loadCities();
  }, [selectedCountry]);

  const handleSearch = () => {
    if (!selectedCountry || !selectedCity) {
      setError('Please select both country and city');
      return;
    }

    // כאן נוסיף את החיפוש בפועל
    alert(`Searching for ${selectedVibe} places in ${selectedCity.label}, ${selectedCountry.label}`);
  };

  return (
    <div className={`container ${styles.exploreContainer}`}>
      <div className={`box ${styles.searchBox}`}>
        <h1 className="title is-2 has-text-centered has-text-primary">
          🌍 Explore Destinations
        </h1>
        <p className="subtitle is-5 has-text-centered has-text-grey mb-5">
          Find amazing places that match your travel vibe
        </p>

        {/* בחירת ווייב */}
        <div className="field">
          <label className="label">Selected Travel Vibe</label>
          <div className="control">
            <div className={`select is-fullwidth ${selectedVibe ? 'is-success' : ''}`}>
              <select value={selectedVibe} disabled>
                <option value="">{selectedVibe ? `${selectedVibe} vibe selected` : 'No vibe selected'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* בחירת מדינה */}
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Country</label>
              <div className="control">
                <Select
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  options={countries}
                  isLoading={loading}
                  placeholder="Search and select a country..."
                  isClearable
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: '#dbdbdb',
                      '&:hover': {
                        borderColor: '#b5b5b5'
                      }
                    })
                  }}
                />
              </div>
            </div>
          </div>

          <div className="column">
            <div className="field">
              <label className="label">City</label>
              <div className="control">
                <Select
                  value={selectedCity}
                  onChange={setSelectedCity}
                  options={cities}
                  isDisabled={!selectedCountry}
                  placeholder={selectedCountry ? "Search and select a city..." : "Select a country first"}
                  isClearable
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: '#dbdbdb',
                      '&:hover': {
                        borderColor: '#b5b5b5'
                      }
                    })
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* כפתור חיפוש */}
        <div className="field">
          <div className="control">
            <button
              className={`button is-primary is-large is-fullwidth ${styles.searchButton}`}
              onClick={handleSearch}
              disabled={!selectedCountry || !selectedCity}
            >
              <span className="icon">
                <i className="fas fa-search"></i>
              </span>
              <span>Explore {selectedVibe ? selectedVibe.charAt(0).toUpperCase() + selectedVibe.slice(1) : ''} Places</span>
            </button>
          </div>
        </div>

        {/* הודעת שגיאה */}
        {error && (
          <div className="notification is-danger is-light">
            <button className="delete" onClick={() => setError('')}></button>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
