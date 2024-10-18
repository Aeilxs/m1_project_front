# Angular

## Architecture proposée

```text
project_dir
├── .editorconfig
├── .gitignore
├── .prettierignore
├── .prettierrc
├── README.md
├── angular.json
├── notes.md
├── package-lock.json
├── package.json
├── src
│   ├── app
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── core
│   │   │   ├── app-router.module.ts
│   │   │   ├── guards
│   │   │   │   └── .keep
│   │   │   ├── layout
│   │   │   │   ├── footer
│   │   │   │   │   ├── footer.component.html
│   │   │   │   │   ├── footer.component.scss
│   │   │   │   │   ├── footer.component.spec.ts
│   │   │   │   │   └── footer.component.ts
│   │   │   │   ├── header
│   │   │   │   │   ├── _header-theme.scss
│   │   │   │   │   ├── header.component.html
│   │   │   │   │   ├── header.component.scss
│   │   │   │   │   ├── header.component.spec.ts
│   │   │   │   │   └── header.component.ts
│   │   │   │   └── layout.module.ts
│   │   │   └── services
│   │   │       ├── theme-manager.service.spec.ts
│   │   │       └── theme-manager.service.ts
│   │   ├── features
│   │   │   ├── dashboard
│   │   │   │   ├── dashboard.component.html
│   │   │   │   ├── dashboard.component.scss
│   │   │   │   ├── dashboard.component.spec.ts
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   └── dashboard.module.ts
│   │   │   ├── home
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.scss
│   │   │   │   ├── home.component.spec.ts
│   │   │   │   ├── home.component.ts
│   │   │   │   └── home.module.ts
│   │   │   ├── signin
│   │   │   │   ├── signin.component.html
│   │   │   │   ├── signin.component.scss
│   │   │   │   ├── signin.component.spec.ts
│   │   │   │   ├── signin.component.ts
│   │   │   │   └── signin.module.ts
│   │   │   └── signup
│   │   │       ├── signup.component.html
│   │   │       ├── signup.component.scss
│   │   │       ├── signup.component.spec.ts
│   │   │       ├── signup.component.ts
│   │   │       └── signup.module.ts
│   │   └── shared
│   │       └── .keep
│   ├── index.html
│   ├── main.scss
│   ├── main.ts
│   ├── themes
│   │   ├── .keep
│   │   └── m3-theme.scss
│   └── utils
│       └── .keep
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

## core/

- C'est là qu'on met les trucs important qui sont là partout exemple le layout (header + footer).

### guards/

- C'est avec ça qu'on restreint l'accès à une route ou pas, par exemple route admin, retour à la homepage si non connecté etc... si l'utilisateur a pas fini de remplir un formulaire et quitte la page ...

### services/

- C'est ici qu'on met les services injectables dans toute notre app, mais on peut avoir des services spécifiques à un composant, qui de fait ne seront pas mis dans `services/` et on supprime l'objet de configuration pour le décourateur `@Injectable()`. Exemple juste en dessous avec le `ThemeManagerService` qui est global.

- Si on ne définit pas un service / guards etc ... comme global alors on doit le mettre dans le tableau de providers du module ou du composant standalone.

```ts
import { DOCUMENT } from "@angular/common";
import { Injectable, effect, inject, signal } from "@angular/core";

export type Theme = "light" | "dark";

// @Injectable() <===== pas global
@Injectable({
  providedIn: "root", // <===== global
})
export class ThemeManagerService {
  theme = signal<Theme>("light");

  private _document = inject(DOCUMENT);

  constructor() {
    // Handle client OS favorite theme color
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) this.theme.set("dark");

    // Handle local storage previous theme definition
    const savedTheme = localStorage.getItem("theme") as Theme;
    savedTheme ? this.theme.set(savedTheme) : this.theme.set("light");

