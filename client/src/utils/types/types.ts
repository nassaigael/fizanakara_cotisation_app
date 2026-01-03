export type Gender = "MALE" | "FEMALE"; 
export type CotisationStatus = "Payé" | "En cours";
export type Status = 'ETUDIANT' | 'TRAVAILLEUR' | 'ENFANT'; 
export type PaymentMethod = "Liquide" | "MVola" | "Orange Money" | "Airtel Money" | "Virement";
export type UIVariant = "success" | "warning" | "info" | "danger";

export interface UserBase {
  id: string | number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: Gender;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface District {
  id: number;
  name: string;
}

export interface Tribute {
  id: number;
  name: string;
}

export interface Admin extends UserBase {
  email: string; // L'email est requis pour l'admin
  sequenceNumber?: number;
  birthDate: string;
  verified: boolean;
  role?: 'ADMIN' | 'SUPER_ADMIN';
}

export type AdminResponse = Admin;

export interface UpdateAdminDto extends Partial<Omit<Admin, 'id' | 'sequenceNumber' | 'createdAt'>> {
  password?: string;
}

export interface PaymentHistory {
  id: string | number;
  amount: number;
  date: string;
  year: number;
  method?: PaymentMethod;
  reference?: string; 
  status?: string;
}

export interface Member extends UserBase {
  status: Status;
  birthDate?: string;
  // --- AJOUTS POUR COMPATIBILITÉ DTO ---
  districtName?: string; 
  tributeName?: string;
  district?: District; 
  tribute?: Tribute;
  districtId?: number; 
  tributeId?: number;  
  cotisationStatus?: CotisationStatus;
  payments: PaymentHistory[]; 
}

// ... Reste des interfaces (AlertProps, ButtonProps, etc. identiques à ton fichier)
export interface AlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  variant?: UIVariant; 
}

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateAdminState: (updatedAdmin: Admin) => void;
}