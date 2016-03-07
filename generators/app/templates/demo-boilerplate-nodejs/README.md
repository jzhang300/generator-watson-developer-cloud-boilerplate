# About this project

This is a base template for Watson Service Demos on NodeJS.  The template uses Gulp, Browsersync, Nodemon, Sass, auto-generated Icon Fonts, JS compiling, and such and also incorporates the [Watson Design Guide](https://github.com/IBM-Watson/design-guide).

This documentation describes the workflow to develop with this template.

Contacts for the development of this template:

* James Zhang - [Bluepages](http://faces.tap.ibm.com/bluepages/profile.html?email=jzhang300@us.ibm.com) - jzhang300@us.ibm.com
* Eva Luo - [Bluepages](http://faces.tap.ibm.com/bluepages/profile.html?email=evaluo_xhl@us.ibm.com) - evaluo_xhl@us.ibm.com
* German Attanasio Ruiz - [Bluepages](http://faces.tap.ibm.com/bluepages/profile.html?email=germanatt@us.ibm.com) - germanatt@us.ibm.com

# Developing in this project

## Getting Started

1. Make sure you have installed Node v0.12.*, for reduced risk of complications.

2. Install Gulp globally on your machine

    ```
    $ npm install -g gulp
    ```

3. Install project dependencies

    ```
    $ npm install 
    ```

4. Start development server

    ```
    $ gulp
    ```
    
    Leave gulp running while you code.  If Gulp runs smoothly, you should see [http://localhost:5000](http://localhost:5000) open in a browser.  You can learn more information on [Gulp](http://gulpjs.com/).
    
    In this application, Gulp will watch for any changes you make to source files and will compile the necessary files accordingly and refresh the application running in the browser.  You can learn more about how this works in the `GulpFile.js` file.

5. Build Project for deploy

    ```
    $ gulp build
    ```

    When you're ready to deploy a demo, run `gulp build`.  For more information, take a look at the [gulp build](#-gulp-build) documentation;

## File structure

High level project structure

```
app.js                  # Main Node application script

GulpFile.js             # Development mode script

.env.js                 # Environment variables for development

.gitignore              # .gitignore for development
.gitignore_github       # .gitignore for github build

README.md               # README for development
README_github.md        # README for github build

config/                 # Additional Node scripts
| - ...

public/
| - css/                # Output styles
| - data/               # Data files for demo purposes
| - fonts/
| - | - icon-fonts/     # Output Icon Fonts
| - images/
| - | - icons/          # Source SVG Icons for Icon Fonts
| - js/                 # Source js
| - scss/               # Source styles
| - views/              # Views for view engine

dist/
| - github/             # Build for Github
```

## SCSS Styles
```
public/
| - css/            # Output styles
...
| - scss/           # Source styles
| - | - components/     # Project's Components
| - | - layouts/        # Project's Layout Styles
| - | - patterns/       # Project's Patterns
| - | - | - base/
| - | - | - components/
| - | - | - core/
| - | - | - layouts/
| - | - | - _watson-service-demo-patterns.scss  # pattern's main script
| - | - vendors/        # 3rd party scss
| - | - style.scss      # The main scss script
```

The Sass organization is based on the [Watson Design Guide](https://github.com/IBM-Watson/design-guide) framework of building reusable styles and components.  The SCSS folders are organized in groups of hierarchies based on the [Atomic Design methodology](http://patternlab.io/about.html).

This project also expects you to use the [BEM](https://en.bem.info/) style convention and [Breakpoint-Sass](http://breakpoint-sass.com/) for grids.

### `public/scss/patterns/`

This directory contains modularized reusable patterns, whose purpose is to develop more efficiently and improve the consistency of UI across many projects.

### `public/scss/patterns/base/`

This directory contains all the styling for just basic html elements.
These are the [atoms](http://patternlab.io/about.html#atoms) in Atomic Design.

### `public/scss/patterns/components/`

This directory contains styles for components, which are groupings of multiple elements from `base/`.  Examples of these are Form fields and navbars.  Nearly all the responsive logic should be handled at this level.
These are the [molecules](http://patternlab.io/about.html#molecules) and [organisms](http://patternlab.io/about.html#organisms) in Atomic Design.

### `public/scss/patterns/layouts/`

This directory contains styles for entire page layouts, which are groupings of components from `components/`.  This level is focused almost entirely on the positioning of the components.
These are the [templates](http://patternlab.io/about.html#templates) in Atomic Design.

### `public/scss/patterns/core/`

This directory contains all the SCSS variables, mixins, extends, functions, settings, etc. that can be used throughout the other `public/patterns` directories.  These are all just helper functions and logic that don't actually produce any compiled output.

### `public/scss/components/`

These are this app's styles for components.

### `public/scss/layouts/`

These are this app's styles for layouts.

## JS Scripts
```
public/
| - js/             # Source JS
| - | - components/ # JS counterparts of scss/components
| - | - vendors/    # Additional 3rd Party JS
| - | - demo.js     # The main executable
```

`demo.js` is the main JS file.
`components/*.js` are other JS components you write.
`vendors/*.js` are other 3rd party JS scripts you want to include.

## Icon Fonts
```
public/
| - fonts/
| - | - icon-fonts/     # Auto-generated icon font files
...
| - images/
| - | - icons/          # Source icons
...
| - scss/
| - | - patterns/
| - | - | - core/
| - | - | - | - fonts/
| - | - | - | - | - _icon-fonts.scss    # Auto-generated icon font scss
| - | - | - | - | - _icon.scss          # Additional styling for icon fonts for project
```

In this project, Icon Fonts are dynamically generated based on the SVG icons you want to use in `public/images/icons/`.  However, not all svg icons can be rendered properly, only certain SVG elements are rendered properly, so you may need to clean up the SVG.

Example usage in html:
```
<p><span class="icon icon-{icon name}"></span> Hello World</p>

<button><i class="icon icon-back"></i> Back</button>
<button><i class="icon icon-Github"></i> Github</button>
```

### `public/images/icons/`
This is a directory full of svg images that can be compiled to icon fonts.

### `public/fonts/icon-fonts/`
This directory compiles the icons in `public/images/icon-fonts` to the four web icon font files.

### `public/scss/patterns/core/fonts/_icon-fonts.scss`
This is the scss styles to be able to call upon the icon-fonts via html classes

### `public/scss/patterns/core/fonts/_icon.scss`
This is for additional styling you want to add to the icon fonts.

## Views
```
public/
| - views/
| - | - index.ejs       # Main application template
```

By default the template uses EJS, but other view engines like Jade are fine too.

## .env.js

Using the `.env.js` will let you keep hardcoded service credentials during development of the demo but still have the app's service credentials remain anonymous when it's published.

To use service APIs, update the service id name and update the service credentials.

An example `.env.js` could look like this:
```
'use strict';

module.exports = {
  VCAP_SERVICES: JSON.stringify({
    visual_insights: [{
      credentials: {
        url: 'https://gateway.watsonplatform.net/visual-insights-experimental/api',
        username: 'a97c635a-bf7d-4e84-b5c8-e901c68f1400',
        password: 'kmd1m1sABLOm'
      }
    }]
  }),
  VCAP_APP_PORT: 3000
};
```

## .gitignore
`.gitignore` is the internal development `.gitignore`.  When `gulp build` is run, `.gitignore_demo` and `.gitignore_github` will become `.gitignore` in their respective builds.

To learn more about `.gitignore`'s in general, check out http://git-scm.com/docs/gitignore.

# Deploying the App for Public Consumption

Once the application is at a good place, you can run the `$ gulp build` command.  This command will export the current project to the `build/` directory and remove any source files and development dependencies.

The `github/` build is focused on making it easy for developers outside of IBM to try out our services and understand how the Watson APIs are developed in applications.  The `demo/` build is focused more on performance.

**The quality of the code we deliver is important.  This code will be used and forked by other devs for startups, hackathons, and various projects**.

# Gulp Commands

### `$ gulp`

Runs development server and watches for changes to any source file.

### `$ gulp build`

Generates the production build to the `dist/` directory.  This build will be deployed to our [Watson-Developer-Cloud Git Repo](https://github.com/watson-developer-cloud/) so that other developers can look at examples for how to use our APIs in an application.  The build code will also be used to deploy to Bluemix as a demo application for potential clients to see (i.e. https://concept-insights-demo.mybluemix.net/)