import React from 'react';
import { Service } from '../constants'; // Removed ServiceType as it's not used directly here

interface SelectedService {
  service: Service;
  quantity: number;
  subtotal: number;
}

interface OfferSummaryProps {
  location: string;
  selectedServices: SelectedService[];
  transportCost: number; // New prop for transport cost
  totalPrice: number;
}

const OfferSummary: React.FC<OfferSummaryProps> = ({ location, selectedServices, transportCost, totalPrice }) => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-300">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">OFERTA TA Black Friday</h3>

      {location && (
        <p className="text-gray-800 mb-4">
          <span className="font-semibold">Locația șantierului:</span> {location}
        </p>
      )}

      {selectedServices.length > 0 ? (
        <ul className="space-y-3 mb-4">
          {selectedServices.map((item, index) => (
            <li key={index} className="flex justify-between items-center text-gray-800 border-b border-gray-200 pb-2 last:border-b-0">
              <span className="font-medium">{item.service.type} ({item.quantity} {item.service.unit})</span>
              <span className="font-semibold text-right">{item.subtotal.toFixed(2)} RON</span>
            </li>
          ))}
          {transportCost > 0 && (
            <li className="flex justify-between items-center text-gray-800 border-b border-gray-200 pb-2 last:border-b-0">
              <span className="font-medium">Cost transport (estimat de client):</span>
              <span className="font-semibold text-right">{transportCost.toFixed(2)} RON</span>
            </li>
          )}
        </ul>
      ) : (
        <p className="text-gray-700 italic mb-4">Nu ați selectat încă niciun serviciu.</p>
      )}
    </div>
  );
};

export default OfferSummary;