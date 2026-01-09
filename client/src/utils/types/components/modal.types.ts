// components/types/Modal.types.ts
import type { MemberResponse } from "../models/Member.types";
import type { ChildResponse } from "../models/Children.types";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface MemberFormModalProps extends BaseModalProps {
  memberToEdit?: MemberResponse | null;
  isChild?: boolean;
}

export interface ChildFormModalProps extends BaseModalProps {
  childToEdit?: ChildResponse | null;
  parents: MemberResponse[]; // Liste pour le Select du parent
}

export interface PopupProps extends BaseModalProps {
  // On utilise l'union type pour accepter n'importe quel type d'utilisateur
  data: MemberResponse | ChildResponse | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}