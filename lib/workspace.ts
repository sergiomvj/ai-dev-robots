import fs from 'fs'
import path from 'path'

const WORKSPACE = process.env.WORKSPACE_PATH || '/home/openclaw/workspace'

export const FOLDERS = ['Commands', 'Skills', 'Hooks', 'Scripts', 'Connectors', 'MCP', 'Logs'] as const
export type Folder = typeof FOLDERS[number]

export function listWorkspace(): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const folder of FOLDERS) {
    const dir = path.join(WORKSPACE, folder)
    if (fs.existsSync(dir)) {
      result[folder] = fs.readdirSync(dir).filter(f => !f.startsWith('.'))
    } else {
      result[folder] = []
    }
  }
  return result
}

export function readFile(folder: string, file: string): string | null {
  const filePath = path.join(WORKSPACE, folder, file)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf-8')
}

export function writeFile(folder: string, file: string, content: string): void {
  const dir = path.join(WORKSPACE, folder)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, file), content, 'utf-8')
}

export function deleteFile(folder: string, file: string): boolean {
  const filePath = path.join(WORKSPACE, folder, file)
  if (!fs.existsSync(filePath)) return false
  fs.unlinkSync(filePath)
  return true
}
