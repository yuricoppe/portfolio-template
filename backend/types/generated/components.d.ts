import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsFullImage extends Struct.ComponentSchema {
  collectionName: 'components_sections_full_images';
  info: {
    description: 'Imagem em largura total com gradiente de fundo';
    displayName: 'Imagem full-bleed';
    icon: 'picture';
  };
  attributes: {
    gradient: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SectionsImageGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_grids';
  info: {
    description: 'Imagens lado a lado em grade';
    displayName: 'Grade de imagens';
    icon: 'apps';
  };
  attributes: {
    images: Schema.Attribute.Component<'shared.gallery-item', true>;
  };
}

export interface SectionsMetrics extends Struct.ComponentSchema {
  collectionName: 'components_sections_metrics';
  info: {
    description: 'Resultados em n\u00FAmeros';
    displayName: 'M\u00E9tricas';
    icon: 'chartBubble';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.metric', true>;
  };
}

export interface SectionsQuote extends Struct.ComponentSchema {
  collectionName: 'components_sections_quotes';
  info: {
    description: 'Depoimento centralizado com autor';
    displayName: 'Cita\u00E7\u00E3o';
    icon: 'quote';
  };
  attributes: {
    author: Schema.Attribute.String;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    quoteMuted: Schema.Attribute.Text;
  };
}

export interface SectionsStatement extends Struct.ComponentSchema {
  collectionName: 'components_sections_statements';
  info: {
    description: 'Frase de impacto com trecho em destaque e trecho esmaecido';
    displayName: 'Statement';
    icon: 'quote';
  };
  attributes: {
    lead: Schema.Attribute.Text & Schema.Attribute.Required;
    muted: Schema.Attribute.Text;
  };
}

export interface SectionsTextColumns extends Struct.ComponentSchema {
  collectionName: 'components_sections_text_columns';
  info: {
    description: 'Blocos de texto lado a lado (ex.: desafio / solu\u00E7\u00E3o)';
    displayName: 'Colunas de texto';
    icon: 'layout';
  };
  attributes: {
    columns: Schema.Attribute.Component<'shared.text-column', true>;
  };
}

export interface SharedGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_gallery_items';
  info: {
    displayName: 'Gallery item';
    icon: 'picture';
  };
  attributes: {
    gradient: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedMetric extends Struct.ComponentSchema {
  collectionName: 'components_shared_metrics';
  info: {
    displayName: 'Metric';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_process_steps';
  info: {
    displayName: 'Process step';
    icon: 'layer';
  };
  attributes: {
    description: Schema.Attribute.Text;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_items';
  info: {
    displayName: 'Service item';
    icon: 'bulletList';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTextColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_columns';
  info: {
    displayName: 'Coluna de texto';
    icon: 'file';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    label: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'sections.full-image': SectionsFullImage;
      'sections.image-grid': SectionsImageGrid;
      'sections.metrics': SectionsMetrics;
      'sections.quote': SectionsQuote;
      'sections.statement': SectionsStatement;
      'sections.text-columns': SectionsTextColumns;
      'shared.gallery-item': SharedGalleryItem;
      'shared.metric': SharedMetric;
      'shared.process-step': SharedProcessStep;
      'shared.service-item': SharedServiceItem;
      'shared.social-link': SharedSocialLink;
      'shared.text-column': SharedTextColumn;
    }
  }
}
