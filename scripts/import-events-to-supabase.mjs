import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof tags === 'string') {
    return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
}

function normalizeDate(input, slug) {
  const date = new Date(input || Date.now());
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date in event ${slug}: ${input}`);
  }
  return date.toISOString();
}

async function main() {
  const supabase = createClient(
    requiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requiredEnv('SUPABASE_SERVICE_ROLE_KEY')
  );

  const eventsDir = path.join(process.cwd(), 'public', 'images', 'event-files');
  const files = await fs.readdir(eventsDir);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  if (mdxFiles.length === 0) {
    console.log('No MDX event files found. Nothing to import.');
    return;
  }

  let importedCount = 0;

  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/, '');
    const filePath = path.join(eventsDir, file);
    const source = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(source);

    const payload = {
      slug,
      title: data.title || slug,
      description: data.description || '',
      content: content || '',
      cover_image_url: data.image || null,
      event_date: normalizeDate(data.date, slug),
      category: data.category || null,
      tags: normalizeTags(data.tags),
      is_published: data.published === false ? false : true,
    };

    const { error } = await supabase
      .from('events')
      .upsert(payload, { onConflict: 'slug' });

    if (error) {
      throw new Error(`Failed to import ${slug}: ${error.message}`);
    }

    importedCount += 1;
    console.log(`Imported: ${slug}`);
  }

  console.log(`Done. Imported ${importedCount} events into Supabase.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
