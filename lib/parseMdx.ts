import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface MdxContent {
  data: {
    [key: string]: any;
  };
  content: string;
}

export async function parseMdxFile(filePath: string): Promise<MdxContent> {
  try {
    const fullPath = path.join(process.cwd(), 'public', 'featured', filePath);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      data,
      content: content.trim()
    };
  } catch (error) {
    console.error(`Error parsing MDX file ${filePath}:`, error);
    throw error;
  }
}
