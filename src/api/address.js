import axios from 'axios';

/**
 * Address Autocomplete API Module
 * 
 * Enhanced with multiple geocoding sources for better accuracy
 * - Nominatim (OpenStreetMap) for general address search
 * - Photon API for improved Canadian postal code accuracy
 * - Canadian postal code validation and formatting
 * Restricts results to Canada and United States only
 * 
 * @module api/address
 */

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';
const PHOTON_API = 'https://photon.komoot.io'; // Alternative geocoder with better postal codes

// Rate limiting: 1 request per second (Nominatim requirement)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

// Canadian postal code regex: A1A 1A1 or A1A1A1
const CANADIAN_POSTAL_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const US_ZIP_REGEX = /^\d{5}(-\d{4})?$/;

/**
 * Format Canadian postal code to standard format (A1A 1A1)
 * @param {string} postalCode - Raw postal code
 * @returns {string} Formatted postal code
 */
export const formatCanadianPostalCode = (postalCode) => {
  if (!postalCode) return '';
  
  // Remove all spaces and convert to uppercase
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
  
  // Check if it's a valid Canadian postal code
  if (cleaned.length === 6 && /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  
  return postalCode;
};

/**
 * Validate postal code format
 * @param {string} postalCode - Postal code to validate
 * @param {string} country - Country code ('CA' or 'US')
 * @returns {boolean} True if valid
 */
export const validatePostalCode = (postalCode, country = 'CA') => {
  if (!postalCode) return false;
  
  if (country === 'CA') {
    return CANADIAN_POSTAL_REGEX.test(postalCode.trim());
  } else if (country === 'US') {
    return US_ZIP_REGEX.test(postalCode.trim());
  }
  
  return false;
};

/**
 * Search for addresses with enhanced Canadian postal code accuracy
 * Uses multiple geocoding sources for better results
 * @param {string} query - Search query (partial address)
 * @param {string} country - Country code ('CA' or 'US')
 * @returns {Promise<Array>} Array of address suggestions
 */
export const searchAddress = async (query, country = 'CA') => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();

  try {
    let results = [];
    
    // Try Photon API first for Canadian addresses (better postal codes)
    if (country === 'CA') {
      try {
        const photonResults = await searchWithPhoton(query, country);
        results = photonResults;
      } catch (photonError) {
        console.warn('Photon API failed, falling back to Nominatim:', photonError);
      }
    }
    
    // If no results from Photon or for US addresses, use Nominatim
    if (results.length === 0) {
      results = await searchWithNominatim(query, country);
    }
    
    // Post-process results to ensure postal code formatting
    return results.map(result => ({
      ...result,
      address: {
        ...result.address,
        postalCode: country === 'CA' 
          ? formatCanadianPostalCode(result.address.postalCode) 
          : result.address.postalCode
      }
    }));

  } catch (error) {
    console.error('Address search error:', error);
    throw new Error('Failed to search addresses');
  }
};

/**
 * Search using Photon API (better for Canadian addresses)
 * @private
 */
const searchWithPhoton = async (query, country) => {
  const response = await axios.get(`${PHOTON_API}/api`, {
    params: {
      q: query,
      limit: 5,
      osm_tag: '!highway',  // Exclude highways from results
      lang: 'en'
    },
    timeout: 3000
  });

  if (!response.data?.features) {
    return [];
  }

  return response.data.features
    .filter(feature => {
      const countryCode = feature.properties.countrycode?.toUpperCase();
      return countryCode === country;
    })
    .map(feature => ({
      id: feature.properties.osm_id,
      displayName: feature.properties.name || formatPhotonAddress(feature.properties),
      address: parsePhotonAddress(feature.properties),
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      raw: feature
    }));
};

/**
 * Search using Nominatim API (fallback)
 * @private
 */
const searchWithNominatim = async (query, country) => {
  const response = await axios.get(`${NOMINATIM_API}/search`, {
    params: {
      q: query,
      format: 'json',
      addressdetails: 1,
      limit: 5,
      countrycodes: country.toLowerCase(),
    },
    headers: {
      'User-Agent': 'Zanobia-Ecommerce/1.0'
    }
  });

  return response.data.map(item => ({
    id: item.place_id,
    displayName: item.display_name,
    address: parseNominatimAddress(item.address),
    lat: item.lat,
    lon: item.lon,
    raw: item
  }));
};

