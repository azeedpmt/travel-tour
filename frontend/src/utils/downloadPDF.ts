import type { Booking, Deal, Hotel } from '../types';

export const downloadBookingPDF = async (booking: Booking, deal: Deal | undefined, hotel: Hotel) => {
  // This function creates a printable ticket/PDF
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) return;
  
  const checkInDate = new Date(booking.checkInDate).toLocaleDateString();
  const checkOutDate = new Date(booking.checkOutDate).toLocaleDateString();
  const bookingDate = new Date(booking.createdAt).toLocaleDateString();
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Booking Ticket - ${booking._id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f5f5;
        }
        .ticket {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0 0;
          opacity: 0.9;
        }
        .content {
          padding: 20px;
        }
        .section {
          margin-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 15px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .row {
          display: flex;
          margin-bottom: 8px;
        }
        .label {
          width: 140px;
          font-weight: 500;
          color: #6b7280;
        }
        .value {
          flex: 1;
          color: #1f2937;
        }
        .booking-id {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 20px;
        }
        .booking-id span {
          font-family: monospace;
          font-size: 16px;
          font-weight: bold;
          color: #2563eb;
        }
        .total {
          background: #eef2ff;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          margin-top: 20px;
        }
        .total .amount {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
        }
        .footer {
          background: #f9fafb;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <h1>${import.meta.env.VITE_APP_NAME}</h1>
          <p>Booking Confirmation Ticket</p>
        </div>
        
        <div class="content">
          <div class="booking-id">
            <strong>Booking ID:</strong> <span>${booking._id}</span>
          </div>
          
          <div class="section">
            <div class="section-title">Traveler Details</div>
            <div class="row">
              <div class="label">Name:</div>
              <div class="value">${booking.guestDetails.name}</div>
            </div>
            <div class="row">
              <div class="label">Email:</div>
              <div class="value">${booking.guestDetails.email}</div>
            </div>
            <div class="row">
              <div class="label">Phone:</div>
              <div class="value">${booking.guestDetails.phone}</div>
            </div>
            ${booking.guestDetails.passportNumber ? `
            <div class="row">
              <div class="label">Passport Number:</div>
              <div class="value">${booking.guestDetails.passportNumber}</div>
            </div>
            ` : ''}
            <div class="row">
              <div class="label">Travelers:</div>
              <div class="value">${booking.guestDetails.numberOfAdults} Adults, ${booking.guestDetails.numberOfChildren} Children</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Hotel & Deal Details</div>
            <div class="row">
              <div class="label">Hotel:</div>
              <div class="value">${hotel.name}, ${hotel.city}</div>
            </div>
            ${deal ? `
            <div class="row">
              <div class="label">Package:</div>
              <div class="value">${deal.title}</div>
            </div>
            ` : ''}
            <div class="row">
              <div class="label">Check-in:</div>
              <div class="value">${checkInDate}</div>
            </div>
            <div class="row">
              <div class="label">Check-out:</div>
              <div class="value">${checkOutDate}</div>
            </div>
            <div class="row">
              <div class="label">Rooms:</div>
              <div class="value">${booking.numberOfRooms} Room(s)</div>
            </div>
          </div>
          
          <div class="total">
            <div class="section-title" style="margin-bottom: 5px;">Total Amount Paid</div>
            <div class="amount">₹${booking.totalAmount.toLocaleString()}</div>
            <div style="font-size: 12px; margin-top: 5px;">Payment Status: ${booking.paymentStatus.toUpperCase()}</div>
            <div style="font-size: 12px;">Booking Date: ${bookingDate}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Important Information</div>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 13px;">
              <li>Please carry a valid ID proof for check-in</li>
              <li>Check-in time: 2:00 PM | Check-out time: 11:00 AM</li>
              <li>For any queries, contact our support team</li>
              <li>This ticket is required for check-in</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          Thank you for booking with ${import.meta.env.VITE_APP_NAME}!<br>
          This is a system generated ticket, no signature required.
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px;" class="no-print">
        <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer;">Print Ticket</button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; margin-left: 10px;">Close</button>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
};