
-- Create staking table
CREATE TABLE public.staking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  amount integer NOT NULL,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  unlock_date timestamp with time zone NOT NULL,
  rewards_earned integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create governance proposals table
CREATE TABLE public.proposals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'passed', 'rejected', 'expired')),
  votes_for integer DEFAULT 0,
  votes_against integer DEFAULT 0,
  end_date timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid REFERENCES public.proposals NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('for', 'against')),
  voting_power integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

-- Enable RLS for all new tables
ALTER TABLE public.staking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for staking
CREATE POLICY "Users can view their own staking positions" 
  ON public.staking 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own staking positions" 
  ON public.staking 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own staking positions" 
  ON public.staking 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for proposals
CREATE POLICY "Everyone can view proposals" 
  ON public.proposals 
  FOR SELECT 
  TO authenticated;

CREATE POLICY "Authenticated users can create proposals" 
  ON public.proposals 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Create RLS policies for votes
CREATE POLICY "Users can view all votes" 
  ON public.votes 
  FOR SELECT 
  TO authenticated;

CREATE POLICY "Users can create their own votes" 
  ON public.votes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update minted_nfts table to change default NFT type to ERC-1155
ALTER TABLE public.minted_nfts ALTER COLUMN nft_type SET DEFAULT 'ERC-1155';
