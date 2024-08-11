import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Package, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const chartData = [
  { name: '5k', value: 20 },
  { name: '10k', value: 40 },
  { name: '15k', value: 30 },
  { name: '20k', value: 90 },
  { name: '25k', value: 50 },
  { name: '30k', value: 45 },
  { name: '35k', value: 60 },
  { name: '40k', value: 45 },
  { name: '45k', value: 70 },
  { name: '50k', value: 60 },
  { name: '55k', value: 55 },
  { name: '60k', value: 55 },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/outlet-details" className="block">
          <StatCard
            title="Total Outlets"
            value="40,689"
            icon={<Building2 className="text-purple-500" />}
          />
        </Link>
        <Link to="/order" className="block">
          <StatCard
            title="Total Orders"
            value="10,293"
            icon={<Package className="text-yellow-500" />}
          />
        </Link>
        <Link to="/order" className="block">
          <StatCard
            title="Orders Completed"
            value="89,000"
            icon={<CheckCircle className="text-green-500" />}
          />
        </Link>
        <Link to="/order" className="block">
          <StatCard
            title="Orders Pending"
            value="2,040"
            icon={<Clock className="text-red-500" />}
          />
        </Link>
      </div>

      
      <Link to="/" className="block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Amount Collected" value="89,000" icon={<TrendingUp className="text-green-500" />} />
        </div>
      </Link>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Number of Orders - Total</h2>
          <select className="border rounded p-2">
            <option>Orders</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
      {icon}
    </div>
  </div>
);

export default Dashboard;