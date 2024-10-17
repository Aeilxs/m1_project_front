# Créer un projet Angular avec Firebase

```bash
# Créer un projet
ng new mon_super_projet
```

**IMPORTANT**: pour s'éviter des petits soucis, le "projet-id", par défaut le nom du dossier dans lequel on va mettre le projet angular **DOIT** être en **minuscule**. Sinon pour Firebase c'est pas bon. Mais c'est plus loin dans la config que ça gênera :wink:

## Installer les dépendances requises

```bash
ng add @angular/fire
ng add @angular/material
```

- **Options à cocher (firebase)**

  - **Authentication** : Gère l'authentification des utilisateurs avec SSO pour sécuriser l'accès à l'application.
  - **Cloud Storage** : Stocke les partitions (fichiers PDF) en toute sécurité avec contrôle des accès.
  - **Google Analytics** : Collecte des données sur l'utilisation de l'application pour analyser les interactions utilisateurs.
  - **App Check** : Protège l'application contre les accès non autorisés et les scripts malveillants.
  - **Cloud Functions** : Exécute de la logique serveur pour gérer les tâches critiques (validation, notifications).
  - **Allow Firebase to collect CLI and Emulator Suite usage and error reporting information** ? Télémétrie Google

- **Options à cocher (mui)**

  - **Theme**: custom, sinon j'ai pas trouvé comment faire theme dark/light
  - **Global material typo**: Evite de choisir les polices, utilise les polices de MUI par défaut partout.
  - **Animations**: Au choix, mettre oui par défaut le plus simple.

## Repartir de zéro

