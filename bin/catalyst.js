#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { execSync } = require('child_process')
const { prompt } = require('inquirer')
const { getFiles } = require('./utils.js')

const cwd = process.cwd()
const srcDir = path.join(cwd, 'src')
const componentsDir = path.join(srcDir, 'components')
const pagesDir = path.join(srcDir, 'pages')
const helpersDir = path.join(srcDir, 'helpers')

// creates a react application using create-react-app
// removes the default files and folders
// uninstall unnecessary dependencies
// creates the src folder
// creates the components, pages and helpers folders
// creates the index.js file

const init = ({ useRealm, useAuth }) => {
  if (useAuth && !useRealm) {
    console.log(chalk.red('You must use realm to use auth'))
    return
  }
  
  console.log(chalk.blue('Initializing a new catalyst project...'))

  // create the react app
  execSync('npx create-react-app .')

  // remove the default files and folders
  fs.unlinkSync(path.join(cwd, 'src', 'App.css'))
  fs.unlinkSync(path.join(cwd, 'src', 'App.js'))
  fs.unlinkSync(path.join(cwd, 'src', 'App.test.js'))
  fs.unlinkSync(path.join(cwd, 'src', 'index.css'))
  fs.unlinkSync(path.join(cwd, 'src', 'logo.svg'))
  fs.rmdirSync(path.join(cwd, 'src', 'setupTests.js'))
  fs.rmdirSync(path.join(cwd, 'public'))

  // uninstall unnecessary dependencies
  execSync('npm uninstall web-vitals')
  execSync('npm uninstall @testing-library/jest-dom')
  execSync('npm uninstall @testing-library/react')
  execSync('npm uninstall @testing-library/user-event')

  // create the src folder
  fs.mkdirSync(srcDir)

  // create the components, pages and helpers folders
  fs.mkdirSync(componentsDir)
  fs.mkdirSync(pagesDir)
  fs.mkdirSync(helpersDir)

  // create the index.js file
  fs.writeFileSync(path.join(srcDir, 'index.js'), `
  import { init } from 'catalyst'

  import theme from './theme.json'
  
  init({
    ${useRealm ? 'useRealm: true, ' : ''}
    ${useAuth ? 'auth: {}, ' : ''}
    theme,
    pages: {
      // add your pages here
    },
    contexts: {
      // add your contexts here
    }
  })
  `)
}

// creates a new component, page, context or helper
const create = async (type, name) => {
  const types = ['component', 'page', 'context', 'helper']
  if (!types.includes(type)) {
    console.log(chalk.red(`Invalid type: ${type}`))
    return
  }

  if (!name) {
    const { name: nameInput } = await prompt({
      type: 'input',
      name: 'name',
      message: `Enter the name of the ${type}:`
    })
    name = nameInput
  }

  const dir = type === 'component' ? componentsDir : type === 'page' ? pagesDir : helpersDir
  const files = getFiles(dir)

  if (files.includes(name)) {
    console.log(chalk.red(`A ${type} with the name ${name} already exists`))
    return
  }

  // create the file
  fs.writeFileSync(path.join(dir, `${name}.js`), TEMPLATES[type](name))
}

const TEMPLATES = {
  component: name => `
import React from 'react'

export default function ${name} () {
  return <div>
    ${name}
  </div>
}
`,
  page: name => `
import React from 'react'

export default function ${name} () {
  return <div>
    ${name}
  </div>
}
`,
  context: name => `
import Context from 'catalyst/context'

export default const ${name} = new Context(async () => {
  // load your data here
  return undefined
  }, {
    // add your methods here
  })
`,
  helper: name => `
export default function ${name} () {
  // add your code here
}
`
}

caporal
  .version('0.0.1')
  .command('init', 'Initialize a new catalyst project')
  .option('--use-realm', 'Use realm for data persistence')
  .action(init)
  .command('create', 'Create a new component, page, context or helper')
  .argument('<type>', 'The type of file to create')
  .argument('[name]', 'The name of the file to create')
  .action(create)
  .command('start', 'Start the development server')
  .action(() => {
    execSync('npx react-scripts start', { stdio: 'inherit' })
  })
  .command('build', 'Build the project for production')
  .action(() => {
    execSync('npx react-scripts build', { stdio: 'inherit' })
  })
  .command('test', 'Run the tests')
  .action(() => {
    execSync('npx react-scripts test', { stdio: 'inherit' })
  })
  .command('eject', 'Eject the project from catalyst')
  .action(() => {
    execSync('npx react-scripts eject', { stdio: 'inherit' })
  })

caporal.parse(process.argv)