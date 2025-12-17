import type { AuthResponse } from "../utils/types/types";

const API_URL = 'http://localhost:8080/api';
export const authService = 
{
    login: async (email: string, password:string): Promise<AuthResponse> =>
    {
        const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json'},
            body : JSON.stringify({email, password}),
        });
        if (!response.ok) {
            throw new Error ('Identifiant invalides');
        }
        return response.json();
    }
}
// export const authService = {
//   login: async (email: string, pass: string) => {
//     // On simule un délai de réseau de 1 seconde
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Au lieu de faire un axios.post qui va échouer (CORS), 
//     // on renvoie directement des données de test.
//     return {
//       token: "mock-jwt-token-xyz",
//       admin: {
//         id: "dev-123",
//         firstName: "raza",
//         lastName: "Mahery",
//         email: email, // On utilise l'email tapé
//         gender: "MALE",
//         statusSocial: "Travailleur",
//         tribe: "Merina",
//         imageUrl: "",
//         phoneNumber: "0340000000",
//         sequenceNumber: 1,
//         createDate: "2023-01-01",
//         password: "",
//         verified: true,
//         birthDate: "1990-01-01",
//         quartier: "Analamahitsy"
//       }
//     };
//   }
// };