-- Articles
create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text,
  importance int2 default 5,
  sentiment float4,
  source_names text[],
  source_urls text[],
  tags text[],
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Markets (internal + polymarket mirror)
create table markets (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references articles(id),
  question text not null,
  source text not null,
  polymarket_id text,
  category text,
  status text default 'open',
  resolution boolean,
  prob_yes float4 default 0.5,
  volume_pts int4 default 0,
  volume_usd float4,
  votes_yes int4 default 0,
  votes_no int4 default 0,
  closes_at timestamptz,
  created_at timestamptz default now()
);

-- Polymarket price history cache
create table pm_price_history (
  id uuid primary key default gen_random_uuid(),
  market_id uuid references markets(id),
  prob_yes float4,
  timestamp timestamptz
);

-- Indexes
create index on articles(published_at desc);
create index on articles(category);
create index on markets(status, closes_at);
create index on markets(source);
create index on markets(polymarket_id);
create index on pm_price_history(market_id);

-- RLS: read-only public access
alter table articles enable row level security;
alter table markets enable row level security;
alter table pm_price_history enable row level security;

create policy "Public read articles" on articles for select using (true);
create policy "Public read markets" on markets for select using (true);
create policy "Public read price history" on pm_price_history for select using (true);
