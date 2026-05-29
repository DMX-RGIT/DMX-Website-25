import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars natively using Node 20+ feature
process.loadEnvFile(path.resolve(__dirname, '../.env.local'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const TEAM_DIR = path.join(process.cwd(), 'content', 'team');

async function migrate() {
  console.log('Starting team migration from JSON to Supabase...');
  
  try {
    const files = await fs.readdir(TEAM_DIR);
    const jsonFiles = files.filter(f => process.env.NODE_ENV ? f.endsWith('.json') : f.match(/^\d{4}\.json$/));

    for (const file of jsonFiles) {
      const year = file.replace('.json', '');
      const content = await fs.readFile(path.join(TEAM_DIR, file), 'utf8');
      const teamData = JSON.parse(content);
      
      console.log(`Processing cohort year ${year} (${teamData.length} members)...`);

      // We'll delete existing entries for this year
      await supabase.from('team_members').delete().eq('year', year);

      const insertData = teamData.map((m, rank) => ({
        year,
        name: m.name,
        position: m.position,
        image: m.image || null,
        linkedin: m.linkedin || null,
        github: m.github || null,
        sort_order: rank
      }));

      if (insertData.length > 0) {
        const { error } = await supabase.from('team_members').insert(insertData);
        if (error) throw error;
        console.log(`Successfully migrated ${year} data!`);
      }
    }
    
    console.log('Migration complete!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
