import { supabase } from '../supabase';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'src/lib/supabase/schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split the SQL into individual statements
    const statements = sql.split(';').filter(statement => statement.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error('Error executing SQL:', error);
        } else {
          console.log('Successfully executed SQL statement');
        }
      }
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run the setup
setupDatabase(); 