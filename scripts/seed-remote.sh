#!/bin/bash

# Script para ejecutar seeds en la base de datos remota de Supabase
# Uso: ./scripts/seed-remote.sh

echo "🌱 Ejecutando seeds en la base de datos remota..."

# Deshabilitar RLS temporalmente para talentos_sub_18
echo "Deshabilitando RLS para talentos_sub_18..."
supabase db execute --file supabase/seed_talentos_sub_18.sql --db-url "$(supabase status --output json | jq -r '.DB_URL')" 2>/dev/null || \
supabase db execute "ALTER TABLE public.talentos_sub_18 DISABLE ROW LEVEL SECURITY;" && \
supabase db execute --file supabase/seed_talentos_sub_18.sql && \
supabase db execute "ALTER TABLE public.talentos_sub_18 ENABLE ROW LEVEL SECURITY;"

echo "✅ Seeds ejecutados correctamente!"



