
import { Station, PriceSlot } from '../../services/stations/types'

const STANDARD_PRICING: PriceSlot[] = [
  { start: '00:00', end: '08:00', price: 0.25, label: 'Off-Peak' },
  { start: '08:00', end: '18:00', price: 0.45, label: 'Peak' },
  { start: '18:00', end: '24:00', price: 0.35, label: 'Standard' },
]

export const MOCK_STATIONS: Station[] = [
  {
    id: '1',
    name: 'Tesla Supercharger - Downtown',
    address: 'Downtown Plaza, Level B2, San Francisco',
    distance: '0.8 km',
    pricePerKwh: 0.45,
    priceSchedule: STANDARD_PRICING,
    available: 3,
    total: 6,
    type: 'DC',
    power: 250,
    status: 'online',
    openingHours: '24/7',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    mapPos: { top: '40%', left: '45%' },
    connectors: [
      { id: 't-1', label: '1A', code: '100001', type: 'NACS', power: 250, status: 'available' },
      { id: 't-2', label: '1B', code: '100002', type: 'NACS', power: 250, status: 'busy' },
      { id: 't-3', label: '2A', code: '100003', type: 'NACS', power: 250, status: 'available' },
      { id: 't-4', label: '2B', code: '100004', type: 'NACS', power: 250, status: 'offline' },
      { id: 't-5', label: '3A', code: '100005', type: 'NACS', power: 250, status: 'available' },
      { id: 't-6', label: '3B', code: '100006', type: 'NACS', power: 250, status: 'faulted' },
    ],
  },
  {
    id: '2',
    name: 'GreenMotion AC Hub',
    address: '124 Market St, Financial District',
    distance: '1.2 km',
    pricePerKwh: 0.35,
    available: 3,
    total: 5,
    type: 'AC',
    power: 11,
    status: 'busy',
    openingHours: '06:00 - 23:00',
    coordinates: { lat: 37.7849, lng: -122.4094 },
    mapPos: { top: '25%', left: '70%' },
    connectors: [
      { id: 'g-1', label: 'A', code: '200001', type: 'Type 1', power: 7.2, status: 'available' },
      { id: 'g-2', label: 'B', code: '200002', type: 'Type 1', power: 7.2, status: 'busy' },
      { id: 'g-3', label: 'C', code: '200003', type: 'Type 2', power: 11, status: 'busy' },
      { id: 'g-4', label: 'D', code: '200004', type: 'Type 2', power: 11, status: 'busy' },
      { id: 'g-5', label: 'E', code: '200005', type: 'Type 2', power: 11, status: 'busy' },
    ],
  },
  {
    id: '3',
    name: 'City FastCharge Station',
    address: '888 Brannan St, SoMa',
    distance: '2.5 km',
    pricePerKwh: 0.52,
    available: 0,
    total: 4,
    type: 'DC',
    power: 150,
    status: 'busy',
    openingHours: '24/7',
    coordinates: { lat: 37.7712, lng: -122.4032 },
    mapPos: { top: '55%', left: '80%' },
    connectors: [
      { id: 'cf-1', label: 'P1', code: '300001', type: 'CCS1', power: 150, status: 'busy' },
      { id: 'cf-2', label: 'P2', code: '300002', type: 'CCS2', power: 150, status: 'busy' },
      { id: 'cf-3', label: 'P3', code: '300003', type: 'CHAdeMO', power: 50, status: 'offline' },
      { id: 'cf-4', label: 'P4', code: '300004', type: 'CCS1', power: 150, status: 'faulted' },
    ],
  },
  {
    id: '4',
    name: 'VoltPark - Maintenance',
    address: '555 Mission St, North Beach',
    distance: '3.1 km',
    pricePerKwh: 0.28,
    available: 0,
    total: 2,
    type: 'AC',
    power: 22,
    status: 'maintenance',
    openingHours: 'Temporarily Closed',
    coordinates: { lat: 37.7988, lng: -122.4101 },
    mapPos: { top: '15%', left: '30%' },
    connectors: [
      { id: 'vp-1', label: '01', code: '400001', type: 'Type 2', power: 22, status: 'offline' },
      { id: 'vp-2', label: '02', code: '400002', type: 'Type 2', power: 22, status: 'offline' },
    ],
  },
  {
    id: '5',
    name: 'Highway Express DC',
    address: 'Hwy 101 Service Area',
    distance: '15.2 km',
    pricePerKwh: 0.65,
    available: 8,
    total: 10,
    type: 'DC',
    power: 350,
    status: 'online',
    openingHours: '24/7',
    coordinates: { lat: 37.7001, lng: -122.4501 },
    mapPos: { top: '85%', left: '20%' },
    connectors: [
      { id: 'he-1', label: 'High-1', code: '500001', type: 'CCS2', power: 350, status: 'available' },
      { id: 'he-2', label: 'High-2', code: '500002', type: 'CCS2', power: 350, status: 'available' },
      { id: 'he-3', label: 'High-3', code: '500003', type: 'GBT', power: 120, status: 'available' },
      { id: 'he-4', label: 'High-4', code: '500004', type: 'GBT', power: 120, status: 'available' },
    ],
  },
  {
    id: '6',
    name: 'Community AC Pillar',
    address: 'Private Dr, Twin Peaks',
    distance: '4.5 km',
    pricePerKwh: 0.22,
    available: 0,
    total: 1,
    type: 'AC',
    power: 7,
    status: 'closed',
    openingHours: 'Residents Only',
    coordinates: { lat: 37.7544, lng: -122.4477 },
    mapPos: { top: '70%', left: '10%' },
    connectors: [
      { id: 'ca-1', label: 'Main', code: '600001', type: 'Type 2', power: 7, status: 'offline' },
    ],
  }
];

export const routes = {
  '/stations': MOCK_STATIONS,
};

export const dynamicRoutes = [
  {
    pattern: /^\/stations\/([^/]+)$/,
    handler: (path: string) => {
      const id = path.split('/').pop();
      return MOCK_STATIONS.find(s => s.id === id) || MOCK_STATIONS[0];
    }
  }
];
