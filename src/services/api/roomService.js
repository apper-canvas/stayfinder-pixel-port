import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class RoomService {
  constructor() {
    this.tableName = 'room_c';
  }

  parseRoom(room) {
    try {
      return {
        ...room,
        hotelId: room.hotel_id_c?.Id || room.hotel_id_c,
        name: room.name_c || room.Name || '',
        type: room.type_c || '',
        capacity: room.capacity_c || 0,
        bedConfiguration: room.bed_configuration_c || '',
        photos: room.photos_c ? JSON.parse(room.photos_c) : [],
        amenities: room.amenities_c ? JSON.parse(room.amenities_c) : [],
        pricePerNight: room.price_per_night_c || 0,
        available: room.available_c !== undefined ? room.available_c : true,
        maxOccupancy: room.max_occupancy_c || room.capacity_c || 0
      };
    } catch (error) {
      console.error('Error parsing room data:', error);
      return room;
    }
  }

  async getAllRooms() {
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
          { field: { Name: 'name_c' } },
          { field: { Name: 'type_c' } },
          { field: { Name: 'capacity_c' } },
          { field: { Name: 'bed_configuration_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'amenities_c' } },
          { field: { Name: 'price_per_night_c' } },
          { field: { Name: 'available_c' } },
          { field: { Name: 'max_occupancy_c' } }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(room => this.parseRoom(room));
    } catch (error) {
      console.error('Error fetching rooms:', error?.response?.data?.message || error);
      toast.error('Failed to load rooms');
      return [];
    }
  }

  async getRoomById(id) {
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
          { field: { Name: 'name_c' } },
          { field: { Name: 'type_c' } },
          { field: { Name: 'capacity_c' } },
          { field: { Name: 'bed_configuration_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'amenities_c' } },
          { field: { Name: 'price_per_night_c' } },
          { field: { Name: 'available_c' } },
          { field: { Name: 'max_occupancy_c' } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Room not found');
      }

      return this.parseRoom(response.data);
    } catch (error) {
      console.error(`Error fetching room ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getRoomsByHotelId(hotelId) {
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
          { field: { Name: 'name_c' } },
          { field: { Name: 'type_c' } },
          { field: { Name: 'capacity_c' } },
          { field: { Name: 'bed_configuration_c' } },
          { field: { Name: 'photos_c' } },
          { field: { Name: 'amenities_c' } },
          { field: { Name: 'price_per_night_c' } },
          { field: { Name: 'available_c' } },
          { field: { Name: 'max_occupancy_c' } }
        ],
        where: [{
          FieldName: 'hotel_id_c',
          Operator: 'EqualTo',
          Values: [parseInt(hotelId)]
        }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(room => this.parseRoom(room));
    } catch (error) {
      console.error(`Error fetching rooms for hotel ${hotelId}:`, error);
      return [];
    }
  }

  async checkRoomAvailability(roomId, checkInDate, checkOutDate, guestCount) {
    try {
      const room = await this.getRoomById(roomId);
      
      const isAvailable = room.available && guestCount <= room.maxOccupancy;
      
      return {
        available: isAvailable,
        room: room,
        pricePerNight: room.pricePerNight,
        totalNights: this.calculateNights(checkInDate, checkOutDate),
        totalPrice: room.pricePerNight * this.calculateNights(checkInDate, checkOutDate)
      };
    } catch (error) {
      console.error('Error checking room availability:', error);
      throw error;
    }
  }

  calculateNights(checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  async getAvailableRooms(hotelId, checkInDate, checkOutDate, guestCount) {
    try {
      const hotelRooms = await this.getRoomsByHotelId(hotelId);
      const availableRooms = hotelRooms.filter(room => 
        room.available && guestCount <= room.maxOccupancy
      );
      
      const nights = this.calculateNights(checkInDate, checkOutDate);
      
      return availableRooms.map(room => ({
        ...room,
        totalNights: nights,
        totalPrice: room.pricePerNight * nights
      }));
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      return [];
    }
  }
}

const roomService = new RoomService();
export default roomService;