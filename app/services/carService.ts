import { supabase, Car } from '../lib/supabase';
import { CarCardProps } from '../components/CarCard';

/**
 * Service for handling car data operations with Supabase
 */
export class CarService {
  /**
   * Fetch all cars from Supabase for frontend display
   */
  static async getCars(): Promise<CarCardProps[]> {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return (data || []).map((car: Car) => ({ ...car, images: car.images || [] }));
    } catch (error) {
      console.error('Error fetching cars (raw):', error);
      console.error('Error fetching cars (JSON):', JSON.stringify(error, null, 2));
      throw new Error('Failed to fetch cars from database');
    }
  }

  /**
   * Fetch a single car by ID
   */
  static async getCarById(id: string): Promise<CarCardProps | null> {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return { ...data, images: data.images || [] };
    } catch (error) {
      console.error('Error fetching car by ID:', error);
      throw new Error('Failed to fetch car details');
    }
  }

  /**
   * Add a new car to the database
   */
  static async addCar(carData: Omit<CarCardProps, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('cars')
      .insert([{ ...carData, images: carData.images || [] }]);
    if (error) throw error;
  }

  /**
   * Update an existing car in the database
   */
  static async updateCar(id: string, updateData: Partial<Omit<CarCardProps, 'id'>>): Promise<void> {
    const { error } = await supabase
      .from('cars')
      .update({ ...updateData, images: updateData.images || [] })
      .eq('id', id);
    if (error) throw error;
  }

  /**
   * Delete a car and its image from the database and storage
   */
  static async deleteCar(car: CarCardProps): Promise<void> {
    try {
      // Delete all images from storage
      if (car && car.images && Array.isArray(car.images)) {
        for (const imgUrl of car.images) {
          const match = imgUrl.match(/public\/(.+)$/);
          if (match && match[1]) {
            const imagePath = match[1];
            const { error: storageError } = await supabase.storage
              .from('alasiri')
              .remove([imagePath]);
            if (storageError) {
              console.error('Error deleting image from storage:', storageError);
            }
          }
        }
      }
      // Delete the car from the database
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', car.id);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      throw new Error('Failed to delete car from database');
    }
  }

  /**
   * Get cars by type filter
   */
  static async getCarsByType(type: string): Promise<CarCardProps[]> {
    try {
      const cars = await this.getCars();
      return cars.filter(car => car.type.toLowerCase() === type.toLowerCase());
    } catch (error) {
      console.error('Error filtering cars by type:', error);
      throw new Error('Failed to filter cars by type');
    }
  }

  /**
   * Get cars by gearshift type
   */
  static async getCarsByGearshift(gearshift: 'Automatic' | 'Manual'): Promise<CarCardProps[]> {
    try {
      const cars = await this.getCars();
      return cars.filter(car => car.gearshift === gearshift);
    } catch (error) {
      console.error('Error filtering cars by gearshift:', error);
      throw new Error('Failed to filter cars by gearshift');
    }
  }

  /**
   * Get cars by number of seats
   */
  static async getCarsBySeats(seats: number): Promise<CarCardProps[]> {
    try {
      const cars = await this.getCars();
      return cars.filter(car => car.seats >= seats);
    } catch (error) {
      console.error('Error filtering cars by seats:', error);
      throw new Error('Failed to filter cars by seats');
    }
  }

  /**
   * Sort cars by price (ascending or descending)
   */
  static async getCarsSortedByPrice(ascending: boolean = true): Promise<CarCardProps[]> {
    try {
      const cars = await this.getCars();
      return cars.sort((a, b) => {
        return ascending ? a.priceKsh - b.priceKsh : b.priceKsh - a.priceKsh;
      });
    } catch (error) {
      console.error('Error sorting cars by price:', error);
      throw new Error('Failed to sort cars by price');
    }
  }

  /**
   * Get cars by maximum price
   */
  static async getCarsByMaxPrice(maxPrice: number): Promise<CarCardProps[]> {
    try {
      const cars = await this.getCars();
      return cars.filter(car => car.priceKsh <= maxPrice);
    } catch (error) {
      console.error('Error filtering cars by max price:', error);
      throw new Error('Failed to filter cars by max price');
    }
  }
} 