- Avant de continuer, c'est quoi l'injection de dépendance ?
  - [rtfm](https://angular.fr/services/di) :roll_eyes:

**Angular CLI** (Command Line Interface) génère par défaut un `AppComponent` en mode **standalone**. Cela signifie que ce composant peut fonctionner **indépendamment**, sans être inclus dans un **module**. Cette approche est rapide et pratique, surtout pour les développeurs ayant une bonne maîtrise d’Angular, pas nous quoi.

Pour nous qui souhaitons **apprendre et maîtriser** le fonctionnement complet d’Angular et mieux comprendre ses **concepts fondamentaux** (comme l'injection de dépendances et la modularité), nous allons opter pour une approche **plus classique** (ancien comportment par défaut d'Angular) :sweat_smile:

Donc, on supprime l'intégralité du dossier `app/` et le `main.ts`. Comme ça on a plus rien du tout, plus de code angular, on peut repartir calmement à vide et comprendre tout ce qui se passe (+ ou -).

### Première utilisation de AngularCLI

- Les modules, services etc sont relativement "verbeux" et nécessitent du code "boilerplate" (du code écrit par défaut pour que ça fonctionne, sans quoi, c'est pas bon) et qui ne change pas/presque pas. On peut créer par défaut des modules services etc en ligne de commande. Par exemple, pour recréer notre dossier `app/` qu'on a intégralement supprimé et avoir de nouveau un point d'entée on peut utiliser la commande:

```bash
# par défaut:
# ng g module blabla => src/app/blabla/blabla.module.ts
# ng g module blabla --flat => src/app/blabla.module.ts
# --flat ici permet de créer le module tel que: src/app/app.module.ts et pas avoir src/app/app/app.module.ts
# donc pour avoir notre module app à la racine de src/ on run:
ng g module app --flat
```

- **Important: attention, par défaut le module créer sera un `CommonModule`, pour notre composant principal (et uniquement celui ci) on retire le CommonModule et on met le BrowserModule, qui permettra à AppModule de modifier le DOM de la page.**

Ca nous créer notre dossier app/ dans lequel on a notre module principal, dans lequel on gérera les configurations de l'application, initialisation des différents services (ex: Firebase, des services internes comme les routes etc...).

Ok, on a un AppModule par défaut, vierge, sans rien. Mais on a pas de point d'entrée pour notre app. Le point d'entrée c'est le premier morceau de code qui sera executé, c'est important pour suivre le "fil" de ce qui se passe et comprendre comment ça fonctionne:

- Par défaut, le point d'entrée c'était `main.ts` mais on l'a supprimé :sneezing_face:

  - Pas grave, on le refait :relieved:

- Version par défaut de `main.ts`

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent).catch((err) => console.error(err));
```

- Notre version de `main.ts`

```ts
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
```

- Principale différence
  - On utilise pas `bootstrapApplication(AppComponent)` car on a plus de AppComponent de toutes façons :smirk: - On déclare la plateforme, ça peut sembler bête car Angular est fait pour tourner uniquement sur du front-end, mais grâce à ça on peut effectivement choisir d'utiliser un autre type de plateforme, un serveur par exemple pour faire du SSR :

```ts
import { platformServer } from "@angular/platform-server";
import { AppModule } from "./app/app.server.module";

platformServer()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
```

- Ok nickel, normalement on est bon. Maintenant il nous faut refaire un `AppComponent`, qui répondra à nos attentes. Ce sera le composant racine dans laquelle on gérera tout le HTML de l'application en gros +/-. Si on fait la commande `ng serve` pour lancer le serveur, on a une app angular fonctionnelle, en ayant tout refait. Mais on affiche rien !

```bash
ng g component app --flat
```

On connaît la chanson, il va nous générer tout un tas de de bazar. Normalement tout est bon par défaut, laissons le composant comme ça pour le moment et go le mettre dans notre `AppModule`, c'est ce qu'on fera pour chaque nouveau composant, on le mettra dans son module.

- **Important:** on utilise pas de composants standalone, alors on supprime dans le décorateur du composant, dans l'objet de configuration les lignes `imports:[]` et `standalone: true`

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

On rajoute également `bootstrap: [AppComponent]`. C'est juste pour dire que le point d'entrée du HTML c'est ici. Sinon, on se contentera du `declarations: [AppComponent]` pour les autres.

Maintenant, si on fait `ng serve` si ça n'a pas été fait avant, on devrait avoir quelque chose comme `app works!` à l'écran.

## Routing

Normalement on a une architecture de dossier telle que

- src/
  - app/
    - app.component.ts
    - app.component.html
    - app.component.scss
    - app.spec.ts => ça c'est pour les tests, tous les .spec.ts sont des tests unitaires
    - app.module.ts
  - main.ts

On va avoir besoin d'une manière facile pour "dire" à notre app, où elle est et ce qu'elle doit afficher. Pour ça on va utiliser les routes. **A ne pas confondre avec les routes du backend et les verbes http qui sont liés à ces routes (GET, POST ...)** pour interagir avec une API. Plus d'infos sur les [api rest](https://www.ibm.com/fr-fr/topics/rest-apis)

Ici le principe est relativement le même, mais un exemple vaut mieux qu'une longue tirade

```text
https://monapp.com/ => page d'accueil
https://monapp.com/signin => page de connexion
https://monapp.com/signup => page d'inscription

etc...
```

Par défaut les frameworks frontend moderne comme `Vue`, `Angular`, `React` & cie produisent des **SPA** (single page application), contrairement à l'ENT de l'ISEN par exemple. C'est à dire que dès qu'on clique sur un bouton de l'ENT, on envoie une requête HTTP au serveur qui fait sa tambouille et nous renvoie la page HTML complète. Avec une **SPA**, c'est le client qui va calculer le rendu de sa page dans le navigateur, et c'est le code javascript qui va donner les instructions. Ca autorise pas mal de chose, ça a aussi des inconvénients : [plus d'info ici](https://developer.mozilla.org/fr/docs/Glossary/SPA).

Pour chaque page on aura besoin de créer des "vues" / "pages". Et donc autant mettre une base propre dès le début. Comme à chaque fois qu'on a besoin de faire quelque chose on déclare un module, Angular donne déjà un moyen de **router son application** et donc on fait les choses proprement en suivant la [doc](https://v17.angular.io/guide/routing-overview).

Donc on créer notre module avec

- **Vous faites pas baiser comme moi** : le nom **RouterModule** est **DEJA** reservé par Angular :zany_face:

```bash
# --flat       : parce qu'on a veut le garder dans le répertoire de app, après tout c'est un de nos composants principaux.
# --module=app : comme ça on dit automatiquement à angular qu'on veut injecter notre router module direct dans app, pas besoin de le faire à la main
# concrètement ça rajoute juste dans l'objet de config du module app dans imports: [AppRouterModule]
ng generate module app-router --flat --module=app
```

Ensuite, on veut configurer notre AppRouterModule pour utiliser le fameux **RouterModule** d'Angular, déjà réservé.

```ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouterModule {}
```

Dans routes, on déclarera nos routes... :upside_down_face: exemple:

```ts
// sans lazy loading
const routes: Routes = [
  { path: "", component: HomeComponent }, // Route pour la page d'accueil
  { path: "signin", component: SignInComponent }, // Route pour la page de connexion
  { path: "**", component: NotFoundComponent }, // Route par défaut pour gérer les URLs non trouvées
];
```

Voilà, on a un `AppRouterModule` sans aucune route, mais c'est pas grave. La config est prête, on pourra en rajouter en temps voulu.

## Avoir un layout facilement

- `AppComponent` est le point d'entrée de notre HTML (+/-), c'est là qu'on mettra notre composant `<router-outlet></router-outlet>`, suivant l'URL que visitera l'user, le `AppRouterModule` fera sa tambouille et chargera la bonne page, déclarée dans le tableau `routes` plus haut.

Cependant, il va y avoir des choses qu'on souhaite avoir en permanence à l'écran, par ex le header, le footer ... avec Angular c'est très simple à faire.

Le code de `app.compoment.html` est :

```html
<p>app works!</p>
```

On va créer un module qui va s'occuper d'afficher ce qui se trouve en dehors du routeur, indépendamment de la route que l'user visite. Toujours la même chanson

```bash
ng g module layout
ng g component layout/header
ng g component layout/footer
```

Ca va nous créer tout le nécessaire, on doit pouvoir certainement ajouter pour les deux components dans la commande --module=layout pour les inclure directement, pas tester mais je suppose. Bref, pas très compliqué sinon de le faire à la main, tout se fait dans `LayoutModule`. On connaît la chanson pour les composants, ce ne sont pas des standalones alors on supprime `imports: []` et `standalone: true`.

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

@NgModule({
  declarations: [HeaderComponent, FooterComponent], // on les déclare, c'est important c'est pour dire à notre DI container qu'il faut les instancier.
  imports: [CommonModule],
  exports: [HeaderComponent, FooterComponent],
  // on les exports, c'est aussi important c'est pour dire que si on importe LayoutModule dans un autre module
  // alors on veut pouvoir utiliser HeaderComponent et FooterComponent dans le module qui importe LayoutModule.
})
export class LayoutModule {}
```

On importe le `LayoutModule` à l'intérieur de `AppModule` pour pouvoir accéder à nos composants headers et footers.

Ensuite, maintenant passons à l'assemblage de la structure principale du html de notre app dans `app.component.html`

```html
<app-header></app-header>
<main>
  <router-outlet></router-outlet>
</main>
<app-footer></app-footer>
```

Ainsi, le header + le footer seront **toujours affichés** peu importe la route dans laquelle on se situe.

### Utiliser Angular Material, les composants de Googlz !

On utilise la **[documentation](https://material.angular.io/)** qui in fine sera **BIEN PLUS PERTINENTE QUE CHAT GPT** car y a vraiment qu'à cliquer sur la partie **Components** en haut dans leur navbar, choisir celui qu'on veut et copier coller le code.

[Icônes](https://fonts.google.com/icons)

On évite au **maximum** de coder les composants nous même car comme les devs de chez Google disent :

```text
Internationalized and accessible components for everyone. Well tested to ensure performance and reliability.

Straightforward APIs with consistent cross platform behaviour.
```

On fera pas mieux qu'eux, et si on doit intégrer l'appli mobile et qu'on peut réussir à utiliser notre code Angular via des libs comme `ion` etc, j'ai regardé on sera très très content.

---

## Archi globale

```text
angular_partoche/
│
├── .angular/
├── .vscode/
├── public/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── layout/
│   │   │   │   ├── header/
│   │   │   │   ├── footer/
│   │   │   └── errors/
│   │   │       ├── not-found/
│   │   │       ├── server-error/
│   │   │       └── unauthorized/
│   │   ├── features/
│   │   │   ├── home/
│   │   │   ├── admin/
│   │   │   └── user-profile/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   │   └── models/
│   │   └── app.module.ts
│   ├── environments/
├── ...

```
