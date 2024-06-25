import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

function getGitTag() {
  try {
    const tag = execSync('git describe --tags --abbrev=0').toString().trim()
    return tag
  }
  catch (error) {
    console.error('Error getting git tag:', error)
    return 'unknown'
  }
}

const version = getGitTag()
writeFileSync('app-version.js', `export default '${version}'`)
