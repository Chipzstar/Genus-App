import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {codeInput} from '@sanity/code-input'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {colorInput} from '@sanity/color-input'

export default defineConfig({
  name: 'default',
  title: 'Genus',
  projectId: 'xkbqszda',
  dataset: 'production',
  plugins: [structureTool(), visionTool(), codeInput(), unsplashImageAsset(), colorInput()],
  schema: {
    types: schemaTypes,
  },
})
