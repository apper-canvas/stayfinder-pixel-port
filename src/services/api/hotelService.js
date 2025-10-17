import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class HotelService {
  constructor() {
    this.tableName = 'hotel_c';
  }

  parseHotel(hotel) {
    // Parse JSON fields
    try {
      return {
        ...hotel,
        photos: hotel.photos_c ? JSON.parse(hotel.photos_c) : [],
        amenities: hotel.amenities_c ? JSON.parse(hotel.amenities_c) : [],
        policies: hotel.policies_c ? JSON.parse(hotel.policies_c) : { checkIn: '3:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation' },
        name: hotel.name_c || hotel.Name || '',
        starRating: hotel.star_rating_c || 0,
        description: hotel.description_c || '',
        address: hotel.address_c || '',
        city: hotel.city_c || '',
        country: hotel.country_c || '',
        coordinates: hotel.coordinates_c || '',
        contactEmail: hotel.contact_email_c || '',
        contactPhone: hotel.contact_phone_c || '',
        checkInTime: hotel.check_in_time_c || '3:00 PM',
        checkOutTime: hotel.check_out_time_c || '11:00 AM',
        distanceFromCenter: hotel.distance_from_center_c || 0,
        averageRating: hotel.average_rating_c || 0,
        reviewCount: hotel.review_count_c || 0
      };
    } catch (error) {
      console.error('Error parsing hotel data:', error);
      return hotel;
    }
  }

  async getAllHotels() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'star_rating_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'country_c' } },
          { field: { Name: 'coordinates_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'amenities_c' } },
          { field: { Name: 'policies_c' } },
          { field: { Name: 'contact_email_c' } },
          { field: { Name: 'contact_phone_c' } },
          { field: { Name: 'check_in_time_c' } },
          { field: { Name: 'check_out_time_c' } },
          { field: { Name: 'distance_from_center_c' } },
          { field: { Name: 'average_rating_c' } },
          { field: { Name: 'review_count_c' } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(hotel => this.parseHotel(hotel));
    } catch (error) {
      console.error('Error fetching hotels:', error?.response?.data?.message || error);
      toast.error('Failed to load hotels');
      return [];
    }
  }

  async getHotelById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById(this.tableName, id, {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'star_rating_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'country_c' } },
          { field: { Name: 'coordinates_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'amenities_c' } },
          { field: { Name: 'policies_c' } },
          { field: { Name: 'contact_email_c' } },
          { field: { Name: 'contact_phone_c' } },
          { field: { Name: 'check_in_time_c' } },
          { field: { Name: 'check_out_time_c' } },
          { field: { Name: 'distance_from_center_c' } },
          { field: { Name: 'average_rating_c' } },
          { field: { Name: 'review_count_c' } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Hotel not found');
      }

      return this.parseHotel(response.data);
    } catch (error) {
      console.error(`Error fetching hotel ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async searchHotels(searchParams) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const whereGroups = [];
      
      // Destination filter
      if (searchParams.destination) {
        const searchTerm = searchParams.destination;
        whereGroups.push({
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "city_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "country_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "name_c", operator: "Contains", values: [searchTerm] }
              ],
              operator: "OR"
            }
          ]
        });
      }

      // Star rating filter
      if (searchParams.starRatings && searchParams.starRatings.length > 0) {
        whereGroups.push({
          operator: "OR",
          subGroups: [
            {
              conditions: searchParams.starRatings.map(rating => ({
                fieldName: "star_rating_c",
                operator: "EqualTo",
                values: [rating]
              })),
              operator: "OR"
            }
          ]
        });
      }

      // Sort configuration
      let orderBy = [];
      if (searchParams.sortBy) {
        switch (searchParams.sortBy) {
          case "rating":
            orderBy = [{ fieldName: "average_rating_c", sorttype: "DESC" }];
            break;
          case "distance":
            orderBy = [{ fieldName: "distance_from_center_c", sorttype: "ASC" }];
            break;
          default:
            orderBy = [{ fieldName: "average_rating_c", sorttype: "DESC" }];
        }
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'star_rating_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'country_c' } },
          { field: { Name: 'coordinates_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'amenities_c' } },
          { field: { Name: 'policies_c' } },
          { field: { Name: 'contact_email_c' } },
          { field: { Name: 'contact_phone_c' } },
          { field: { Name: 'check_in_time_c' } },
          { field: { Name: 'check_out_time_c' } },
          { field: { Name: 'distance_from_center_c' } },
          { field: { Name: 'average_rating_c' } },
          { field: { Name: 'review_count_c' } }
        ],
        whereGroups: whereGroups.length > 0 ? whereGroups : undefined,
        orderBy,
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      let results = response.data.map(hotel => this.parseHotel(hotel));

      // Client-side amenity filtering (if needed)
      if (searchParams.amenities && searchParams.amenities.length > 0) {
        results = results.filter(hotel =>
          searchParams.amenities.every(amenity =>
            hotel.amenities.includes(amenity)
          )
        );
      }

      // Client-side price filtering (using estimated price)
      if (searchParams.priceRange) {
        const { min, max } = searchParams.priceRange;
        results = results.filter(hotel => {
          const estimatedPrice = hotel.starRating * 100;
          return estimatedPrice >= min && estimatedPrice <= max;
        });
      }

      return results;
    } catch (error) {
      console.error('Error searching hotels:', error?.response?.data?.message || error);
      toast.error('Failed to search hotels');
      return [];
    }
  }

  async getDestinationSuggestions(query) {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: 'city_c' } },
          { field: { Name: 'country_c' } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [
              { fieldName: "city_c", operator: "Contains", values: [query] },
              { fieldName: "country_c", operator: "Contains", values: [query] }
            ],
            operator: "OR"
          }]
        }],
        pagingInfo: { limit: 20, offset: 0 }
      });

      if (!response.success) {
        return [];
      }

      const suggestions = [];
      const seen = new Set();

      response.data.forEach(hotel => {
        const cityMatch = `${hotel.city_c}, ${hotel.country_c}`;
        if (!seen.has(cityMatch)) {
          seen.add(cityMatch);
          suggestions.push({
            value: cityMatch,
            label: cityMatch,
            type: "city"
          });
        }
      });

      return suggestions.slice(0, 5);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  async getFeaturedHotels() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'star_rating_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'country_c' } },
          { field: { Name: 'coordinates_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'amenities_c' } },
          { field: { Name: 'policies_c' } },
          { field: { Name: 'contact_email_c' } },
          { field: { Name: 'contact_phone_c' } },
          { field: { Name: 'check_in_time_c' } },
          { field: { Name: 'check_out_time_c' } },
          { field: { Name: 'distance_from_center_c' } },
          { field: { Name: 'average_rating_c' } },
          { field: { Name: 'review_count_c' } }
        ],
        orderBy: [{ fieldName: "average_rating_c", sorttype: "DESC" }],
        pagingInfo: { limit: 3, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(hotel => this.parseHotel(hotel));
    } catch (error) {
      console.error('Error fetching featured hotels:', error);
      return [];
    }
  }
}

const hotelService = new HotelService();
export default hotelService;