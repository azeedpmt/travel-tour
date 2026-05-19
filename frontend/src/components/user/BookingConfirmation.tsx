import { useState } from 'react';
import type{ Booking, Deal, Hotel } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { downloadBookingPDF } from '../../utils/downloadPDF';
import { FiPrinter, FiDownload, FiCheckCircle, FiCalendar, FiUsers, FiHome, FiDollarSign } from 'react-icons/fi';

interface BookingConfirmationProps {
  booking: Booking;
  deal?: Deal;
  hotel: Hotel;
  onDownloadTicket: () => void;
}

const BookingConfirmation = ({ booking, deal, hotel, onDownloadTicket }: BookingConfirmationProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    await downloadBookingPDF(booking, deal, hotel);
    setIsDownloading(false);
    onDownloadTicket();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FiCheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
        <p className="text-gray-600 mt-2">Your booking has been successfully confirmed.</p>
      </div>

      {/* Booking ID Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Booking ID</p>
            <p className="text-2xl font-mono font-bold">{booking._id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Booking Date</p>
            <p className="font-semibold">{formatDate(booking.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FiUsers className="w-5 h-5 mr-2 text-blue-600" />
            Guest Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">{booking.guestDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span>{booking.guestDetails.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span>{booking.guestDetails.phone}</span>
            </div>
            {booking.guestDetails.passportNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500">Passport:</span>
                <span>{booking.guestDetails.passportNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Travelers:</span>
              <span>{booking.guestDetails.numberOfAdults} Adults, {booking.guestDetails.numberOfChildren} Children</span>
            </div>
          </div>
        </div>

        {/* Hotel & Stay Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FiHome className="w-5 h-5 mr-2 text-blue-600" />
            Hotel & Stay
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Hotel:</span>
              <span className="font-medium">{hotel.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address:</span>
              <span>{hotel.city}, {hotel.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Check-in:</span>
              <span>{formatDate(booking.checkInDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Check-out:</span>
              <span>{formatDate(booking.checkOutDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Rooms:</span>
              <span>{booking.numberOfRooms} Room(s)</span>
            </div>
          </div>
        </div>

        {/* Deal Details */}
        {deal && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Package Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Package:</span>
                <span className="font-medium">{deal.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span>{deal.duration} days</span>
              </div>
              {deal.includes && deal.includes.length > 0 && (
                <div>
                  <span className="text-gray-500">Includes:</span>
                  <ul className="mt-1 list-disc list-inside">
                    {deal.includes.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="text-xs">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FiDollarSign className="w-5 h-5 mr-2 text-blue-600" />
            Payment Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount:</span>
              <span className="font-bold text-lg text-blue-600">{formatCurrency(booking.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status:</span>
              <span className={`font-medium ${
                booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {booking.paymentStatus.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Booking Status:</span>
              <span className="font-medium text-green-600">{booking.bookingStatus.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiPrinter className="w-5 h-5" />
          <span>{isDownloading ? 'Generating...' : 'Download Ticket'}</span>
        </button>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• A confirmation email has been sent to your registered email address</li>
          <li>• Show this ticket at the hotel reception for check-in</li>
          <li>• Carry valid ID proof for all guests</li>
          <li>• For any assistance, contact our customer support</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingConfirmation;