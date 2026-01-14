import type { MemberResponse } from '../models/Member.types';
import type { ChildResponse } from '../models/Children.types';

export interface PopupProps {
  isOpen: boolean;
  member: MemberResponse | ChildResponse | null; 
  onClose: () => void;
  onEdit?: (id: string | number) => void;
}