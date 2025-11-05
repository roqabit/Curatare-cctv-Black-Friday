
import React, { useState, useMemo, useCallback } from 'react';
import { SERVICES, ServiceType, WHATSAPP_NUMBER, APP_NAME, APP_DESCRIPTION, TRANSPORT_PRICE_PER_KM, MOGOSOAIA_DESTINATION, MIN_PACKAGE_QUANTITY, HIDRO_EQUIPMENT_DETAILS_TEXT, VIDEO_INSPECTION_EQUIPMENT_DETAILS_TEXT, EquipmentType, PACKAGE_QUANTITY_STEP } from './constants';
import ServiceInput from './components/ServiceInput';
import OfferSummary from './components/OfferSummary';

interface SelectedServiceDetail {
  service: typeof SERVICES[number];
  quantity: number;
  subtotal: number;
}

function App() {
  const [companyName, setCompanyName] = useState<string>('');
  const [contactPersonName, setContactPersonName] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>(''); // For phone number or email
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState<number>(0); // New state for estimated distance
  const [packageQuantity, setPackageQuantity] = useState<number>(MIN_PACKAGE_QUANTITY); // Initialized with MIN_PACKAGE_QUANTITY
  const [showEquipmentModal, setShowEquipmentModal] = useState<boolean>(false); // State for equipment details modal
  const [currentEquipmentType, setCurrentEquipmentType] = useState<EquipmentType | null>(null); // State to know which equipment details to show

  const hidroInspectionPackageService = SERVICES.find(s => s.type === ServiceType.HIDRO_INSPECTION_PACKAGE)!;

  const selectedServices = useMemo<SelectedServiceDetail[]>(() => {
    const services: SelectedServiceDetail[] = [];
    if (packageQuantity >= MIN_PACKAGE_QUANTITY) { // Only add if quantity meets minimum
      services.push({
        service: hidroInspectionPackageService,
        quantity: packageQuantity,
        subtotal: packageQuantity * hidroInspectionPackageService.blackFridayPricePerUnit,
      });
    }
    return services;
  }, [packageQuantity, hidroInspectionPackageService]);

  const servicesTotalPrice = useMemo(() => {
    return selectedServices.reduce((sum, item) => sum + item.subtotal, 0);
  }, [selectedServices]);

  const transportCost = useMemo(() => {
    return estimatedDistanceKm > 0 ? estimatedDistanceKm * TRANSPORT_PRICE_PER_KM : 0;
  }, [estimatedDistanceKm]);

  const totalPrice = useMemo(() => {
    return servicesTotalPrice + transportCost;
  }, [servicesTotalPrice, transportCost]);

  const canSendOrder = useMemo(() => {
    return totalPrice > 0 && companyName.trim() !== '' && contactPersonName.trim() !== '' && contactInfo.trim() !== '';
  }, [totalPrice, companyName, contactPersonName, contactInfo]);

  const handleOpenMaps = useCallback((app: 'google' | 'waze') => {
    const origin = selectedLocation.trim() !== '' ? encodeURIComponent(selectedLocation) : '';
    const destination = encodeURIComponent(MOGOSOAIA_DESTINATION);

    if (app === 'google') {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`, '_blank');
    } else if (app === 'waze') {
      // Waze often uses 'ul' for universal link, 'q' for query/destination, 'from' for origin
      window.open(`https://waze.com/ul?q=${destination}&navigate=yes&from=${origin}`, '_blank');
    }
  }, [selectedLocation]);

  const handleShowEquipmentDetails = useCallback((type: EquipmentType) => {
    setCurrentEquipmentType(type);
    setShowEquipmentModal(true);
  }, []);

  const getModalContent = useCallback(() => {
    if (currentEquipmentType === EquipmentType.HIDRO) {
      return {
        title: "Detalii Echipament Hidrocurățare",
        text: HIDRO_EQUIPMENT_DETAILS_TEXT,
        imageUrl: undefined, // Removed image URL for Wiedemann Super 2000
      };
    } else if (currentEquipmentType === EquipmentType.VIDEO_INSPECTION) {
      return {
        title: "Detalii Echipament Inspecție Video",
        text: VIDEO_INSPECTION_EQUIPMENT_DETAILS_TEXT,
        imageUrl: undefined, // No image for video inspection equipment by default
      };
    }
    return { title: "", text: "", imageUrl: undefined }; // Fallback
  }, [currentEquipmentType]);

  const modalContent = getModalContent();


  const generateWhatsAppMessage = useCallback(() => {
    let message = `Bună ziua, aș dori să plasez o comandă Black Friday pentru Neovid Inspect.\n\n`;

    message += `Detalii de contact:\n`;
    message += `- Societatea: ${companyName}\n`;
    message += `- Persoana de contact: ${contactPersonName}\n`;
    message += `- Contact (Telefon/Email): ${contactInfo}\n\n`;

    message += `Locația șantierului: ${selectedLocation || 'Nespecificată'}\n\n`;

    if (packageQuantity < MIN_PACKAGE_QUANTITY && estimatedDistanceKm === 0) { // Check if no valid services and no distance
      message += "Nu am selectat încă serviciile conform cerințelor minime și nu am specificat distanța. Vă rog să mă contactați pentru a discuta oferta.\n";
    } else {
      if (packageQuantity >= MIN_PACKAGE_QUANTITY) {
        message += `Servicii selectate:\n`;
        selectedServices.forEach(item => { // This loop will run once if packageQuantity > 0
          message += `- ${item.service.type}: ${item.quantity} ${item.service.unit} (${item.subtotal.toFixed(2)} RON)\n`;
        });
      }

      if (estimatedDistanceKm > 0) {
        message += `\nDistanța estimată pentru transport (până la ${MOGOSOAIA_DESTINATION}): ${estimatedDistanceKm} km\n`;
        message += `Cost transport (estimat de client): ${transportCost.toFixed(2)} RON\n`;
        message += `(Notă: Costul transportului este bazat pe estimarea clientului și va fi verificat de Neovid Inspect)\n`;
      }
      message += `\nTOTAL OFERTĂ: ${totalPrice.toFixed(2)} RON\n`;
    }

    message += `\nMenționez că am înțeles termenii ofertei de Black Friday (valabilă pentru comenzi în avans, execuția lucrărilor se va face după confirmare și încasare).\n`;
    message += `Aștept confirmarea comenzii și detaliile pentru plată. Vă mulțumesc!`;

    return message;
  }, [companyName, contactPersonName, contactInfo, selectedLocation, selectedServices, estimatedDistanceKm, transportCost, totalPrice, packageQuantity]);

  const handleWhatsAppOrder = useCallback(() => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }, [generateWhatsAppMessage]);

  return (
    <div className="min-h-screen bg-orange-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-black text-white p-6 sm:p-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            <span className="text-orange-500">Neovid</span> Inspect Black Friday
          </h1>
          <p className="text-lg opacity-90">{APP_DESCRIPTION}</p>
        </header>

        <main className="p-6 sm:p-8 lg:p-10">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-8 rounded-md" role="alert">
            <p className="font-bold">Ofertă Specială Black Friday!</p>
            <p className="text-sm">
              Aceste reduceri sunt valabile pentru comenzi în avans. După confirmarea și încasarea comenzii, se poate trece imediat la execuția lucrărilor.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalii de Contact</h2>
            <div className="mb-4">
              <label htmlFor="company-name-input" className="block text-sm font-medium text-gray-900 mb-2">
                Nume societate:
              </label>
              <input
                type="text"
                id="company-name-input"
                name="company-name-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: SC NEOFUND SRL"
                className="mt-1 block w-full px-3 py-2 text-base border-gray-600 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md shadow-sm bg-gray-800 text-white"
                aria-label="Introduceți numele societății"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contact-person-input" className="block text-sm font-medium text-gray-900 mb-2">
                Numele celui care completează:
              </label>
              <input
                type="text"
                id="contact-person-input"
                name="contact-person-input"
                value={contactPersonName}
                onChange={(e) => setContactPersonName(e.target.value)}
                placeholder="Ex: Ion Popescu"
                className="mt-1 block w-full px-3 py-2 text-base border-gray-600 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md shadow-sm bg-gray-800 text-white"
                aria-label="Introduceți numele persoanei de contact"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="contact-info-input" className="block text-sm font-medium text-gray-900 mb-2">
                Număr de telefon / Email:
              </label>
              <input
                type="text"
                id="contact-info-input"
                name="contact-info-input"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Ex: 07xx xxx xxx sau exemplu@email.com"
                className="mt-1 block w-full px-3 py-2 text-base border-gray-600 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md shadow-sm bg-gray-800 text-white"
                aria-label="Introduceți numărul de telefon sau adresa de email"
              />
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Completează locația șantierului și estimează transportul</h2>
            <div className="mb-4">
              <label htmlFor="manual-location-input" className="block text-sm font-medium text-gray-900 mb-2">
                Locația șantierului:
              </label>
              <input
                type="text"
                id="manual-location-input"
                name="manual-location-input"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="Ex: Str. Exemplu, Nr. 10, București"
                className="mt-1 block w-full px-3 py-2 text-base border-gray-600 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md shadow-sm bg-gray-800 text-white"
                aria-label="Introduceți manual locația șantierului"
              />
            </div>
            
            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
              <p className="block text-sm font-medium mb-2">
                Estimați distanța pentru transport de la Str. Livezilor, Mogoșoaia:
              </p>
              <p className="text-xs text-gray-700 mb-3">
                Folosiți butoanele de mai jos pentru a obține o rută, apoi introduceți numărul de kilometri în câmpul de mai jos.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                <button
                  onClick={() => handleOpenMaps('google')}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
                  aria-label="Calculează distanța cu Google Maps"
                >
                  <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c3.866 0 7 3.134 7 7 0 5.25-7 13-7 13S5 14.25 5 9c0-3.866 3.134-7 7-7zm0 9a2 2 0 100-4 2 2 0 000 4z"/></svg>
                  Google Maps
                </button>
                <button
                  onClick={() => handleOpenMaps('waze')}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 text-sm"
                  aria-label="Calculează distanța cu Waze"
                >
                  <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.5c-4.142 0-7.5-3.358-7.5-7.5s3.358-7.5 7.5-7.5 7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5zm.106-12.871l-.106.106-2.5 2.5a.75.75 0 000 1.06l1.25 1.25a.75.75 0 001.06 0l1.25-1.25a.75.75 0 001.06 0l1.25 1.25a.75.75 0 001.06 0l1.25-1.25a.75.75 0 000-1.06l-2.5-2.5a.75.75 0 00-1.06 0zM12 8c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm-3.5 6a.5.5 0 110-1 .5.5 0 010 1zm7 0a.5.5 0 110-1 .5.5 0 010 1z"/></svg>
                  Waze
                </button>
              </div>
              <label htmlFor="estimated-distance-input" className="block text-sm font-medium text-gray-900 mb-2">
                Distanța (km):
              </label>
              <input
                type="number"
                id="estimated-distance-input"
                name="estimated-distance-input"
                value={estimatedDistanceKm}
                onChange={(e) => setEstimatedDistanceKm(parseInt(e.target.value) || 0)}
                min="0"
                placeholder="Ex: 25 (doar cifre)"
                className="mt-1 block w-full px-3 py-2 text-base border-gray-600 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md shadow-sm bg-gray-800 text-white"
                aria-label="Introduceți distanța estimată în kilometri"
              />
              {estimatedDistanceKm > 0 && (
                <p className="text-sm text-gray-700 mt-2">
                  Cost transport: <span className="font-semibold text-red-600">{transportCost.toFixed(2)} RON</span>
                </p>
              )}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alege serviciile și cantitățile</h2>
            <ServiceInput
              service={hidroInspectionPackageService}
              quantity={packageQuantity}
              onQuantityChange={setPackageQuantity}
            />
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
              <button
                onClick={() => handleShowEquipmentDetails(EquipmentType.HIDRO)}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-red-500 text-base font-medium rounded-md text-red-500 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                aria-label="Detalii despre echipamentul de hidrocurățare"
              >
                Detalii Echipament Hidrocurățare
              </button>
              <button
                onClick={() => handleShowEquipmentDetails(EquipmentType.VIDEO_INSPECTION)}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-red-500 text-base font-medium rounded-md text-red-500 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                aria-label="Detalii despre echipamentul de inspecție video"
              >
                Detalii Echipament Inspecție Video
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sumarul ofertei tale</h2>
            <OfferSummary
              location={selectedLocation}
              selectedServices={selectedServices}
              transportCost={transportCost}
              totalPrice={totalPrice}
            />
          </section>
        </main>

        <footer className="sticky bottom-0 bg-white p-4 sm:p-6 lg:p-8 border-t border-gray-200 shadow-md">
          <button
            onClick={handleWhatsAppOrder}
            disabled={!canSendOrder}
            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-all duration-300 mb-4
              ${canSendOrder ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' : 'bg-gray-700 cursor-not-allowed text-gray-400'}`}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.6-3.807-1.6-5.836 0-6.092 4.938-11.029 11.03-11.029 2.946 0 5.721 1.144 7.828 3.252 2.107 2.107 3.25 4.882 3.25 7.828s-1.143 5.721-3.25 7.828c-2.107 2.107-4.882 3.25-7.828 3.25-.983 0-1.95-.143-2.885-.42l-6.216 1.625zm6.575-10.706c-.144-.109-.947-.504-1.091-.555-.144-.05-.248-.075-.352.05-.104.125-.4.504-.494.607-.095.104-.191.114-.352.063-.162-.05-.683-.254-.978-.6-.295-.346-.247-.294-.173-.42.074-.125.166-.247.222-.322.056-.075.03-.144-.025-.204-.055-.06-.352-.94-.482-1.29-.131-.35-.262-.294-.352-.294h-.347c-.094 0-.248.013-.378.143-.13.13-.494.482-.494 1.173 0 .692.506 1.358.577 1.458.07.099 1.002 1.527 2.42 2.156 1.419.629 1.419.423 1.696.398.276-.026.85-.349.978-.654.129-.304.129-.556.094-.656z"/>
            </svg>
            Trimite Comanda pe WhatsApp ({totalPrice.toFixed(2)} RON)
          </button>
          <div className="text-xs text-gray-700 mt-2 space-y-1 text-center">
            <p>Vidanjare inclusă pentru apa folosită la spălarea conductei + 10 MC incluși extra / deplasare / {PACKAGE_QUANTITY_STEP} m minim / comandă.</p>
            <p>Alimentarea cu apă și locul de deversare a apelor reziduale intră în sarcina beneficiarului.</p>
          </div>
        </footer>

        {showEquipmentModal && currentEquipmentType && (
          <div className="fixed inset-0 bg-orange-500 bg-opacity-75 flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog" aria-labelledby="equipment-details-title">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full text-gray-900 relative">
              <h3 id="equipment-details-title" className="text-2xl font-bold mb-4">{modalContent.title}</h3>
              {modalContent.imageUrl && (
                <img src={modalContent.imageUrl} alt={modalContent.title} className="w-full h-48 object-cover mb-4 rounded-md" />
              )}
              <p className="text-gray-800 whitespace-pre-line">{modalContent.text}</p>
              <button
                onClick={() => { setShowEquipmentModal(false); setCurrentEquipmentType(null); }}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Închide detaliile echipamentului"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
