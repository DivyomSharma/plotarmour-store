create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  collection text not null,
  statement text not null,
  description text not null,
  price integer not null,
  currency text not null default 'INR',
  accent text not null default '#FF2A2A',
  garment_type text not null,
  sizes text[] not null default '{}',
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.try_on_results (
  id uuid primary key default gen_random_uuid(),
  cache_key text unique not null,
  product_image_url text not null,
  garment_type text not null,
  source_url text,
  result_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text unique not null,
  razorpay_payment_id text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
