import React from 'react';
import { Service, MIN_PACKAGE_QUANTITY, PACKAGE_QUANTITY_STEP } from '../constants';

interface ServiceInputProps {
  service: Service;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ServiceInput: React.FC<ServiceInputProps> = ({ service, quantity, onQuantityChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);

    if (isNaN(value)) {
      value = MIN_PACKAGE_QUANTITY; // Snap to minimum if cleared or invalid
    }

    // Ensure it's at least the minimum
    value = Math.max(MIN_PACKAGE_QUANTITY, value);

    // Ensure it's a multiple of the step, rounding down
    if (value % PACKAGE_QUANTITY_STEP !== 0) {
      value = value - (value % PACKAGE_QUANTITY_STEP);
    }
    
    onQuantityChange(value);
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="flex-1 mb-2 sm:mb-0">
        <p className="font-semibold text-lg text-black">{service.type}</p>
        <p className="text-sm text-gray-800">
          Preț Black Friday: <span className="font-bold text-red-600">{service.blackFridayPricePerUnit} RON</span> / {service.unit}
        </p>
        <p className="text-xs text-gray-500 line-through">Preț normal: {service.pricePerUnit} RON / {service.unit}</p>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min={MIN_PACKAGE_QUANTITY}
            step={PACKAGE_QUANTITY_STEP}
            className="w-28 p-2 border border-gray-600 rounded-md text-center shadow-sm focus:ring-red-500 focus:border-red-500 bg-gray-800 text-white"
            aria-label={`Cantitatea pentru ${service.type}`}
          />
          <span className="text-gray-900">{service.unit}</span>
        </div>
        <p className="text-xs text-gray-600 w-full text-right">
            Minim {MIN_PACKAGE_QUANTITY} m pentru oferta inițială, apoi multiplu de {PACKAGE_QUANTITY_STEP} m (ex: {MIN_PACKAGE_QUANTITY + PACKAGE_QUANTITY_STEP}, {MIN_PACKAGE_QUANTITY + (2 * PACKAGE_QUANTITY_STEP)} etc.).
        </p>
      </div>
    </div>
  );
};

export default ServiceInput;