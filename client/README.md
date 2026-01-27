# 🚀 Fizanakara Frontend - Gestion de Cotisations

Ce dossier contient la partie cliente de l'application, développée avec **React 19**, **Vite (Rolldown)** et **Tailwind CSS 4**.

## 🏗️ Architecture des Types & Contrats API

Nous avons adopté une approche de **Typage Intelligent** pour garantir une synchronisation parfaite avec le Backend Spring Boot sans duplication de code.

### 🧬 Structure des DTO (Data Transfer Objects)

Les types sont organisés par domaine dans `src/lib/types/` et suivent une hiérarchie orientée objet :

* **Common / Enums** : Définition des constantes partagées (Gender, Role, Status).
* **Admins** : Gestion de l'authentification et des comptes (Login, Register, Response).
* **Persons** : Structure unifiée pour les Membres et les Enfants, supportant une hiérarchie récursive (`parentId`, `childrenCount`).
* **Contributions & Payments** : Gestion financière incluant le suivi des montants payés et restants.

### 🛠️ Principes de Développement

1.  **Héritage d'Interfaces** : Utilisation d'interfaces de base (`IBaseAdmin`, `PersonDto`) pour centraliser les champs communs. Les variantes `Response` ou `Update` héritent de ces bases via `extends` ou des utilitaires comme `Partial<T>`.
2.  **Validation Mirroring** : Chaque DTO possède un schéma **Zod** correspondant dans `src/lib/schemas/`. Ces schémas répliquent les contraintes du Backend (ex: `@NotBlank` devient `.min(1)`) pour intercepter les erreurs avant l'appel API.
3.  **Typage des Dates** : 
    * `java.time.LocalDate` ➔ `string` (Format ISO `YYYY-MM-DD`).
    * `java.time.Year` ➔ `number`.
4.  **Gestion Financière** : Les types `BigDecimal` du backend sont traités comme des `number` en TypeScript pour les calculs de `totalPaid` et `remaining`.



## 🚦 État d'Avancement

| Domaine           | Types TS | Schémas Zod | Services API   |
| :---------------- | :------: | :----------:| :------------: |
| Authentification  |    ✅    |       ✅    | ✅ Terminé     |
| Membres (Person)  |    ✅    |       ✅    | ✅ Terminé     |
| Cotisations       |    ✅    |       ✅    | ✅ Terminé     |
| Paiements         |    ✅    |       ✅    | ✅ Terminé     |

---
*Note : Pour la maintenance, veillez à toujours mettre à jour les interfaces dans `src/lib/types` si le Backend modifie un DTO Java.*

## 📡 Couche Service & Communication API

L'application utilise **Axios** pour communiquer avec le backend Spring Boot. La logique est centralisée pour garantir sécurité et robustesse.

### 🛡️ Gestion de la Sécurité (Intercepteurs)

Nous utilisons des intercepteurs pour automatiser les tâches répétitives :

1.  **Request Interceptor** : Avant chaque envoi, le service vérifie si un `accessToken` existe dans le stockage local et l'ajoute au header `Authorization: Bearer ...`.
2.  **Response Interceptor (Vérification)** : 
    * **Succès** : La réponse est transmise directement au composant.
    * **Erreur 401** : Redirection automatique vers `/login` (Token expiré).
    * **Erreur 403** : Notification d'accès refusé (Droits insuffisants).
    * **Erreur 500/Réseau** : Notification d'erreur serveur via `react-hot-toast`.



### 🔌 Services Implémentés

| Service              | Controller Backend      | Responsabilité                             |
| :--------------------| :---------------------- | :----------------------------------------- |
| `AuthService`        | `AdminsAuthController`  | Login, Register, Profil Admin              |
| `PersonService`      | `PersonController`      | CRUD Membres, Ajout d'enfants, Promotion   |
| `ContributionService`| `ContributionController`| Génération annuelle, Suivi des montants    |
| `PaymentService`     | `PaymentController`     | Enregistrement et historique des paiements |
| `DistrictService`    | `DistrictController`    | Liste et gestion des districts             |
| `TributeService`     | `TributeController`     | Liste et gestion des tributs               |

### 🛠️ Utilisation Type

```typescript
// Exemple d'appel dans un composant
const handleLogin = async (data) => {
  try {
    const response = await AuthService.login(data);
    localStorage.setItem('accessToken', response.token);
  } catch (error) {
    // L'erreur est déjà notifiée par l'intercepteur, 
    // on gère ici uniquement la logique spécifique au composant
  }
}