import { useState, useEffect } from 'react';
import { destinationService } from '../../services/destinationService';
import { adminService } from '../../services/adminService'; // to fetch deals
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  destination?: any;
}

interface WeatherCard {
  season: string;
  heading: string;
  temp: string;
  description: string;
  image: string;
}

interface ZigzagCard {
  title: string;
  description: string;
  image: string;
  order: 'left' | 'right';
}

const DestinationFormModal = ({ isOpen, onClose, onSuccess, destination }: Props) => {
  const [loading, setLoading] = useState(false);
  const [dealsList, setDealsList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    heroImage: '',
    heroTitle: '',
    heroSubtitle: '',
    experienceTitle: '',
    experienceDescription: '',
    experienceImage: '',
    readMoreText: '',
    mapEmbedUrl: '',
    weather: {
      title: '',
      description: '',
      cards: [] as WeatherCard[],
    },
    zigzagCards: [] as ZigzagCard[],
    deals: [] as string[], // array of deal IDs
  });

  // For dynamic additions
  const [newWeatherCard, setNewWeatherCard] = useState<WeatherCard>({
    season: '',
    heading: '',
    temp: '',
    description: '',
    image: '',
  });
  const [newZigzagCard, setNewZigzagCard] = useState<ZigzagCard>({
    title: '',
    description: '',
    image: '',
    order: 'right',
  });

  useEffect(() => {
    if (isOpen) {
      fetchDealsList();
      if (destination) {
        setFormData({
          name: destination.name || '',
          slug: destination.slug || '',
          heroImage: destination.heroImage || '',
          heroTitle: destination.heroTitle || '',
          heroSubtitle: destination.heroSubtitle || '',
          experienceTitle: destination.experienceTitle || '',
          experienceDescription: destination.experienceDescription || '',
          experienceImage: destination.experienceImage || '',
          readMoreText: destination.readMoreText || '',
          mapEmbedUrl: destination.mapEmbedUrl || '',
          weather: destination.weather || { title: '', description: '', cards: [] },
          zigzagCards: destination.zigzagCards || [],
          deals: destination.deals || [],
        });
      } else {
        resetForm();
      }
    }
  }, [destination, isOpen]);

  const fetchDealsList = async () => {
    try {
      const res = await adminService.getAllDeals({ limit: 100 });
      if (res.success) setDealsList(res.data);
    } catch (error) {
      console.error('Failed to fetch deals');
    }
  };
  const generateEmbedUrl = (placeName: string) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(placeName)}`;
};
// When user fills the destination name, you can set mapEmbedUrl
useEffect(() => {
  if (formData.name) {
    const embedUrl = generateEmbedUrl(formData.name);
    setFormData(prev => ({ ...prev, mapEmbedUrl: embedUrl }));
  }
}, [formData.name]);
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      heroImage: '',
      heroTitle: '',
      heroSubtitle: '',
      experienceTitle: '',
      experienceDescription: '',
      experienceImage: '',
      readMoreText: '',
      mapEmbedUrl: '',
      weather: { title: '', description: '', cards: [] },
      zigzagCards: [],
      deals: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (destination) {
        res = await destinationService.updateDestination(destination._id, formData);
      } else {
        res = await destinationService.createDestination(formData);
      }
      if (res.success) {
        toast.success(destination ? 'Destination updated' : 'Destination created');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Weather card management
  const addWeatherCard = () => {
    if (!newWeatherCard.season || !newWeatherCard.heading) {
      toast.error('Season and heading are required');
      return;
    }
    setFormData({
      ...formData,
      weather: {
        ...formData.weather,
        cards: [...formData.weather.cards, { ...newWeatherCard }],
      },
    });
    setNewWeatherCard({ season: '', heading: '', temp: '', description: '', image: '' });
  };

  const removeWeatherCard = (idx: number) => {
    const updated = [...formData.weather.cards];
    updated.splice(idx, 1);
    setFormData({
      ...formData,
      weather: { ...formData.weather, cards: updated },
    });
  };

  // Zigzag card management
  const addZigzagCard = () => {
    if (!newZigzagCard.title || !newZigzagCard.description || !newZigzagCard.image) {
      toast.error('Title, description and image are required');
      return;
    }
    setFormData({
      ...formData,
      zigzagCards: [...formData.zigzagCards, { ...newZigzagCard }],
    });
    setNewZigzagCard({ title: '', description: '', image: '', order: 'right' });
  };

  const removeZigzagCard = (idx: number) => {
    const updated = [...formData.zigzagCards];
    updated.splice(idx, 1);
    setFormData({ ...formData, zigzagCards: updated });
  };

  // Deal selection
  const handleDealSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, deals: selected });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto my-8">
        <h2 className="text-xl font-bold mb-4">{destination ? 'Edit Destination' : 'New Destination'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic fields */}
          <input type="text" placeholder="Name (e.g., Croatia)" required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="Slug (e.g., croatia)" required className="w-full border p-2 rounded" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
          <input type="url" placeholder="Hero Image URL" required className="w-full border p-2 rounded" value={formData.heroImage} onChange={e => setFormData({...formData, heroImage: e.target.value})} />
          <input type="text" placeholder="Hero Title" required className="w-full border p-2 rounded" value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} />
          <input type="text" placeholder="Hero Subtitle" required className="w-full border p-2 rounded" value={formData.heroSubtitle} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} />
          <input type="text" placeholder="Experience Title" required className="w-full border p-2 rounded" value={formData.experienceTitle} onChange={e => setFormData({...formData, experienceTitle: e.target.value})} />
          <textarea placeholder="Experience Description" rows={3} className="w-full border p-2 rounded" value={formData.experienceDescription} onChange={e => setFormData({...formData, experienceDescription: e.target.value})} />
          <input type="url" placeholder="Experience Image URL" required className="w-full border p-2 rounded" value={formData.experienceImage} onChange={e => setFormData({...formData, experienceImage: e.target.value})} />
          <textarea placeholder="Read More Text" rows={3} className="w-full border p-2 rounded" value={formData.readMoreText} onChange={e => setFormData({...formData, readMoreText: e.target.value})} />
          <input type="url" placeholder="Google Maps Embed URL" required className="w-full border p-2 rounded" value={formData.mapEmbedUrl} onChange={e => setFormData({...formData, mapEmbedUrl: e.target.value})} />

          {/* Weather Section */}
          <div className="border p-4 rounded">
            <h3 className="font-bold text-lg mb-2">Weather Information</h3>
            <input type="text" placeholder="Weather Title" className="w-full border p-2 rounded mb-2" value={formData.weather.title} onChange={e => setFormData({...formData, weather: {...formData.weather, title: e.target.value}})} />
            <textarea placeholder="Weather Description" rows={2} className="w-full border p-2 rounded mb-4" value={formData.weather.description} onChange={e => setFormData({...formData, weather: {...formData.weather, description: e.target.value}})} />

            <h4 className="font-semibold mb-2">Weather Cards</h4>
            {formData.weather.cards.map((card, idx) => (
              <div key={idx} className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium">{card.season}: {card.heading}</span>
                  <button type="button" onClick={() => removeWeatherCard(idx)} className="text-red-500 text-sm">Remove</button>
                </div>
                <p className="text-sm text-gray-600">Temp: {card.temp} | {card.description.substring(0, 50)}...</p>
              </div>
            ))}

            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h5 className="font-medium mb-2">Add New Weather Card</h5>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Season (e.g., January – March)" className="border p-1 rounded" value={newWeatherCard.season} onChange={e => setNewWeatherCard({...newWeatherCard, season: e.target.value})} />
                <input type="text" placeholder="Heading (e.g., Quiet Cities)" className="border p-1 rounded" value={newWeatherCard.heading} onChange={e => setNewWeatherCard({...newWeatherCard, heading: e.target.value})} />
                <input type="text" placeholder="Temperature (e.g., 8°C – 15°C)" className="border p-1 rounded" value={newWeatherCard.temp} onChange={e => setNewWeatherCard({...newWeatherCard, temp: e.target.value})} />
                <input type="text" placeholder="Description" className="border p-1 rounded" value={newWeatherCard.description} onChange={e => setNewWeatherCard({...newWeatherCard, description: e.target.value})} />
                <input type="url" placeholder="Image URL" className="border p-1 rounded col-span-2" value={newWeatherCard.image} onChange={e => setNewWeatherCard({...newWeatherCard, image: e.target.value})} />
              </div>
              <button type="button" onClick={addWeatherCard} className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm">Add Card</button>
            </div>
          </div>

          {/* Zigzag Cards Section */}
          <div className="border p-4 rounded">
            <h3 className="font-bold text-lg mb-2">Zigzag Cards (Experiences)</h3>
            {formData.zigzagCards.map((card, idx) => (
              <div key={idx} className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium">{card.title} ({card.order})</span>
                  <button type="button" onClick={() => removeZigzagCard(idx)} className="text-red-500 text-sm">Remove</button>
                </div>
                <p className="text-sm text-gray-600">{card.description.substring(0, 80)}...</p>
              </div>
            ))}

            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h5 className="font-medium mb-2">Add New Zigzag Card</h5>
              <div className="grid gap-2">
                <input type="text" placeholder="Title (e.g., Private Island Hopping)" className="border p-1 rounded" value={newZigzagCard.title} onChange={e => setNewZigzagCard({...newZigzagCard, title: e.target.value})} />
                <textarea placeholder="Description" rows={2} className="border p-1 rounded" value={newZigzagCard.description} onChange={e => setNewZigzagCard({...newZigzagCard, description: e.target.value})} />
                <input type="url" placeholder="Image URL" className="border p-1 rounded" value={newZigzagCard.image} onChange={e => setNewZigzagCard({...newZigzagCard, image: e.target.value})} />
                <select className="border p-1 rounded" value={newZigzagCard.order} onChange={e => setNewZigzagCard({...newZigzagCard, order: e.target.value as 'left' | 'right'})}>
                  <option value="right">Image Right (text left)</option>
                  <option value="left">Image Left (text right)</option>
                </select>
              </div>
              <button type="button" onClick={addZigzagCard} className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm">Add Card</button>
            </div>
          </div>

          {/* Deals selection */}
          <div className="border p-4 rounded">
            <h3 className="font-bold text-lg mb-2">Associated Deals</h3>
            <select multiple size={5} className="w-full border p-2 rounded" value={formData.deals} onChange={handleDealSelect}>
              {dealsList.map(deal => (
                <option key={deal._id} value={deal._id}>{deal.title} (${deal.discountedPrice})</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Cmd) to select multiple deals</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DestinationFormModal;