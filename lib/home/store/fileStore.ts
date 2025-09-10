import { promises as fs } from 'fs';
import path from 'path';
import { HomeDoc } from '../types';

// Base directory for storing home documents
const STORE_DIR = path.join(process.cwd(), 'ai_store', 'homes');

/**
 * Ensures the store directory exists
 */
async function ensureStoreDir() {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create store directory:', err);
  }
}

/**
 * Gets the file path for a home document
 */
function getFilePath(id: string): string {
  return path.join(STORE_DIR, `${id}.json`);
}

/**
 * Retrieves a home document by ID
 * If the document doesn't exist, returns a default document
 */
export async function getHomeDoc(id: string): Promise<HomeDoc> {
  await ensureStoreDir();
  const filePath = getFilePath(id);
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as HomeDoc;
  } catch (err) {
    // If file doesn't exist, return a default document
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return {
        id,
        layoutVersion: 1,
        widgets: []
      };
    }
    console.error(`Error reading home doc ${id}:`, err);
    throw err;
  }
}

/**
 * Saves a home document
 */
export async function saveHomeDoc(doc: HomeDoc): Promise<void> {
  await ensureStoreDir();
  const filePath = getFilePath(doc.id);
  
  try {
    // Add timestamps
    const now = new Date().toISOString();
    const docWithTimestamps = {
      ...doc,
      updatedAt: now,
      createdAt: (doc as any).createdAt || now
    };
    
    await fs.writeFile(filePath, JSON.stringify(docWithTimestamps, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving home doc ${doc.id}:`, err);
    throw err;
  }
}

/**
 * Lists all home documents
 */
export async function listHomeDocs(): Promise<string[]> {
  await ensureStoreDir();
  
  try {
    const files = await fs.readdir(STORE_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => path.basename(file, '.json'));
  } catch (err) {
    console.error('Error listing home docs:', err);
    return [];
  }
}

/**
 * Deletes a home document
 */
export async function deleteHomeDoc(id: string): Promise<boolean> {
  const filePath = getFilePath(id);
  
  try {
    await fs.unlink(filePath);
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return false; // File doesn't exist
    }
    console.error(`Error deleting home doc ${id}:`, err);
    throw err;
  }
}