/**
 * Parse Photon API address response into structured format
 * @param {Object} properties - Photon feature properties
 * @returns {Object} Structured address object
 */
const parsePhotonAddress = (properties) => {
  return {
    street: properties.street || '',
    houseNumber: properties.housenumber || '',
    city: properties.city || properties.municipality || properties.town || properties.village || '',
    state: properties.state || properties.province || '',
    postalCode: properties.postcode || '',
    country: properties.countrycode?.toUpperCase() || '',
    suburb: properties.district || properties.neighbourhood || '',
  };
};

/**
 * Format Photon address for display
 * @param {Object} properties - Photon feature properties
 * @returns {string} Formatted address string
 */
const formatPhotonAddress = (properties) => {
  const parts = [];
  
  if (properties.housenumber && properties.street) {
    parts.push(`${properties.housenumber} ${properties.street}`);
  } else if (properties.street) {
    parts.push(properties.street);
  }
  
  if (properties.city) parts.push(properties.city);
  if (properties.state) parts.push(properties.state);
  if (properties.postcode) parts.push(properties.postcode);
  
  return parts.join(', ');
};

/**
 * Parse Nominatim address response into structured format
 * @param {Object} nominatimAddress - Raw address object from Nominatim
 * @returns {Object} Structured address object
 */
const parseNominatimAddress = (nominatimAddress) => {
  return {
    street: nominatimAddress.road || nominatimAddress.pedestrian || '',
    houseNumber: nominatimAddress.house_number || '',
    city: nominatimAddress.city || nominatimAddress.town || nominatimAddress.village || nominatimAddress.municipality || '',
    state: nominatimAddress.state || nominatimAddress.province || '',
    postalCode: nominatimAddress.postcode || '',
    country: nominatimAddress.country_code?.toUpperCase() || '',
    suburb: nominatimAddress.suburb || nominatimAddress.neighbourhood || '',
  };
};

/**
 * Validate if address is in allowed countries (Canada or US)
 * @param {string} country - Country code
 * @returns {boolean} True if valid country
 */
export const isValidCountry = (country) => {
  const allowedCountries = ['CA', 'US'];
  return allowedCountries.includes(country?.toUpperCase());
};

/**
 * Format address for display
 * @param {Object} address - Address object
 * @returns {string} Formatted address string
 */
export const formatAddressDisplay = (address) => {
  const parts = [];
  
  if (address.houseNumber && address.street) {
    parts.push(`${address.houseNumber} ${address.street}`);
  } else if (address.street) {
    parts.push(address.street);
  }
  
  if (address.suburb) {
    parts.push(address.suburb);
  }
  
  if (address.city) {
    parts.push(address.city);
  }
  
  if (address.state) {
    parts.push(address.state);
  }
  
  if (address.postalCode) {
    parts.push(address.postalCode);
  }
  
  if (address.country) {
    const countryName = address.country === 'CA' ? 'Canada' : address.country === 'US' ? 'United States' : address.country;
    parts.push(countryName);
  }
  
  return parts.join(', ');
};

/**
 * Reverse geocode coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Address object
 */
export const reverseGeocode = async (lat, lon) => {
  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();

  try {
    const response = await axios.get(`${NOMINATIM_API}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'Zanobia-Ecommerce/1.0'
      }
    });

    const address = parseNominatimAddress(response.data.address);
    
    // Format Canadian postal codes
    if (address.country === 'CA' && address.postalCode) {
      address.postalCode = formatCanadianPostalCode(address.postalCode);
    }
    
    return address;
  } catch (error) {
    console.error('Reverse geocode error:', error);
    throw new Error('Failed to get address from coordinates');
  }
};

/**
 * Get user's current location and convert to address
 * @returns {Promise<Object>} Address object
 */
export const getUserLocationAddress = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const address = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          
          if (!isValidCountry(address.country)) {
            reject(new Error('Your location is outside our service area (Canada & US only)'));
            return;
          }
          
          resolve(address);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error('Failed to get your location'));
      }
    );
  });
};

export default {
  searchAddress,
  isValidCountry,
  formatAddressDisplay,
  reverseGeocode,
  getUserLocationAddress,
  formatCanadianPostalCode,
  validatePostalCode
};


