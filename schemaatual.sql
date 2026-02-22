-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Agent (
  id text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  description text,
  avatar text NOT NULL DEFAULT '🤖'::text,
  model text NOT NULL DEFAULT 'google/gemini-2.5-flash-lite'::text,
  status text NOT NULL DEFAULT 'offline'::text,
  teams ARRAY,
  commands ARRAY,
  lastSeen timestamp without time zone,
  uptime double precision NOT NULL DEFAULT 0,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Agent_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Backup (
  id text NOT NULL,
  name text NOT NULL,
  path text NOT NULL,
  sizeBytes integer NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'auto'::text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Backup_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Config (
  id text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  CONSTRAINT Config_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Heartbeat (
  id text NOT NULL,
  agentId text NOT NULL,
  status text NOT NULL DEFAULT 'ok'::text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Heartbeat_pkey PRIMARY KEY (id),
  CONSTRAINT Heartbeat_agentId_fkey FOREIGN KEY (agentId) REFERENCES public.Agent(id)
);
CREATE TABLE public.Log (
  id text NOT NULL,
  level text NOT NULL DEFAULT 'INFO'::text,
  message text NOT NULL,
  agentId text,
  meta jsonb,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Log_pkey PRIMARY KEY (id),
  CONSTRAINT Log_agentId_fkey FOREIGN KEY (agentId) REFERENCES public.Agent(id)
);
CREATE TABLE public.Project (
  id text NOT NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active'::text,
  progress integer NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT '#4f8ef7'::text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Project_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Task (
  id text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open'::text,
  priority text NOT NULL DEFAULT 'medium'::text,
  agentId text,
  projectId text,
  dueAt timestamp without time zone,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Task_pkey PRIMARY KEY (id),
  CONSTRAINT Task_agentId_fkey FOREIGN KEY (agentId) REFERENCES public.Agent(id),
  CONSTRAINT Task_projectId_fkey FOREIGN KEY (projectId) REFERENCES public.Project(id)
);
CREATE TABLE public.Team (
  id text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  color text NOT NULL DEFAULT '#4f8ef7'::text,
  icon text NOT NULL DEFAULT '⬡'::text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Team_pkey PRIMARY KEY (id)
);
CREATE TABLE public.User (
  id text NOT NULL,
  email text NOT NULL,
  passwordHash text NOT NULL,
  name text NOT NULL DEFAULT 'Admin'::text,
  role text NOT NULL DEFAULT 'admin'::text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT User_pkey PRIMARY KEY (id)
);