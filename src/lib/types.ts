export interface Product {
  id: string;
  user_id: string;
  name: string;
  cost: number;
  suggested_price: number;
  sale_price: number;
  category: string;
  size: string;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  user_id: string;
  items: SaleItem[];
  total: number;
  client_name?: string;
  notes?: string;
  created_at: string;
}

export interface SaleItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  subtotal: number;
}

export interface Expense {
  id: string;
  user_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'draft' | 'sent' | 'received';
  created_at: string;
}

export interface OrderItem {
  product_name: string;
  quantity: number;
  unit_cost: number;
  subtotal: number;
}

export interface InventoryMovement {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  business_name: string;
  owner_name: string;
  address: string;
  city: string;
  phone: string;
  split_enabled: boolean;
  split_person1_name: string;
  split_person1_pct: number;
  split_person2_name: string;
  split_person2_pct: number;
  low_stock_threshold: number;
  expense_categories: string[];
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Etiquetas',
  'Bolsitas de plástico',
  'Envío a domicilio',
  'Pedido (mercancía)',
  'Transporte',
  'Otros',
];

export const PRODUCT_CATEGORIES = [
  'Almendras',
  'Arándanos',
  'Cacahuates',
  'Café',
  'Carnes',
  'Chocolate',
  'Dátiles',
  'Dulces regionales',
  'Especiales',
  'Frutas deshidratadas',
  'Granola',
  'Jamaica',
  'Mango',
  'Miel',
  'Mixes Energitas',
  'Nueces',
  'Piña',
  'Pistache',
  'Regionales',
  'Semillas',
  'Snacks',
  'Otros',
];
