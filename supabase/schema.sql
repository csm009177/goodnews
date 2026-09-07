-- 1. 확장 모듈 활성화 (UUID 생성용)
create extension if not exists "uuid-ossp";

-- ==========================================
-- 2. 테이블 생성 (Schema)
-- ==========================================

-- [프로필] RBAC 역할 관리
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text,
  role text check (role in ('guest', 'user', 'part_leader', 'conductor', 'pastor', 'admin')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- [공지] 기관장 등록/Pin 기능
create table announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  is_pinned boolean default false,
  author_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- [일정] 달력/스트림 데이터
create table events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  color text default '#3b82f6', -- Tailwind blue-500
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- [찬송가] 찬송/내영의노래 데이터
create table hymns (
  id integer primary key, -- 찬송 번호
  title text not null,
  lyrics text not null,
  type text check (type in ('hymn', 'song')) default 'hymn' -- hymn: 찬송, song: 내영의노래
);

-- [합창] 출석 로그
create table choir_attendance (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  date date not null,
  check_in_time timestamp with time zone,
  check_out_time timestamp with time zone,
  unique(user_id, date) -- 하루 1회 출석 제한
);

-- [합창] 녹음 메타데이터 (R2 URL 저장)
create table recordings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  r2_url text not null,
  duration integer not null, -- 초 단위
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 3. RLS (Row Level Security) 정책
-- ==========================================

-- RLS 활성화
alter table profiles enable row level security;
alter table announcements enable row level security;
alter table events enable row level security;
alter table hymns enable row level security;
alter table choir_attendance enable row level security;
alter table recordings enable row level security;

-- [Profiles] 정책
create policy "프로필은 누구나 조회 가능" on profiles for select using (true);
create policy "본인 프로필만 수정 가능" on profiles for update using (auth.uid() = id);

-- [Announcements] 정책
create policy "공지는 누구나 조회 가능" on announcements for select using (true);
create policy "목사/관리자만 공지 등록 가능" on announcements for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role in ('pastor', 'admin'))
);
create policy "목사/관리자만 공지 수정 가능" on announcements for update using (
  exists (select 1 from profiles where id = auth.uid() and role in ('pastor', 'admin'))
);

-- [Events] 정책
create policy "일정은 누구나 조회 가능" on events for select using (true);
create policy "목사/관리자만 일정 관리 가능" on events for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('pastor', 'admin'))
);

-- [Hymns] 정책
create policy "찬송가는 누구나 조회 가능" on hymns for select using (true);

-- [Choir Attendance] 정책
create policy "출석 내역은 누구나 조회 가능" on choir_attendance for select using (true);
create policy "본인 출석만 등록 가능" on choir_attendance for insert with check (auth.uid() = user_id);

-- [Recordings] 정책
create policy "녹음 파일은 누구나 조회 가능" on recordings for select using (true);
create policy "본인 녹음만 등록 가능" on recordings for insert with check (auth.uid() = user_id);

-- ==========================================
-- 4. 자동 프로필 생성 트리거
-- ==========================================

-- 새 사용자 가입 시 profiles 테이블에 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();