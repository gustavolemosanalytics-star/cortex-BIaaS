-- =========================================
-- Cortex Platform - Database Schema
-- Execute this SQL in Supabase SQL Editor
-- =========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- NextAuth.js Tables
-- =========================================

CREATE TABLE IF NOT EXISTS cortex_accounts (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  CONSTRAINT accounts_provider_providerAccountId_key UNIQUE (provider, "providerAccountId")
);

CREATE INDEX IF NOT EXISTS accounts_userId_idx ON cortex_accounts("userId");

CREATE TABLE IF NOT EXISTS cortex_sessions (
  id TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_userId_idx ON cortex_sessions("userId");

CREATE TABLE IF NOT EXISTS cortex_users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  password TEXT,
  "isDeveloper" BOOLEAN DEFAULT false NOT NULL,
  "stripeAccountId" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS cortex_verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  CONSTRAINT verification_tokens_identifier_token_key UNIQUE (identifier, token)
);

-- =========================================
-- Application Tables
-- =========================================

CREATE TABLE IF NOT EXISTS cortex_dashboards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  "isPublished" BOOLEAN DEFAULT false NOT NULL,
  "isPublic" BOOLEAN DEFAULT false NOT NULL,
  password TEXT,
  "expiresAt" TIMESTAMPTZ,
  template TEXT,
  layout JSONB DEFAULT '{}' NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS dashboards_userId_idx ON cortex_dashboards("userId");
CREATE INDEX IF NOT EXISTS dashboards_slug_idx ON cortex_dashboards(slug);

CREATE TABLE IF NOT EXISTS cortex_widgets (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  config JSONB DEFAULT '{}' NOT NULL,
  position JSONB DEFAULT '{}' NOT NULL,
  "dashboardId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS widgets_dashboardId_idx ON cortex_widgets("dashboardId");

CREATE TABLE IF NOT EXISTS cortex_integrations (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "refreshToken" TEXT,
  "expiresAt" TIMESTAMPTZ,
  "accountId" TEXT,
  "accountName" TEXT,
  metadata JSONB DEFAULT '{}' NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT integrations_userId_platform_accountId_key UNIQUE ("userId", platform, "accountId")
);

CREATE INDEX IF NOT EXISTS integrations_userId_idx ON cortex_integrations("userId");

CREATE TABLE IF NOT EXISTS cortex_data_cache (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  platform TEXT NOT NULL,
  metric TEXT NOT NULL,
  "dateRange" TEXT NOT NULL,
  data JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS data_cache_userId_platform_metric_idx ON cortex_data_cache("userId", platform, metric);
CREATE INDEX IF NOT EXISTS data_cache_expiresAt_idx ON cortex_data_cache("expiresAt");

-- =========================================
-- Template Marketplace Tables
-- =========================================

CREATE TABLE IF NOT EXISTS cortex_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  "isFree" BOOLEAN DEFAULT false NOT NULL,
  "isPublished" BOOLEAN DEFAULT false NOT NULL,
  "isFeatured" BOOLEAN DEFAULT false NOT NULL,
  code JSONB NOT NULL,
  version TEXT DEFAULT '1.0.0' NOT NULL,
  downloads INTEGER DEFAULT 0 NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0 NOT NULL,
  "reviewCount" INTEGER DEFAULT 0 NOT NULL,
  "platformFee" DECIMAL(5, 2) DEFAULT 30 NOT NULL,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS templates_authorId_idx ON cortex_templates("authorId");
CREATE INDEX IF NOT EXISTS templates_slug_idx ON cortex_templates(slug);
CREATE INDEX IF NOT EXISTS templates_category_idx ON cortex_templates(category);
CREATE INDEX IF NOT EXISTS templates_isPublished_isFeatured_idx ON cortex_templates("isPublished", "isFeatured");

CREATE TABLE IF NOT EXISTS cortex_template_purchases (
  id TEXT PRIMARY KEY,
  "templateId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  "platformFee" DECIMAL(10, 2) NOT NULL,
  "authorEarnings" DECIMAL(10, 2) NOT NULL,
  "paymentId" TEXT,
  "paymentStatus" TEXT DEFAULT 'pending' NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT template_purchases_templateId_userId_key UNIQUE ("templateId", "userId")
);

CREATE INDEX IF NOT EXISTS template_purchases_userId_idx ON cortex_template_purchases("userId");
CREATE INDEX IF NOT EXISTS template_purchases_templateId_idx ON cortex_template_purchases("templateId");

CREATE TABLE IF NOT EXISTS cortex_template_reviews (
  id TEXT PRIMARY KEY,
  "templateId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT template_reviews_templateId_userId_key UNIQUE ("templateId", "userId")
);

CREATE INDEX IF NOT EXISTS template_reviews_templateId_idx ON cortex_template_reviews("templateId");
CREATE INDEX IF NOT EXISTS template_reviews_userId_idx ON cortex_template_reviews("userId");

-- =========================================
-- Foreign Keys
-- =========================================

ALTER TABLE cortex_accounts ADD CONSTRAINT accounts_userId_fkey
  FOREIGN KEY ("userId") REFERENCES cortex_users(id) ON DELETE CASCADE;

ALTER TABLE cortex_sessions ADD CONSTRAINT sessions_userId_fkey
  FOREIGN KEY ("userId") REFERENCES cortex_users(id) ON DELETE CASCADE;

ALTER TABLE cortex_dashboards ADD CONSTRAINT dashboards_userId_fkey
  FOREIGN KEY ("userId") REFERENCES cortex_users(id) ON DELETE CASCADE;

ALTER TABLE cortex_widgets ADD CONSTRAINT widgets_dashboardId_fkey
  FOREIGN KEY ("dashboardId") REFERENCES cortex_dashboards(id) ON DELETE CASCADE;

ALTER TABLE cortex_integrations ADD CONSTRAINT integrations_userId_fkey
  FOREIGN KEY ("userId") REFERENCES cortex_users(id) ON DELETE CASCADE;

ALTER TABLE cortex_templates ADD CONSTRAINT templates_authorId_fkey
  FOREIGN KEY ("authorId") REFERENCES cortex_users(id) ON DELETE CASCADE;

ALTER TABLE cortex_template_purchases ADD CONSTRAINT template_purchases_templateId_fkey
  FOREIGN KEY ("templateId") REFERENCES cortex_templates(id) ON DELETE CASCADE;

ALTER TABLE cortex_template_purchases ADD CONSTRAINT template_purchases_userId_fkey
  FOREIGN KEY ("userId") REFERENCES cortex_users(id) ON DELETE CASCADE;

ALTER TABLE cortex_template_reviews ADD CONSTRAINT template_reviews_templateId_fkey
  FOREIGN KEY ("templateId") REFERENCES cortex_templates(id) ON DELETE CASCADE;

ALTER TABLE cortex_template_reviews ADD CONSTRAINT template_reviews_userId_fkey
  FOREIGN KEY ("userId") REFERENCES cortex_users(id) ON DELETE CASCADE;

-- =========================================
-- Success Message
-- =========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Cortex Platform schema created successfully!';
  RAISE NOTICE 'All tables have been created with the cortex_ prefix.';
END $$;
