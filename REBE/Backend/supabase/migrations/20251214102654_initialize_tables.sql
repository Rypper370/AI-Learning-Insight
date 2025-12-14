create table public.users (
  id bigint not null,
  display_name character varying(255) null,
  name character varying(255) null,
  email character varying(255) null,
  password character varying(255) null,
  phone character varying(255) null,
  user_role integer null,
  user_verification_status integer null,
  remember_token text null,
  image_path text null,
  city text null,
  city_id character varying(255) null,
  custom_city character varying(255) null,
  unsubscribe_link text null,
  tz character varying(50) null,
  created_at timestamp without time zone null,
  updated_at timestamp without time zone null,
  deleted_at timestamp without time zone null,
  verified_at timestamp without time zone null,
  ama character varying(255) null,
  phone_verification_status character varying(255) null,
  phone_verified_with character varying(255) null,
  verified_certificate_name character varying(255) null,
  verified_identity_document character varying(255) null,
  level bigint null,
  xp bigint null,
  learning_style text null,
  learning_style_confidence double precision null,
  learning_style_updated_at timestamp with time zone null,
  constraint users_pkey primary key (id)
) TABLESPACE pg_default;

create table public.cities (
  id text not null,
  name text not null,
  type text null,
  province text null,
  created_at timestamp with time zone null default now(),
  constraint cities_pkey primary key (id)
) TABLESPACE pg_default;

create table public.developer_journeys (
  id bigint not null,
  name character varying(500) null,
  point integer null,
  required_point integer null,
  xp integer null,
  required_xp integer null,
  difficulty smallint null,
  status smallint null,
  listed smallint null,
  created_at text null,
  updated_at text null,
  platform_id integer null,
  instructor_id character varying(50) null,
  reviewer_id character varying(50) null,
  deadline integer null,
  trial_deadline smallint null,
  reviewer_incentive integer null,
  type smallint null,
  discount integer null,
  discount_ends_at text null,
  installment_plan_id integer null,
  graduation integer null,
  position integer null,
  hours_to_study integer null,
  constraint developer_journeys_pkey primary key (id)
) TABLESPACE pg_default;

