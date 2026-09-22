alter table public.startup
  add column if not exists video_pitch_url text;

comment on column public.startup.video_pitch_url is
  'Optional YouTube URL for the startup pitch video.';
