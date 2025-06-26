
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  c8r_balance INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for minted NFTs
CREATE TABLE public.minted_nfts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  model_source TEXT NOT NULL,
  voice_sample TEXT NOT NULL,
  personality_traits TEXT[] NOT NULL DEFAULT '{}',
  role_type TEXT NOT NULL,
  language TEXT NOT NULL,
  gesture_package TEXT NOT NULL,
  nft_type TEXT NOT NULL DEFAULT 'ERC-721', -- ERC-721 or ERC-1155
  royalty_percentage INTEGER NOT NULL DEFAULT 5, -- 2-10%
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minted_nfts ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for minted NFTs
CREATE POLICY "Users can view their own NFTs" 
  ON public.minted_nfts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own NFTs" 
  ON public.minted_nfts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own NFTs" 
  ON public.minted_nfts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'), 
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for NFT images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('nft-images', 'nft-images', true);

-- Storage policies
CREATE POLICY "Users can upload NFT images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'nft-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view NFT images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'nft-images');
