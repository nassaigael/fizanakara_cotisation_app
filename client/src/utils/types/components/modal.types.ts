import type { MemberResponse } from '../models/Member.types';

export interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: MemberResponse | null;
  onSuccess: () => void;
  isChild?: boolean;
}