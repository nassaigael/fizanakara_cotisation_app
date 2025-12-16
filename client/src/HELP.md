** reducers, store et context

Dans React, reducers, store et context sont des outils pour gérer l'état de l'application : le Store (souvent avec Redux ou Context) est le conteneur unique de l'état global, les Reducers (avec Redux ou useReducer) définissent comment cet état change de manière prévisible en réponse à des actions, et le Context permet de fournir cet état et ses mises à jour aux composants enfants sans passer manuellement des props, résolvant ainsi le "prop drilling". Ils sont souvent combinés pour gérer des états complexes de manière structurée. 
1. Le Store (Magasin d'état)

    Rôle : Contient l'état complet et unique de votre application, rendant les données accessibles globalement.
    Exemple : Un objet unique (comme un objet JavaScript) qui détient toutes les données de l'application (utilisateur connecté, données de panier, thèmes, etc.).
    Mise en œuvre : Fourni par React Context (pour un état global plus simple) ou par des bibliothèques comme Redux, qui centralisent l'état dans un unique "store". 

2. Les Reducers (Réducteurs)

    Rôle : Fonctions pures qui décrivent comment l'état doit changer en fonction des "actions" (événements) qui lui sont envoyées, retournant toujours un nouvel état immuable.
    Fonctionnement : (état_actuel, action) => nouvel_état.
    Usage : Permettent une logique de mise à jour d'état centralisée et prévisible, évitant les modifications directes et les effets secondaires. 

3. Le Context (Contexte)

    Rôle : Permet de partager des données (l'état) entre composants sans passer de props à chaque niveau (résout le "prop drilling").
    Fonctionnement : Un Provider injecte l'état dans l'arbre des composants, et des Consumer (ou useContext hook) y accèdent directement.
    Avantages : Idéal pour les données qui doivent être accessibles par de nombreux composants (thème, langue, utilisateur connecté). 

Comment ils fonctionnent ensemble

    Vous pouvez utiliser useReducer pour gérer la logique complexe d'un état (le reducer), puis utiliser useContext pour rendre cet état (et la fonction dispatch qui le met à jour) disponible à toute l'application.
    C'est une alternative légère à Redux pour des cas d'usage où Redux serait trop complexe, offrant une bonne gestion d'état globale sans dépendance externe