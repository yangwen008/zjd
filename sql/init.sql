create table if not exists regions (code varchar(12) primary key, name varchar(50) not null, parent_code varchar(12) references regions(code), level int check(level between 1 and 4), created_at timestamptz default now());
create type user_role as enum ('admin','gov','village','operator','renter');
create table if not exists profiles (id uuid references auth.users primary key, role user_role default 'renter', region_code varchar(12) references regions(code), real_name varchar(50), is_verified boolean default false, created_at timestamptz default now());
create table if not exists listings (id uuid default gen_random_uuid() primary key, creator_id uuid references profiles(id), region_code varchar(12) references regions(code), title varchar(100) not null, description text, video_url text, lease_years int check(lease_years<=20), price decimal(10,2), status varchar(20) default 'draft' check(status in ('draft','pending','published','rejected')), created_at timestamptz default now());
create table if not exists scraped_data (id uuid default gen_random_uuid() primary key, source_url text, title varchar(100), content text, matched_region_code varchar(12) references regions(code), status varchar(20) default 'pending', scraped_at timestamptz default now());

create or replace function handle_new_user() returns trigger as $$
begin insert into public.profiles (id, role, region_code, real_name) values (new.id, (new.raw_user_meta_data->>'role')::user_role, new.raw_user_meta_data->>'region_code', new.raw_user_meta_data->>'real_name'); return new; end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure handle_new_user();

alter table profiles enable row level security;
alter table listings enable row level security;
alter table scraped_data enable row level security;

create policy "profiles_self" on profiles for select using (auth.uid()=id);
create policy "listings_rw" on listings for all using (
  auth.jwt()->>'role'='admin' or
  (auth.jwt()->>'role'='gov' and region_code like '51%') or
  (auth.jwt()->>'role' in ('village','operator') and region_code=auth.jwt()->>'region_code') or
  (auth.jwt()->>'role'='renter' and status='published')
);
create policy "scraped_rw" on scraped_data for all using (auth.jwt()->>'role' in ('admin','gov'));

insert into regions (code,name,parent_code,level) values
('510000','四川省',null,1),('510100','成都市','510000',2),('510114','新都区','510100',3),
('510300','自贡市','510000',2),('510600','德阳市','510000',2),('510700','绵阳市','510000',2),
('510900','遂宁市','510000',2),('511000','内江市','510000',2),('511100','乐山市','510000',2),
('511300','南充市','510000',2),('511400','眉山市','510000',2),('511500','宜宾市','510000',2),
('513200','阿坝州','510000',2),('513300','甘孜州','510000',2),('513400','凉山州','510000',2);