import pg from 'pg';

// Utiliza a variável SUPABASE_DATABASE_URL ou a local (para fallback)
const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️  AVISO: Nenhuma URL de banco de dados fornecida. Configurando pool vazio... O Backend falhará se tentar consultar o banco sem a URL da Supabase no .env.');
}

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString && connectionString.includes('supabase') ? { rejectUnauthorized: false } : false
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