create table public.developer_journey_tutorials (
  id bigint not null,
  developer_journey_id bigint null,
  title character varying(255) not null,
  type character varying(50) not null,
  content text null,
  requirements text null,
  submit_only_requirements smallint null default 0,
  position integer not null,
  status smallint null default 1,
  trial smallint null default 0,
  author_id bigint null,
  is_main_module smallint null default 0,
  constraint developer_journey_tutorials_pkey primary key (id),
  constraint fk_author foreign KEY (author_id) references users (id) not VALID,
  constraint fk_journey foreign KEY (developer_journey_id) references developer_journeys (id) not VALID,
  constraint developer_journey_tutorials_type_check check (
    (
      (type)::text = any (
        (
          array[
            'article'::character varying,
            'exam'::character varying,
            'interactivecode'::character varying,
            'interactivevideo'::character varying,
            'multiple'::character varying,
            'quiz'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint developer_journey_tutorials_trial_check check ((trial = any (array[0, 1]))),
  constraint developer_journey_tutorials_submit_only_requirements_check check ((submit_only_requirements = any (array[0, 1]))),
  constraint developer_journey_tutorials_is_main_module_check check ((is_main_module = any (array[0, 1])))
) TABLESPACE pg_default;

create table public.developer_journey_trackings (
  id bigserial not null,
  journey_id bigint null,
  tutorial_id bigint null,
  developer_id bigint null,
  status smallint not null default 0,
  last_viewed character varying(50) null,
  first_opened_at character varying(50) null,
  completed_at character varying(50) null,
  developer_journey_status_hash character(10) null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint developer_journey_trackings_pkey primary key (id),
  constraint fk_tracking_developer foreign KEY (developer_id) references users (id) not VALID,
  constraint fk_tracking_journey foreign KEY (journey_id) references developer_journeys (id) not VALID,
  constraint fk_tracking_tutorial foreign KEY (tutorial_id) references developer_journey_tutorials (id) not VALID
) TABLESPACE pg_default;

create index IF not exists idx_trackings_developer on public.developer_journey_trackings using btree (developer_id) TABLESPACE pg_default;

create index IF not exists idx_trackings_journey on public.developer_journey_trackings using btree (journey_id) TABLESPACE pg_default;

create index IF not exists idx_trackings_tutorial on public.developer_journey_trackings using btree (tutorial_id) TABLESPACE pg_default;

create table public.developer_journey_submissions (
  id bigint not null,
  journey_id bigint null,
  quiz_id bigint null,
  submitter_id bigint null,
  version_id bigint null,
  app_link character varying(500) null,
  app_comment text null,
  status character varying(50) not null,
  as_trial_subscriber smallint null default 0,
  created_at character varying(50) null,
  updated_at character varying(50) null,
  admin_comment text null,
  reviewer_id bigint null,
  current_reviewer character varying(255) null,
  started_review_at character varying(50) null,
  ended_review_at character varying(50) null,
  rating smallint null,
  note text null,
  first_opened_at character varying(50) null,
  submission_duration character varying(50) null,
  pass_auto_checker smallint null default 0,
  constraint developer_journey_submissions_pkey primary key (id),
  constraint fk_submissions_journey foreign KEY (journey_id) references developer_journeys (id) on delete CASCADE not VALID,
  constraint fk_submissions_quiz foreign KEY (quiz_id) references developer_journey_tutorials (id) on delete set null not VALID,
  constraint fk_submissions_submitter foreign KEY (submitter_id) references users (id) on delete CASCADE not VALID
) TABLESPACE pg_default;

create index IF not exists idx_submissions_submitter on public.developer_journey_submissions using btree (submitter_id) TABLESPACE pg_default;

create index IF not exists idx_submissions_journey on public.developer_journey_submissions using btree (journey_id) TABLESPACE pg_default;

create index IF not exists idx_submissions_status on public.developer_journey_submissions using btree (status) TABLESPACE pg_default;

create table public.developer_journey_completions (
  id bigserial not null,
  user_id bigint not null,
  journey_id bigint not null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  enrolling_times integer null default 1,
  enrollments_at json null,
  last_enrolled_at timestamp without time zone null default CURRENT_TIMESTAMP,
  study_duration integer null default 0,
  avg_submission_rating numeric(4, 2) null,
  constraint developer_journey_completions_pkey primary key (id),
  constraint fk_completion_journey foreign KEY (journey_id) references developer_journeys (id) not VALID,
  constraint fk_completion_user foreign KEY (user_id) references users (id) not VALID
) TABLESPACE pg_default;

create index IF not exists idx_completion_user on public.developer_journey_completions using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_completion_journey on public.developer_journey_completions using btree (journey_id) TABLESPACE pg_default;

create table public.user_learning_predictions (
  id bigint generated by default as identity not null,
  created_at timestamp with time zone not null default now(),
  total_submissions bigint null,
  user_id bigint null,
  avg_submission_rating double precision null,
  avg_exam_score double precision null,
  total_journeys_completed bigint null,
  avg_speed_ratio double precision null,
  total_exams_passed bigint null,
  cluster smallint null,
  learning_style text null,
  confidence real null,
  normalized_features jsonb null,
  distance_to_centroid double precision null,
  updated_at timestamp with time zone null,
  constraint raw_data_for_inference_pkey primary key (id),
  constraint raw_data_for_inference_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create table public.users_level_tracker (
  id bigint generated by default as identity not null,
  user_id bigint not null,
  exp_amount bigint not null,
  dev_journey_completion_id bigint null,
  timestamp timestamp with time zone null,
  level bigint null,
  constraint users_level_tracker_pkey primary key (id),
  constraint users_level_tracker_dev_journey_completion_id_fkey foreign KEY (dev_journey_completion_id) references developer_journey_completions (id),
  constraint users_level_tracker_user_id_fkey foreign KEY (user_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

