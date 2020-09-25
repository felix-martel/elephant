# Éléphant

*Mémoires d'éléphant, un journal de bord pour le XXIème siècle*

Éléphant est une extension pour Chrome qui remplace la page *Nouvel onglet* par un éditeur de texte simple et léger. C'est, à mon avis, la meilleure solution 
pour garder un bloc-notes à portée de main, car elle évite d'utiliser une application dédiée. Éléphant fournit également un menu contextuel pour ajouter facilement
à vos notes un fragment de texte, un lien ou un site web. 

### Installation

Dans le menu Extensions de Chrome (`chrome://extensions`), avec le mode Développeur activé, choisir `Charger l'extension non-empaquetée` (ou `Load unpacked`)
et sélectionner le dossier `elephant/elephant`. Vous pouvez ajouter un raccourci clavier (par exemple `Ctrl+E`) pour ajouter automatiquement le texte sélectionné ou la page en cours;
pour cela, rendez-vous sur la page `chrome://extensions/shortcuts`.

### Développement

Vous devez avoir `node` et `npm` installé. Ensuite, clonez le présent repo et lancez :
```
npm install
```

Le *live-reloading* n'est pas accessible en l'état, puisqu'il s'agit d'une extension Chrome. Pour développer :
```
npm run chrome
```

Pour mettre en prod :
```
npm run build
```
