import { execSync } from 'child_process'

try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('Frontend built')
} catch (e) {
  console.error('Build failed', e)
  process.exit(1)
}