-- ====================================================================================
-- MIGRAÇÃO: Adicionar Nome Completo
-- Adiciona a coluna full_name na tabela de profiles para uso na Galeria
-- ====================================================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
