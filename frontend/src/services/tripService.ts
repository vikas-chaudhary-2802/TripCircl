import api from './api';

export interface Trip {
  _id: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  organizer: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    rating?: number;
  };
  status: 'active' | 'completed' | 'cancelled';
  maxMembers: number;
  currentMembersCount: number;
  category: string;
  images: string[];
  itinerary: any[];
}

const tripService = {
  /**
   * Get all active trips with optional filters.
   */
  getAllTrips: async (filters?: { category?: string; destination?: string }): Promise<Trip[]> => {
    const { data } = await api.get('/trips', { params: filters });
    return data.data.trips;
  },

  /**
   * Get a single trip by ID.
   */
  getTrip: async (id: string): Promise<Trip> => {
    const { data } = await api.get(`/trips/${id}`);
    return data.data.trip;
  },

  /**
   * Create a new trip.
   */
  createTrip: async (tripData: any): Promise<Trip> => {
    const { data } = await api.post('/trips', tripData);
    return data.data.trip;
  },

  /**
   * Join a trip.
   */
  joinTrip: async (id: string): Promise<void> => {
    await api.post(`/trips/${id}/join`);
  },

  /**
   * Get members of a trip.
   */
  getTripMembers: async (id: string): Promise<any[]> => {
    const { data } = await api.get(`/trips/${id}/members`);
    return data.data.members;
  },

  /**
   * Get the current user's joined/organized trips.
   */
  getMyTrips: async (): Promise<Trip[]> => {
    const { data } = await api.get('/trips/me');
    return data.data.trips;
  },
};

export default tripService;
