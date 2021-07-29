# idg-homepage documentation

## Dev Environment setup
This dev environment assumes a Mac or Linux dev environment.
Please install nvm through homebrew on a Mac, (or follow the documentation [here](https://github.com/nvm-sh/nvm#installing-and-updating))

Next, install the latest version of Node:
```
nvm install --lts
```

Finally, install Vue CLI 3
```
npm install -g @vue/cli
```

## Project setup
Clone the project, cd into the directory, and follow the Project setup steps!

```
npm install
```

### Compiles and hot-reloads for development
loads using .env.development file for public env variables
```
npm run serve
```

### Compiles and minifies for production
builds using .env.production file for public env variables. Deployable files are stired in the dist/ folder. This script also builds the two web components for deployement on other websites. They are generated at dist/wc/
```
npm run build-production
```

# Installing the web components

## Location of files
the web component combiled code can be found after running `npm run build-production`. The web components are located in
`dist/wc/` after building.

## Web Component inclusion
You can include the scripts using a `<script>` tag in the head of your index.html document. This link can be either relative, or a link to reactome-idg's hosted version

### Linking relatively
```
<script src="/dist/wc/reactome-pathway-hierarchy.min.js">
<script src="/dist/wc/reactome-interactor-search.min.js">
```

### Linking to idg.reactome.org
```
<script src="https://idg.reactome.org/wc/reactome-pathway-hierarchy.min.js"></script>
<script src="https://idg.reactome.org/wc/reactome-interactor-search.min.js"></script>
```

### reactome-annotated-pathways
```
<reactome-pathway-hierarchy term="NTN1" darkmode="false"></reactome-pathway-hierarchy>
```

### reactome-interactor-search
```
<reactome-interactor-search term="NTN1" darkmode="false"></reactome-interactor-search>
```

# Other Notes

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# PLEASE NOTE
This project requires a back end server for the search functionality to work. This is currently under development and is not yet on github. Once available, a link will be provided here on how to set up that service.