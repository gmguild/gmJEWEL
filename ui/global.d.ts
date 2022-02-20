declare module "*.json" {
  const value: any;
  export = value;
}

declare module "*.png" {
  const value: string;
  export = value;
}

declare module "*.mp3" {
  const value: string;
  export = value;
}

declare module "GmgDeployment" {
  const value: Record<string, string>;
  export = value;
}
