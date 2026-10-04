import { useEffect, type FC } from 'react';
import { applySEOMetadata, type SEOMetadata } from '../../utils/seo';
import type { Product } from '../../types/ecommerce';

interface SEOHeadProps {
  metadata: SEOMetadata;
  product?: Product;
}

/**
 * Reusable Declarative SEO Head Manager Component.
 * Updates DOM title, meta description, OpenGraph, Twitter Cards, and Schema.org JSON-LD graph.
 */
export const SEOHead: FC<SEOHeadProps> = ({ metadata, product }) => {
  useEffect(() => {
    applySEOMetadata(metadata, product);
  }, [metadata, product]);

  return null;
};
