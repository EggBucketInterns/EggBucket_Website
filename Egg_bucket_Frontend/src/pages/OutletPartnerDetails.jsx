import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, Search, RotateCcw, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditOutletPartner from '../components/forms/EditOutletPartner';
import * as XLSX from 'xlsx';

const OutletPartnerDetails = () => {
  const navigate = useNavigate();
  const [outlet, setOutlet] = useState('');
  const [outletList, setOutletList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [outletPartners, setOutletPartners] = useState([]);
  const [editingOutletPartner, setEditingOutletPartner] = useState(null);

  // Fetch all outlets
  const fetchOutlets = async () => {
    try {
      const response = await axios.get('https://eggbucket-website.onrender.com/egg-bucket-b2b/get-all-outlets');
      setOutletList(response.data.data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  // Fetch outlet partners based on outletId
  const fetchOutletPartners = async (query = '') => {
    try {
      const response = await axios.get('https://eggbucket-website.onrender.com/outletPartners/egg-bucket-b2b/displayAll-outlet_partner' + query);
      if (response.data.status === 'success') {
        setOutletPartners(response.data.data);
      } else {
        console.error('Error fetching outlet partners:', response.data);
      }
    } catch (error) {
      console.error('Error fetching outlet partners:', error);
    }
  };

  useEffect(() => {
    fetchOutlets();
    fetchOutletPartners();
  }, []);

  const handleOutletChange = (e) => {
    const selectedOutlet = e.target.value;
    setOutlet(selectedOutlet);
    setSearchTerm('');
    // Fetch outlet partners by selected outlet number
    if (selectedOutlet) {
      fetchOutletPartners(`?outletId=${selectedOutlet}`);
    }
  };

  const handleEditClick = (outletpartner) => {
    setEditingOutletPartner(outletpartner);
  };

  const handleCloseEdit = () => {
    setEditingOutletPartner(null);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const response = await axios.patch(`https://eggbucket-website.onrender.com/outletPartners/egg-bucket-b2b/outlet_partner/${editingOutletPartner._id}`, formData);
      if (response.status === 200) {
        setOutletPartners(outletPartners.map(op => op._id === editingOutletPartner._id ? response.data : op));
        setEditingOutletPartner(null);
        alert('Outlet partner updated successfully');
        navigate(0);
      } else {
        alert('Failed to update outlet partner');
      }
    } catch (error) {
      console.error('Error updating outlet partner:', error);
      alert('Error updating outlet partner');
    }
  };

  const handleDeleteClick = async (partnerId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this outlet partner?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`https://eggbucket-website.onrender.com/outletPartners/egg-bucket-b2b/outlet_partner/${partnerId}`);
        if (response.status === 200) {
          setOutletPartners(outletPartners.filter(op => op._id !== partnerId));
          alert('Outlet partner deleted successfully');
        } else {
          alert(response.data.error);
        }
      } catch (error) {
        console.error('Error deleting outlet partner:', error);
        alert('Error deleting outlet partner');
      }
    }
  };

  const exportToSpreadsheet = () => {
    const ws = XLSX.utils.json_to_sheet(outletPartners.map(partner => ({
      Name: `${partner.firstName} ${partner.lastName}`,
      PhoneNo: partner.phoneNumber,
      AadharNumber: partner.aadharNumber || 'N/A',
      Photo: partner.img,
      Password: partner.password || 'N/A'
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Outlet Partners');
    XLSX.writeFile(wb, 'outlet_partners.xlsx');
  };

  return (
    <div className="h-full pt-7 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Outlet Partner Details</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-4 flex-grow flex flex-col">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-1">
          <div className="flex flex-wrap items-center gap-1">
            <button className="flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs">
              <Filter className="w-4 h-4 mr-1" />
              Filter By
            </button>
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-2 pr-6 text-xs"
                value={outlet}
                onChange={handleOutletChange}
              >
                <option value=''>Outlet</option>
                {outletList.map(outlet => (
                  <option key={outlet._id} value={outlet.outletNumber}>
                    {outlet.outletArea} (ID: {outlet.outletNumber})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Name"
                className="pl-7 pr-2 py-1 border border-gray-300 rounded-md text-xs"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setOutlet('Outlet'); fetchOutletPartners(`?firstName=${e.target.value}`); }}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            <button className="flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-orange-600" onClick={() => { setOutlet(''); fetchOutletPartners(); }}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset Filter
            </button>
            <button onClick={() => navigate('/contact/newoutletpartner')} className="px-2 py-1 bg-orange-600 text-white rounded-md text-xs">
              REGISTER NEW OUTLET PARTNER
            </button>
            <button className="px-2 py-1 bg-emerald-500 text-white rounded-md text-xs" onClick={exportToSpreadsheet}>
              SPREADSHEET
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 text-sm font-semibold text-gray-600">NAME</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">PHONE NO</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">AADHAR NUMBER</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">PHOTO</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">PASSWORD</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {outletPartners.map(partner => (
                <tr key={partner._id}>
                  <td className="text-left p-2 text-sm text-gray-600">{`${partner.firstName} ${partner.lastName}`}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{partner.phoneNumber}</td>
                  <td className="text-left p-2 text-sm text-gray-600">{partner.aadharNumber || 'N/A'}</td>
                  <td className="text-left p-2 text-sm text-gray-600">
                    <img src={partner.img} alt={partner.firstName} className="w-12 h-12 object-cover rounded-md" />
                  </td>
                  <td className="text-left p-2 text-sm text-gray-600">{partner.password || 'N/A'}</td>
                  <td className="text-left p-2 text-sm text-gray-600">
                    <button className='text-purple-600' onClick={() => handleEditClick(partner)}>
                      <Edit className='w-5 h-5'/>
                    </button>
                    <button className='text-red-600' onClick={() => handleDeleteClick(partner._id)}>
                      <Trash className='w-5 h-5'/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingOutletPartner && (
        <EditOutletPartner 
          outletpartner={editingOutletPartner}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default OutletPartnerDetails;
