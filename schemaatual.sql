-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  actor_id uuid,
  action character varying,
  entity_type character varying,
  entity_id uuid,
  metadata jsonb,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id)
);
CREATE TABLE public.agent_performance_metrics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  agent_id character varying,
  execution_id uuid,
  success boolean,
  execution_time_ms integer,
  retry_count integer,
  used_contingency boolean,
  security_score integer,
  assertiveness_score integer,
  learning_score integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT agent_performance_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT agent_performance_metrics_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id),
  CONSTRAINT agent_performance_metrics_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.executions(id)
);
CREATE TABLE public.agent_snapshots (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  agent_id character varying,
  soul_hash character varying,
  system_hash character varying,
  memory_hash character varying,
  tasks_hash character varying,
  context_hash character varying,
  heartbeat_hash character varying,
  storage_url text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT agent_snapshots_pkey PRIMARY KEY (id),
  CONSTRAINT agent_snapshots_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id)
);
CREATE TABLE public.agents (
  id character varying NOT NULL,
  domain character varying,
  autonomy_level integer DEFAULT 0,
  risk_profile character varying,
  performance_score integer DEFAULT 0,
  memory_hash character varying,
  last_snapshot timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT agents_pkey PRIMARY KEY (id)
);
CREATE TABLE public.decisions_log (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  issue_id uuid,
  execution_id uuid,
  agent_id character varying,
  decision_type character varying,
  decision_summary text,
  confidence_score integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT decisions_log_pkey PRIMARY KEY (id),
  CONSTRAINT decisions_log_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id),
  CONSTRAINT decisions_log_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.executions(id)
);
CREATE TABLE public.execution_steps (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  execution_id uuid,
  step_name character varying,
  status character varying,
  output jsonb,
  started_at timestamp without time zone,
  finished_at timestamp without time zone,
  CONSTRAINT execution_steps_pkey PRIMARY KEY (id),
  CONSTRAINT execution_steps_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.executions(id)
);
CREATE TABLE public.executions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  issue_id uuid,
  plan_id uuid,
  status USER-DEFINED DEFAULT 'queued'::execution_status,
  idempotency_key character varying NOT NULL UNIQUE,
  retry_count integer DEFAULT 0,
  started_at timestamp without time zone,
  finished_at timestamp without time zone,
  error_message text,
  gateway_node character varying,
  executor_node character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT executions_pkey PRIMARY KEY (id),
  CONSTRAINT executions_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id),
  CONSTRAINT executions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id)
);
CREATE TABLE public.issues (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid,
  external_id character varying,
  source character varying,
  title text NOT NULL,
  description text,
  status USER-DEFINED DEFAULT 'open'::issue_status,
  created_by uuid,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT issues_pkey PRIMARY KEY (id),
  CONSTRAINT issues_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT issues_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  type character varying,
  title character varying,
  message text,
  data jsonb,
  read_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.plans (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  issue_id uuid,
  version integer NOT NULL,
  type character varying DEFAULT 'primary'::character varying,
  status USER-DEFINED DEFAULT 'draft'::plan_status,
  content jsonb NOT NULL,
  risk_level character varying,
  estimated_complexity integer,
  created_by_agent character varying,
  approved_by uuid,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT plans_pkey PRIMARY KEY (id),
  CONSTRAINT plans_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES public.issues(id),
  CONSTRAINT plans_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id)
);
CREATE TABLE public.project_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid,
  user_id uuid,
  role character varying DEFAULT 'member'::character varying,
  joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT project_members_pkey PRIMARY KEY (id),
  CONSTRAINT project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT project_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  status character varying DEFAULT 'active'::character varying,
  owner_id uuid,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);
CREATE TABLE public.system_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  correlation_id uuid,
  issue_id uuid,
  execution_id uuid,
  agent_id character varying,
  log_level USER-DEFINED,
  message text,
  metadata jsonb,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT system_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid,
  title character varying NOT NULL,
  description text,
  status character varying DEFAULT 'todo'::character varying,
  priority character varying DEFAULT 'medium'::character varying,
  assignee_id uuid,
  creator_id uuid,
  due_date timestamp without time zone,
  estimated_hours integer,
  actual_hours integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.users(id),
  CONSTRAINT tasks_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  avatar_url character varying,
  role character varying DEFAULT 'user'::character varying,
  email_verified boolean DEFAULT false,
  mfa_enabled boolean DEFAULT false,
  last_login_at timestamp without time zone,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);