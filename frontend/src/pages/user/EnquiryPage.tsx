import { useState } from 'react';
import { useAppData } from '../../contexts/AppContext';
import toast from 'react-hot-toast';
import { FiMail, FiUser, FiMessageSquare, FiPhone } from 'react-icons/fi';

const EnquiryPage = () => {
  const { user } = useAppData();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call - In production, replace with actual API
    setTimeout(() => {
      toast.success('Enquiry sent successfully! We will get back to you soon.');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        subject: '',
        message: '',
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Get in Touch</h1>
        <p className="text-gray-600">Have questions about our deals? We're here to help!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FiMail className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">support@tourtravel.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiPhone className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-600">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMessageSquare className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-sm text-gray-600">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your query..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;