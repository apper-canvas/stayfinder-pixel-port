import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class ReviewService {
  constructor() {
    this.tableName = 'review_c';
  }

  parseReview(review) {
    try {
      return {
        ...review,
        hotelId: review.hotel_id_c?.Id || review.hotel_id_c,
        bookingId: review.booking_id_c?.Id || review.booking_id_c,
        userId: review.Owner?.Id || review.Owner || '',
        overallRating: review.overall_rating_c || 0,
        cleanlinessRating: review.cleanliness_rating_c || 0,
        comfortRating: review.comfort_rating_c || 0,
        locationRating: review.location_rating_c || 0,
        valueRating: review.value_rating_c || 0,
        reviewText: review.review_text_c || '',
        photos: review.photos_c ? JSON.parse(review.photos_c) : [],
        travelerType: review.traveler_type_c || '',
        helpfulVotes: review.helpful_votes_c || 0,
        createdAt: review.CreatedOn || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing review data:', error);
      return review;
    }
  }

  async getAllReviews() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'hotel_id_c' } },
          { field: { Name: 'booking_id_c' } },
          { field: { Name: 'overall_rating_c' } },
          { field: { Name: 'cleanliness_rating_c' } },
          { field: { Name: 'comfort_rating_c' } },
          { field: { Name: 'location_rating_c' } },
          { field: { Name: 'value_rating_c' } },
          { field: { Name: 'review_text_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'traveler_type_c' } },
          { field: { Name: 'helpful_votes_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'Owner' } }
        ],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(review => this.parseReview(review));
    } catch (error) {
      console.error('Error fetching reviews:', error?.response?.data?.message || error);
      toast.error('Failed to load reviews');
      return [];
    }
  }

  async getReviewById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById(this.tableName, id, {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'hotel_id_c' } },
          { field: { Name: 'booking_id_c' } },
          { field: { Name: 'overall_rating_c' } },
          { field: { Name: 'cleanliness_rating_c' } },
          { field: { Name: 'comfort_rating_c' } },
          { field: { Name: 'location_rating_c' } },
          { field: { Name: 'value_rating_c' } },
          { field: { Name: 'review_text_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'traveler_type_c' } },
          { field: { Name: 'helpful_votes_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'Owner' } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Review not found');
      }

      return this.parseReview(response.data);
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getHotelReviews(hotelId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'hotel_id_c' } },
          { field: { Name: 'booking_id_c' } },
          { field: { Name: 'overall_rating_c' } },
          { field: { Name: 'cleanliness_rating_c' } },
          { field: { Name: 'comfort_rating_c' } },
          { field: { Name: 'location_rating_c' } },
          { field: { Name: 'value_rating_c' } },
          { field: { Name: 'review_text_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'traveler_type_c' } },
          { field: { Name: 'helpful_votes_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'Owner' } }
        ],
        where: [{
          FieldName: 'hotel_id_c',
          Operator: 'EqualTo',
          Values: [parseInt(hotelId)]
        }],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(review => this.parseReview(review));
    } catch (error) {
      console.error(`Error fetching hotel reviews:`, error);
      return [];
    }
  }

  async getUserReviews(userId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'hotel_id_c' } },
          { field: { Name: 'booking_id_c' } },
          { field: { Name: 'overall_rating_c' } },
          { field: { Name: 'cleanliness_rating_c' } },
          { field: { Name: 'comfort_rating_c' } },
          { field: { Name: 'location_rating_c' } },
          { field: { Name: 'value_rating_c' } },
          { field: { Name: 'review_text_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'traveler_type_c' } },
          { field: { Name: 'helpful_votes_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'Owner' } }
        ],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        return [];
      }

      return response.data.map(review => this.parseReview(review));
    } catch (error) {
      console.error(`Error fetching user reviews:`, error);
      return [];
    }
  }

  async createReview(reviewData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      if (!reviewData.photos || !Array.isArray(reviewData.photos)) {
        reviewData.photos = [];
      }

      const requiredFields = ['cleanlinessRating', 'comfortRating', 'locationRating', 'valueRating', 'overallRating'];
      for (const field of requiredFields) {
        if (!reviewData[field] || reviewData[field] < 1 || reviewData[field] > 5) {
          throw new Error(`Invalid ${field}: must be between 1 and 5`);
        }
      }

      const payload = {
        records: [{
          Name: `Review for Hotel ${reviewData.hotelId}`,
          hotel_id_c: parseInt(reviewData.hotelId),
          booking_id_c: reviewData.bookingId ? parseInt(reviewData.bookingId) : null,
          overall_rating_c: parseInt(reviewData.overallRating),
          cleanliness_rating_c: parseInt(reviewData.cleanlinessRating),
          comfort_rating_c: parseInt(reviewData.comfortRating),
          location_rating_c: parseInt(reviewData.locationRating),
          value_rating_c: parseInt(reviewData.valueRating),
          review_text_c: reviewData.reviewText || '',
          photos_c: JSON.stringify(reviewData.photos),
          traveler_type_c: reviewData.travelerType || '',
          helpful_votes_c: 0
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create review');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create review');
        }
        
        if (successful.length > 0) {
          return this.parseReview(successful[0].data);
        }
      }

      throw new Error('Failed to create review');
    } catch (error) {
      console.error('Error creating review:', error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateReview(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(updateData.overallRating && { overall_rating_c: parseInt(updateData.overallRating) }),
          ...(updateData.cleanlinessRating && { cleanliness_rating_c: parseInt(updateData.cleanlinessRating) }),
          ...(updateData.comfortRating && { comfort_rating_c: parseInt(updateData.comfortRating) }),
          ...(updateData.locationRating && { location_rating_c: parseInt(updateData.locationRating) }),
          ...(updateData.valueRating && { value_rating_c: parseInt(updateData.valueRating) }),
          ...(updateData.reviewText !== undefined && { review_text_c: updateData.reviewText }),
          ...(updateData.travelerType && { traveler_type_c: updateData.travelerType }),
          ...(updateData.photos && { photos_c: JSON.stringify(updateData.photos) })
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update review');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update review');
        }
        
        if (successful.length > 0) {
          return this.parseReview(successful[0].data);
        }
      }

      throw new Error('Failed to update review');
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  async deleteReview(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to delete review');
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete review');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  async getReviewStats(hotelId) {
    try {
      const hotelReviews = await this.getHotelReviews(hotelId);
      
      if (hotelReviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          categoryAverages: {
            cleanliness: 0,
            comfort: 0,
            location: 0,
            value: 0
          }
        };
      }
      
      const totalReviews = hotelReviews.length;
      const averageRating = hotelReviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews;
      
      const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      hotelReviews.forEach(review => {
        ratingBreakdown[review.overallRating]++;
      });
      
      const categoryAverages = {
        cleanliness: hotelReviews.reduce((sum, r) => sum + r.cleanlinessRating, 0) / totalReviews,
        comfort: hotelReviews.reduce((sum, r) => sum + r.comfortRating, 0) / totalReviews,
        location: hotelReviews.reduce((sum, r) => sum + r.locationRating, 0) / totalReviews,
        value: hotelReviews.reduce((sum, r) => sum + r.valueRating, 0) / totalReviews
      };
      
      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingBreakdown,
        categoryAverages
      };
    } catch (error) {
      console.error('Error calculating review stats:', error);
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        categoryAverages: {
          cleanliness: 0,
          comfort: 0,
          location: 0,
          value: 0
        }
      };
    }
  }
}

const reviewService = new ReviewService();
export default reviewService;