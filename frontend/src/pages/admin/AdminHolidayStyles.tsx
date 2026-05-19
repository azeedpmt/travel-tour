// import { useState, useEffect } from 'react';
// import { adminService } from '../../services/adminService';
// import toast from 'react-hot-toast';
// import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
// import HolidayStyleFormModal from '../../components/admin/HolidayStyleFormModal';

// interface HolidayStyle {
//   _id: string;
//   name: string;
//   slug: string;
//   heroTitle: string;
//   order: number;
//   active: boolean;
// }

// const AdminHolidayStyles = () => {
//   const [styles, setStyles] = useState<HolidayStyle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingStyle, setEditingStyle] = useState<HolidayStyle | null>(null);

//   useEffect(() => {
//     fetchStyles();
//   }, []);

//   const fetchStyles = async () => {
//     setLoading(true);
//     try {
//       const res = await adminService.getAllHolidayStyles();
//       if (res.success) setStyles(res.data);
//     } catch (error) {
//       toast.error('Failed to fetch holiday styles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this holiday style?')) return;
//     try {
//       const res = await adminService.deleteHolidayStyle(id);
//       if (res.success) {
//         toast.success('Holiday style deleted');
//         fetchStyles();
//       }
//     } catch (error) {
//       toast.error('Delete failed');
//     }
//   };

//   if (loading) return <div className="p-8 text-center">Loading...</div>;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Holiday Styles</h1>
//         <button
//           onClick={() => {
//             setEditingStyle(null);
//             setModalOpen(true);
//           }}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
//         >
//           <FiPlus /> Add Holiday Style
//         </button>
//       </div>
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left">Name</th>
//               <th className="px-6 py-3 text-left">Slug</th>
//               <th className="px-6 py-3 text-left">Hero Title</th>
//               <th className="px-6 py-3 text-left">Order</th>
//               <th className="px-6 py-3 text-left">Status</th>
//               <th className="px-6 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {styles.map(style => (
//               <tr key={style._id} className="border-t">
//                 <td className="px-6 py-4">{style.name}</td>
//                 <td className="px-6 py-4">{style.slug}</td>
//                 <td className="px-6 py-4">{style.heroTitle}</td>
//                 <td className="px-6 py-4">{style.order}</td>
//                 <td className="px-6 py-4">
//                   <span className={`px-2 py-1 rounded-full text-xs ${style.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                     {style.active ? 'Active' : 'Inactive'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <button onClick={() => { setEditingStyle(style); setModalOpen(true); }} className="text-blue-600 mr-3"><FiEdit2 /></button>
//                   <button onClick={() => handleDelete(style._id)} className="text-red-600"><FiTrash2 /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <HolidayStyleFormModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSuccess={fetchStyles}
//         holidayStyle={editingStyle}
//       />
//     </div>
//   );
// };

// export default AdminHolidayStyles;
import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import HolidayStyleFormModal from '../../components/admin/HolidayStyleFormModal';

interface HolidayStyle {
  _id: string;
  name: string;
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  order: number;
  active: boolean;
  heroImage: string;
}

const AdminHolidayStyles = () => {
  const [styles, setStyles] = useState<HolidayStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<HolidayStyle | null>(null);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllHolidayStyles();
      if (res.success) setStyles(res.data);
    } catch (error) {
      toast.error('Failed to fetch holiday styles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this holiday style? This will not delete deals, but deals will lose this association.')) return;
    try {
      const res = await adminService.deleteHolidayStyle(id);
      if (res.success) {
        toast.success('Holiday style deleted');
        fetchStyles();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Holiday Styles</h1>
        <button
          onClick={() => {
            setEditingStyle(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Holiday Style
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hero Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {styles.map((style) => (
              <tr key={style._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{style.name}</td>
                <td className="px-6 py-4">{style.slug}</td>
                <td className="px-6 py-4">{style.heroTitle}</td>
                <td className="px-6 py-4">{style.order}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    style.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {style.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setEditingStyle(style);
                      setModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(style._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <HolidayStyleFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchStyles}
        holidayStyle={editingStyle}
      />
    </div>
  );
};

export default AdminHolidayStyles;