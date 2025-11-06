export const WHATSAPP_NUMBER = "40733519148"; // Without spaces or special characters for wa.me link

export enum ServiceType {
  HIDRO_INSPECTION_PACKAGE = "Pachet Hidrocuratare + Inspecție Video Canalizare DN 250",
}

export interface Service {
  type: ServiceType;
  unit: string;
  pricePerUnit: number;
  blackFridayPricePerUnit: number;
}

export const SERVICES: Service[] = [
  {
    type: ServiceType.HIDRO_INSPECTION_PACKAGE,
    unit: "metri liniari",
    pricePerUnit: 21, // Updated normal price for the combined package
    blackFridayPricePerUnit: 14, // New Black Friday price per linear meter (RON)
  },
];

export const APP_NAME = "Neovid Inspect Black Friday";
export const APP_DESCRIPTION = "Alege pachetul de hidrocurățare și inspecție video canalizare DN 250 la preț special de Black Friday și trimite comanda rapid prin WhatsApp.";

export const TRANSPORT_PRICE_PER_KM = 6; // RON per kilometer

export const MOGOSOAIA_DESTINATION = "Str. Livezilor, Mogoșoaia"; // Fixed destination for transport calculation

export const MIN_PACKAGE_QUANTITY = 500; // Minimum initial offer quantity
export const PACKAGE_QUANTITY_STEP = 500; // Quantity must be a multiple of this step

export enum EquipmentType {
  HIDRO = "HIDRO",
  VIDEO_INSPECTION = "VIDEO_INSPECTION",
}

export const HIDRO_EQUIPMENT_DETAILS_TEXT = `Autospecială Wiedemann Super 2000 cu recirculare apă – curățare eficientă, economică și continuă. Ideală pentru lucrări noi de canalizare, cu autonomie ridicată și randament excelent. Dotată cu pompă WOMA de 410 l/min și sistem de vid cu aspirație puternică de 3.000 mc/h de la peste 8 metri adâncime. Configurație 6x6, special concepută pentru terenuri dificile și șantiere fără drumuri asfaltate.`;

export const VIDEO_INSPECTION_EQUIPMENT_DETAILS_TEXT = `Sistem video profesional RICO 150 ED cu software WinCan – inspecție de înaltă precizie pentru rețele de canalizare. Robot autopropulsat, ideal pentru conducte DN150–DN800, cameră HD pivotantă, zoom optic, iluminare LED și capabil de măsurători detaliate. Softul WinCan permite raportare conform standardelor europene.`;