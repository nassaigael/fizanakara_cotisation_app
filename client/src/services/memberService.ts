import axios from 'axios';
import type { Member } from '../utils/types/memberType';

const API_URL = "http://localhost:8080/api/members";

export const memberService = {
  getAll: async (): Promise<Member[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
  deleteMultiple: async (ids: number[]): Promise<void> => {
    await axios.post(`${API_URL}/delete-batch`, { ids });
  }
};