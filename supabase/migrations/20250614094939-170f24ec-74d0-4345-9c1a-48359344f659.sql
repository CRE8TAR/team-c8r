
-- Create tasks table to define available earning tasks
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  reward_amount integer NOT NULL,
  task_type text NOT NULL CHECK (task_type IN ('plugin_add', 'plugin_create', 'avatar_mint', 'referral', 'daily_login', 'social_share')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_tasks table to track completed tasks
CREATE TABLE public.user_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  task_id uuid REFERENCES public.tasks NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  reward_claimed boolean NOT NULL DEFAULT false,
  UNIQUE(user_id, task_id)
);

-- Create rewards table to track all user rewards
CREATE TABLE public.rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  amount integer NOT NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('subscription', 'task_completion', 'referral', 'bonus')),
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tasks (everyone can read)
CREATE POLICY "Everyone can view active tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (is_active = true);

-- Create RLS policies for user_tasks
CREATE POLICY "Users can view their own completed tasks" 
  ON public.user_tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can complete their own tasks" 
  ON public.user_tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task completion" 
  ON public.user_tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for rewards
CREATE POLICY "Users can view their own rewards" 
  ON public.rewards 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can receive rewards" 
  ON public.rewards 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Insert default tasks
INSERT INTO public.tasks (title, description, reward_amount, task_type) VALUES
('Subscribe to CRE8TAR', 'Subscribe to CRE8TAR platform and get instant rewards', 1000, 'referral'),
('Add a Plugin', 'Add your first plugin to enhance your avatar', 500, 'plugin_add'),
('Create a Plugin', 'Create and publish your own plugin', 500, 'plugin_create'),
('Mint Your First Avatar', 'Create and mint your first NFT avatar', 300, 'avatar_mint'),
('Daily Login Bonus', 'Login daily to earn rewards', 50, 'daily_login'),
('Share on Social Media', 'Share CRE8TAR on your social media', 200, 'social_share'),
('Refer a Friend', 'Invite friends to join CRE8TAR', 750, 'referral');
