export type PromptProduct = {
  id: string;
  code: string;
  name: string;
  brand: string;
  category: string;
  theme: string | null;
  targetAge: string | null;
  shellMaterial: string | null;
  visor: string | null;
  buckle: string | null;
  description?: string | null;
};

export type ProductDnaPromptContext = {
  sku: string;
  brand: string;
  category: string;
  ageRange: string;
  gender: string;
  material: string;
  finishing: string;
  visor: string;
  buckle: string;
  weight: string;
  sni: boolean;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern: string;
  logoPosition: string;
  brandLock: boolean;
  shapeLock: boolean;
  materialLock: boolean;
  graphicLock: boolean;
  logoLock: boolean;
  colorLock: boolean;
  notes: string;
};

export type BackgroundReference = {
  id: string;
  name: string;
  path: string;
};

export type SceneDraft = {
  id: string;
  title: string;
  durationSeconds: number;
  shotType: string;
  sceneId: string;
  cameraId: string;
  lightId: string;
  cameraAngle: string;
  cameraMovement: string;
  action: string;
  environment: string;
  additionalInstruction: string;
};

export type ScenePrompt = {
  sceneId: string;
  index: number;
  startSecond: number;
  endSecond: number;
  title: string;
  prompt: string;
};

export type PromptPreset = {
  id: string;
  name: string;
  text: string;
};
