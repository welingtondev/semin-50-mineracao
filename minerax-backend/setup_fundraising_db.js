import pg from 'pg';

const connectionString = 'postgresql://postgres.ttodiljwugmujrwcfuwp:welingtonnasceuemsalvador@aws-1-us-east-2.pooler.supabase.com:6543/postgres';

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function setup() {
  try {
    console.log("Criando tabela fundraising...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fundraising (
        id INT PRIMARY KEY,
        donations NUMERIC NOT NULL DEFAULT 0,
        sponsorships NUMERIC NOT NULL DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    console.log("Inserindo valores iniciais...");
    await pool.query(`
      INSERT INTO fundraising (id, donations, sponsorships) 
      VALUES (1, 0, 0)
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Habilitando RLS (para leitura pública)...");
    await pool.query(`
      ALTER TABLE fundraising ENABLE ROW LEVEL SECURITY;
      
      -- Permitir leitura pública
      DROP POLICY IF EXISTS "Public select on fundraising" ON fundraising;
      CREATE POLICY "Public select on fundraising" ON fundraising FOR SELECT USING (true);
      
      -- Permitir update anônimo (pois o AdminGallery usa anon key)
      DROP POLICY IF EXISTS "Anon update on fundraising" ON fundraising;
      CREATE POLICY "Anon update on fundraising" ON fundraising FOR UPDATE USING (true);
    `);
    
    console.log("Concluído!");
    process.exit(0);
  } catch (e) {
    console.error("Erro:", e);
    process.exit(1);
  }
}

setup();
