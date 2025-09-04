import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
// import {visionTool} from '@sanity/vision' // optionnel

export default defineConfig({
  name: 'becycure-studio',
  title: 'BECYCURE Studio',
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',
  plugins: [deskTool()], // , visionTool()
})
