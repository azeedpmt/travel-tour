export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin' | null;
    isVerified?: boolean;
}

export interface Hotel {
    _id: string;
    name: string;
    ownerName: string;
    ownerId?: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country?: string;
    pincode: string;
    description?: string;
    images: string[];
    amenities: string[];   // array of strings
    rating: number;
    totalReviews?: number;
    phoneNumber?: string;  // Phone number 
    totalRooms?: number;
    isVerified: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'active';
    rejectionReason?: string;
    verifiedAt?: string;
    createdAt: string;
}

export interface Deal {
    _id: string;
    title: string;
    description: string;
    hotelId: Hotel | string;
    originalPrice: number;
    discountedPrice: number;
    discountPercent: number;
    duration: number;
    includes: string[];
    excludes: string[];
    images: string[];
    startDate: string;
    endDate: string;
    maxBookings: number;
    currentBookings: number;
    rating: number;
    category: string;
    destinationId?: string;   // 👈 ADD THIS
    status: 'active' | 'inactive' | 'expired';
    reviews?: Array<{
        userId: string;
        rating: number;
        comment: string;
        createdAt: string;
    }>;
    createdAt: string;
}

export interface FoodItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    cuisine: string;
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree?: boolean;
    hotelId: Hotel | string;
    prepTime?: number;
    images: string[];
    isAvailable: boolean;
    rating?: number;
    totalOrders?: number;
    createdAt: string;
}

export interface GuestDetails {
    name: string;
    email: string;
    phone: string;
    passportNumber?: string;
    numberOfAdults: number;
    numberOfChildren: number;
}

export interface Booking {
    _id: string;
    userId: string;
    dealId?: Deal | string;
    hotelId: Hotel | string;
    foodItems?: Array<{
        itemId: FoodItem | string;
        quantity: number;
        price: number;
    }>;
    guestDetails: GuestDetails;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    numberOfRooms: number;
    totalAmount: number;
    paymentId?: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    specialRequests?: string;
    cancellationReason?: string;
    cancelledAt?: string;
    createdAt: string;
}