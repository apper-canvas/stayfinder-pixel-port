import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class BookingService {
  constructor() {
    this.tableName = 'booking_c';
  }

  generateConfirmationNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BK-${timestamp}-${random}`;
  }

  parseBooking(booking) {
    try {
      return {
        ...booking,
        hotelId: booking.hotel_id_c?.Id || booking.hotel_id_c,
        roomId: booking.room_id_c?.Id || booking.room_id_c,
        confirmationNumber: booking.confirmation_number_c || booking.Name || '',
        checkInDate: booking.check_in_date_c || '',
        checkOutDate: booking.check_out_date_c || '',
        guestCount: booking.guest_count_c || 0,
        guestName: booking.guest_name_c || '',
        guestEmail: booking.guest_email_c || '',
        guestPhone: booking.guest_phone_c || '',
        specialRequests: booking.special_requests_c || '',
        promoCode: booking.promo_code_c || '',
        subtotal: booking.subtotal_c || 0,
        taxes: booking.taxes_c || 0,
        discount: booking.discount_c || 0,
        totalAmount: booking.total_amount_c || 0,
        paymentStatus: booking.payment_status_c || 'pending',
        paymentMethod: booking.payment_method_c || '',
        bookingStatus: booking.booking_status_c || 'confirmed',
        cancellationPolicy: booking.cancellation_policy_c || 'Free cancellation up to 24 hours before check-in'
      };
    } catch (error) {
      console.error('Error parsing booking data:', error);
      return booking;
    }
  }

  async getAllBookings() {
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
          { field: { Name: 'room_id_c' } },
          { field: { Name: 'confirmation_number_c' } },
          { field: { Name: 'check_in_date_c' } },
          { field: { Name: 'check_out_date_c' } },
          { field: { Name: 'guest_count_c' } },
          { field: { Name: 'guest_name_c' } },
          { field: { Name: 'guest_email_c' } },
          { field: { Name: 'guest_phone_c' } },
          { field: { Name: 'special_requests_c' } },
          { field: { Name: 'promo_code_c' } },
          { field: { Name: 'subtotal_c' } },
          { field: { Name: 'taxes_c' } },
          { field: { Name: 'discount_c' } },
          { field: { Name: 'total_amount_c' } },
          { field: { Name: 'payment_status_c' } },
          { field: { Name: 'payment_method_c' } },
          { field: { Name: 'booking_status_c' } },
          { field: { Name: 'cancellation_policy_c' } }
        ],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(booking => this.parseBooking(booking));
    } catch (error) {
      console.error('Error fetching bookings:', error?.response?.data?.message || error);
      toast.error('Failed to load bookings');
      return [];
    }
  }

  async getBookingById(id) {
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
          { field: { Name: 'room_id_c' } },
          { field: { Name: 'confirmation_number_c' } },
          { field: { Name: 'check_in_date_c' } },
          { field: { Name: 'check_out_date_c' } },
          { field: { Name: 'guest_count_c' } },
          { field: { Name: 'guest_name_c' } },
          { field: { Name: 'guest_email_c' } },
          { field: { Name: 'guest_phone_c' } },
          { field: { Name: 'special_requests_c' } },
          { field: { Name: 'promo_code_c' } },
          { field: { Name: 'subtotal_c' } },
          { field: { Name: 'taxes_c' } },
          { field: { Name: 'discount_c' } },
          { field: { Name: 'total_amount_c' } },
          { field: { Name: 'payment_status_c' } },
          { field: { Name: 'payment_method_c' } },
          { field: { Name: 'booking_status_c' } },
          { field: { Name: 'cancellation_policy_c' } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Booking not found');
      }

      return this.parseBooking(response.data);
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getBookingByConfirmation(confirmationNumber) {
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
          { field: { Name: 'room_id_c' } },
          { field: { Name: 'confirmation_number_c' } },
          { field: { Name: 'check_in_date_c' } },
          { field: { Name: 'check_out_date_c' } },
          { field: { Name: 'guest_count_c' } },
          { field: { Name: 'guest_name_c' } },
          { field: { Name: 'guest_email_c' } },
          { field: { Name: 'guest_phone_c' } },
          { field: { Name: 'special_requests_c' } },
          { field: { Name: 'promo_code_c' } },
          { field: { Name: 'subtotal_c' } },
          { field: { Name: 'taxes_c' } },
          { field: { Name: 'discount_c' } },
          { field: { Name: 'total_amount_c' } },
          { field: { Name: 'payment_status_c' } },
          { field: { Name: 'payment_method_c' } },
          { field: { Name: 'booking_status_c' } },
          { field: { Name: 'cancellation_policy_c' } }
        ],
        where: [{
          FieldName: 'confirmation_number_c',
          Operator: 'EqualTo',
          Values: [confirmationNumber]
        }],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error('Booking not found');
      }

      return this.parseBooking(response.data[0]);
    } catch (error) {
      console.error(`Error fetching booking by confirmation ${confirmationNumber}:`, error);
      throw error;
    }
  }

  async getUserBookings(userId) {
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
          { field: { Name: 'room_id_c' } },
          { field: { Name: 'confirmation_number_c' } },
          { field: { Name: 'check_in_date_c' } },
          { field: { Name: 'check_out_date_c' } },
          { field: { Name: 'guest_count_c' } },
          { field: { Name: 'guest_name_c' } },
          { field: { Name: 'guest_email_c' } },
          { field: { Name: 'guest_phone_c' } },
          { field: { Name: 'special_requests_c' } },
          { field: { Name: 'promo_code_c' } },
          { field: { Name: 'subtotal_c' } },
          { field: { Name: 'taxes_c' } },
          { field: { Name: 'discount_c' } },
          { field: { Name: 'total_amount_c' } },
          { field: { Name: 'payment_status_c' } },
          { field: { Name: 'payment_method_c' } },
          { field: { Name: 'booking_status_c' } },
          { field: { Name: 'cancellation_policy_c' } }
        ],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(booking => this.parseBooking(booking));
    } catch (error) {
      console.error(`Error fetching user bookings:`, error);
      return [];
    }
  }

  async createBooking(bookingData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const confirmationNumber = this.generateConfirmationNumber();

      const payload = {
        records: [{
          Name: confirmationNumber,
          hotel_id_c: parseInt(bookingData.hotelId),
          room_id_c: bookingData.roomId ? parseInt(bookingData.roomId) : null,
          confirmation_number_c: confirmationNumber,
          check_in_date_c: bookingData.checkInDate,
          check_out_date_c: bookingData.checkOutDate,
          guest_count_c: parseInt(bookingData.guestCount),
          guest_name_c: bookingData.guestName,
          guest_email_c: bookingData.guestEmail,
          guest_phone_c: bookingData.guestPhone,
          special_requests_c: bookingData.specialRequests || '',
          promo_code_c: bookingData.promoCode || '',
          subtotal_c: parseFloat(bookingData.subtotal),
          taxes_c: parseFloat(bookingData.taxes),
          discount_c: parseFloat(bookingData.discount || 0),
          total_amount_c: parseFloat(bookingData.totalAmount),
          payment_status_c: 'pending',
          payment_method_c: bookingData.paymentMethod || 'credit-card',
          booking_status_c: 'confirmed',
          cancellation_policy_c: 'Free cancellation up to 24 hours before check-in'
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create booking');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create booking:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create booking');
        }
        
        if (successful.length > 0) {
          return this.parseBooking(successful[0].data);
        }
      }

      throw new Error('Failed to create booking');
    } catch (error) {
      console.error('Error creating booking:', error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateBooking(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          ...(updateData.checkInDate && { check_in_date_c: updateData.checkInDate }),
          ...(updateData.checkOutDate && { check_out_date_c: updateData.checkOutDate }),
          ...(updateData.guestCount && { guest_count_c: parseInt(updateData.guestCount) }),
          ...(updateData.guestName && { guest_name_c: updateData.guestName }),
          ...(updateData.guestEmail && { guest_email_c: updateData.guestEmail }),
          ...(updateData.guestPhone && { guest_phone_c: updateData.guestPhone }),
          ...(updateData.specialRequests !== undefined && { special_requests_c: updateData.specialRequests }),
          ...(updateData.bookingStatus && { booking_status_c: updateData.bookingStatus }),
          ...(updateData.paymentStatus && { payment_status_c: updateData.paymentStatus })
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update booking');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update booking:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update booking');
        }
        
        if (successful.length > 0) {
          return this.parseBooking(successful[0].data);
        }
      }

      throw new Error('Failed to update booking');
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async cancelBooking(id, reason) {
    try {
      return await this.updateBooking(id, {
        bookingStatus: 'cancelled',
        specialRequests: reason
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async validatePromoCode(code) {
    // Simulate promo code validation
    const promoCodes = {
      'SAVE10': { discount: 0.10, description: '10% off' },
      'SAVE20': { discount: 0.20, description: '20% off' },
      'WELCOME': { discount: 0.15, description: '15% off first booking' }
    };

    return promoCodes[code.toUpperCase()] || { discount: 0, description: 'Invalid code' };
  }

  calculateBookingTotal(subtotal, taxes, discount = 0) {
    return subtotal + taxes - discount;
  }

  calculateTaxes(subtotal, taxRate = 0.12) {
    return subtotal * taxRate;
  }

  calculateDiscount(subtotal, discountRate) {
    return subtotal * discountRate;
  }
}

const bookingService = new BookingService();
export default bookingService;