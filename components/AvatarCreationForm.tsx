
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";

interface AvatarCreationFormProps {
  onMint: (formData: any) => void;
  isLoading: boolean;
}

export function AvatarCreationForm({ onMint, isLoading }: AvatarCreationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    avatarId: "",
    description: "",
    modelSource: "",
    voiceSample: "",
    personalityTraits: [] as string[],
    roleType: "",
    language: "",
    gesturePackage: "",
    nftType: "ERC-1155",
    royaltyPercentage: 5 // Fixed at 5%
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const personalityOptions = [
    "Professional", "Humorous", "Empathetic", "Friendly", "Confident"
  ];

  const languages = [
    "English", "Spanish", "Hindi", "French", "Mandarin", "German", "Italian", 
    "Portuguese", "Russian", "Japanese", "Korean", "Arabic", "Dutch", "Swedish"
  ];

  const handlePersonalityToggle = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      personalityTraits: prev.personalityTraits.includes(trait)
        ? prev.personalityTraits.filter(t => t !== trait)
        : [...prev.personalityTraits, trait]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMint({ ...formData, imageFile });
  };

  const isFormValid = formData.name && formData.avatarId && formData.modelSource && formData.voiceSample && 
                     formData.roleType && formData.language && formData.gesturePackage && imageFile;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Avatar NFT</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Avatar Image *</label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Drop your avatar image here, or click to browse
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Avatar preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter avatar name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar ID *</label>
              <Input
                value={formData.avatarId}
                onChange={(e) => setFormData(prev => ({ ...prev, avatarId: e.target.value }))}
                placeholder="Enter unique avatar ID"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">3D Model Source *</label>
              <Select value={formData.modelSource} onValueChange={(value) => setFormData(prev => ({ ...prev, modelSource: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blender">Blender</SelectItem>
                  <SelectItem value="maya">Maya</SelectItem>
                  <SelectItem value="unreal">Unreal Engine</SelectItem>
                  <SelectItem value="metahumans">Meta Humans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Voice Sample *</label>
              <Select value={formData.voiceSample} onValueChange={(value) => setFormData(prev => ({ ...prev, voiceSample: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice sample" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="alex">Male (Alex)</SelectItem>
                  <SelectItem value="sophia">Female (Sophia)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role Type *</label>
              <Select value={formData.roleType} onValueChange={(value) => setFormData(prev => ({ ...prev, roleType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teaching">Teaching</SelectItem>
                  <SelectItem value="anchoring">Anchoring</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                  <SelectItem value="modeling">Modeling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language Support *</label>
              <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang.toLowerCase()}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gesture Package *</label>
              <Select value={formData.gesturePackage} onValueChange={(value) => setFormData(prev => ({ ...prev, gesturePackage: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gesture package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news-presenter">News Presenter Gestures</SelectItem>
                  <SelectItem value="teaching">Teaching Animations</SelectItem>
                  <SelectItem value="product-showcase">Product Showcase Moves</SelectItem>
                  <SelectItem value="idle-casual">Idle & Casual Motions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your avatar..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Personality Traits</label>
            <div className="flex flex-wrap gap-2">
              {personalityOptions.map((trait) => (
                <Badge
                  key={trait}
                  variant={formData.personalityTraits.includes(trait) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handlePersonalityToggle(trait)}
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          {/* Fixed royalty info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Royalty:</strong> 5% (Standard for all NFTs)
            </p>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple"
            >
              {isLoading ? "Minting Avatar..." : "Mint Avatar NFT (ERC-1155)"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
