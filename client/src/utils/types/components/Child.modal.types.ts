import type { ChildResponse } from '../models/Children.types';
import type { MemberResponse } from '../models/Member.types';

export interface ChildFormModalProps
{
    isOpen: boolean;
    onClose: () => void;
    childToEdit?: ChildResponse | null;
    parents: MemberResponse[];
    onSuccess: () => void;
}