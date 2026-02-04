// Types for shared lib utilities

interface DatasetSchemaOptions {
  name: string;
  description: string;
  url: string;
  keywords?: string[];
  provider?: {
    name: string;
    url: string;
  };
}

interface HowToSchemaOptions {
  name: string;
  description: string;
  url: string;
  steps: Array<{
    name: string;
    text: string;
  }>;
  tool?: string;
}

interface WebPageSchemaOptions {
  name: string;
  description: string;
  url: string;
  breadcrumb?: Array<{
    name: string;
    url: string;
  }>;
}

interface OgImageOptions {
  title: string;
  description: string;
  method?: string;
}
