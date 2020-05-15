#!/usr/bin/env node
import { join } from 'path'
import { readFileSync } from 'fs'
import cac from 'cac'

const cli = cac('sao')

cli
  .command('<generator> [outDir]', 'Run a generator')
  .action((generator, outDir, options) =>
    import('./cmd/main').then((res) => res.main(generator, outDir, options))
  )
  .option(
    '--npm-client <client>',
    `Use a specific npm client ('yarn' | 'npm' | 'pnpm')`
  )
  .option('-u, --update', 'Update cached generator')
  .option('-c, --clone', 'Clone repository instead of archive download')
  .option('-y, --yes', 'Use the default values for prompts')
  .option('--registry <registry>', 'Use a custom registry for package manager')
  .option(
    '--answers.* [value]',
    'Skip specific prompt and use provided answer directly'
  )
  .option('--debug', 'Show debug logs')

cli
  .command('set-alias <name> <value>', 'Set an alias for a generator path')
  .action((name, value) =>
    import('./cmd/set-alias').then((res) => res.setAlias(name, value))
  )

cli
  .command('get-alias <name>', 'Get the generator for an alias')
  .action((name) => import('./cmd/get-alias').then((res) => res.getAlias(name)))

const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))

cli.version(pkg.version)
cli.help()

cli.parse()
