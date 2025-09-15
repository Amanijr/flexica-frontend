// components/dashboard/SalesTable.tsx

import { MoreHorizontal } from 'lucide-react';
import { Sale } from './types';

interface SalesTableProps {
  sales: Sale[];
}

const SalesTable = ({ sales }: SalesTableProps) => (
  <div className="bg-white rounded-2xl shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Recent Sales</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{sale.orderId}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.customer}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{sale.amount}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {sale.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600 transition">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">No sales data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default SalesTable;