    effect(() => {
      const currentTheme = this.theme();
      currentTheme === "dark"
        ? this._document.documentElement.classList.add("dark")
        : this._document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", currentTheme);
    });
  }

  toggleTheme() {
    this.theme.update((value) => {
      return value === "light" ? "dark" : "light";
    });
  }
}
```

### layout/

- C'est là qu'on mets les éléments persistant de l'UI, par exemple une bulle en bas à droite pour le chatbot, le header/appbar, footer ... Indépendamment de la page où on se trouve !

### app-router.module.ts

- Différence entre route front / back:

  - Routes back : endpoint d'une API (comme sur quarkus quand on fetch les heros etc en json)
  - Routes front : permettent de charger des composants en fonction de la route que visite l'utilisateur

- Par défaut les frameworks frontend moderne comme `Vue`, `Angular`, `React` & cie produisent des **SPA** (single page application), contrairement à l'ENT de l'ISEN par exemple. C'est à dire que dès qu'on clique sur un bouton de l'ENT, on envoie une requête HTTP au serveur qui fait sa tambouille et nous renvoie la page HTML complète. Avec une **SPA**, c'est le client qui va calculer le rendu de sa page dans le navigateur, et c'est le code javascript qui va donner les instructions. Ca autorise pas mal de chose, ça a aussi des inconvénients : [plus d'info ici](https://developer.mozilla.org/fr/docs/Glossary/SPA).

- [doc routeur](https://angular.dev/guide/routing/router-tutorial)

- Lazy loading:

  - Ca permet de charger **uniquement** le contenu que l'utilisateur visite, on charge pas toute l'application, juste ce dont il a besoin au fur et à mesure. C'est configurer et prêt à l'emploi.

  - Dans notre routeur module quand on a une route de prête on prépare le lazy loading comme ça:

```ts
// app-router.module.ts
// ...
export const routes: Routes = [
  { path: "", component: HomeComponent }, // pas lazy load car on a tjs besoin du home je suppose ....
  {
    path: "signin",
    loadChildren: async () => await import("@features/signin/signin.module").then((m) => m.SigninModule), // lazy load avec loadChildren
  },
  {
    path: "signup",
    loadChildren: async () => await import("@features/signup/signup.module").then((m) => m.SignupModule),
  },
  {
    path: "dashboard",
    loadChildren: async () => await import("@features/dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  { path: "**", redirectTo: "" },
];

// ----------------------------------------------------------
// ...
const route: Routes = [{ path: "", component: DashboardComponent }]; // On garde toujours le path:'' pour la racine du module...
// mais on peut en avoir plusieurs, exemple un module qui contient les fichiers y aurait peut être des routes plus profondes
// => http://localhost/monmodule
// => http://localhost/monmodule/item1
// => http://localhost/monmodule/item2 ...

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, RouterModule.forChild(route)], // On précise les enfants dans les imports
  exports: [DashboardComponent],
})
export class DashboardModule {}
```

## features/

- C'est là qu'on mets nos "vues / pages" appelez ça comme vous préferez :p

## Point d'entrée modifier

- Notre AppComponent n'est plus standalone on a un AppModule, dans lequel on importe le AppComponent et le fichier `main.ts` a été légèrement changé pour être adapté au démarrage sur un module et pas un standalone.

## Angular CLI

- Créer des composants par défaut avec [schematics](https://material.angular.io/guide/schematics)

```bash
# Avec plusieurs styles de composant go checker la doc
ng generate @angular/material:<composant> <component-name>
# exemple
ng generate @angular/material:navigation core/layout/header
```

```bash
# par défaut:
# ng g module blabla => src/app/blabla/blabla.module.ts
# ng g module blabla --flat => src/app/blabla.module.ts
# --flat ici permet de créer le module tel que: src/app/app.module.ts et pas avoir src/app/app/app.module.ts
# donc pour avoir notre module app à la racine de src/ on run:
ng g module app --flat
```

## shared/

- Composants standalone principalement, si on fait quelque chose de particulier qu'on souhaite réutiliser

## utils/

- fonctions utilitaires, formater une date etc ...

## Themes

- HORREURRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR

  - J'ai fait un exemple avec le header dans le module layout...

- Deux fichiers scss par composant
- [La doc (partie 1)](https://material.angular.io/guide/theming)
- [La doc (partie 2)](https://material.angular.io/guide/theming-your-components)

- [Material préconise de faire comme ça](https://material.angular.io/guide/theming#style-customization-outside-the-theming-system)

  - `_mystuff-theme.scss`: contient des [mixins](https://sass-lang.com/documentation/at-rules/mixin/) pour récupérer dynamiquement les valeurs du thème courant (couleurs, police etc...)

    - Pour les mixins il en faut 3 dans le fichier :D

```scss
@mixin color($t) {
  // Les couleurs spécifiques au thème (cf le header y a des exemples)
}

@mixin typography($t) {
  // Ici on change les polices spécifiques au thème
}

@mixin theme($t) {
  @if mat.theme-has($t, color) {
    @include color($t);
  }

  @if mat.theme-has($t, typography) {
    @include typography($t);
  }
}
```

- `mystuff.component.scss` : contient le scss classique, display flex mise en place layout du composant etc

- Ensuite, on va dans `main.scss` et on rajoute notre mixin :)

```scss
// ...
html {
  @include mat.all-component-themes($light-theme);
  @include appbar.theme($light-theme); // on appel notre mixin avec le thème courant

  &.dark {
    // ici on met que les couleurs pour pas avoir de warning à la con de duplication de style
    // j'invite les stylistes de l'équipe à lire la doc sur material il expliquent "bien" les 3 dimensions du thème
    @include mat.all-component-colors($dark-theme);
    @include appbar.theme($dark-theme); // on appel notre mixin avec le thème courant
  }
}
```

---

## A checker

https://www.digitalocean.com/community/tutorials/angular-change-detection-strategy

TLDR: JAMAIS de call fnc dans les boucles d'affichage et dans les templates non plus, pas de call fnc c la contrainte pr optimiser si g bien capté

[18/10/2024 09:48:22] Dimitri TEI: Un gros si tu met pas ça
[18/10/2024 09:48:38] Dimitri TEI: Tu bouge ta souris ta un composant ça déclenche un cycle
[18/10/2024 09:49:00] Dimitri TEI: Si ya un Call fonction dans le template et pas ça
[18/10/2024 09:49:08] Dimitri TEI: Tu retrigger la function
[18/10/2024 09:49:23] Dimitri TEI: Pour ça aussi jamais de Call function dans les template
[18/10/2024 09:49:35] Dimitri TEI: Pour boucler ou affiché

```ts
@Component({
changeDetection: ChangeDetectionStrategy.OnPush
})
```
