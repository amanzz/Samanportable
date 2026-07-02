import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import { UnifiedSEO } from '../components/UnifiedSEO';
import { useRouter } from 'next/router';
import Link from 'next/link';
import parse, { domToReact, Element, HTMLReactParserOptions } from 'html-react-parser';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import OptimizedContent from '../components/OptimizedContent';
import { 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  Share2, 
  ArrowLeft,
  Loader2,
  Tag
} from 'lucide-react';
import dynamic from 'next/dynamic';


import type { BlogPost, RankMathSEOData } from '../config/api';
import { generateBlogPostSchema, BlogPostSchema, generateBreadcrumbSchema, extractFAQSchema, generateUnifiedBlogGraph, getCityServiceSchema, getCityPageGraph, getFAQSchemaOverride } from '../lib/schema';
import { decodeHtmlEntities } from '../lib/utils';
import { demoteHtmlH1ToH2 } from '../lib/seoHtml';
import { setPublicEdgeCache } from '../lib/cacheHeaders';

interface BlogPostProps {
  post: BlogPost | null;
  slug: string;
  rankMathSEO?: RankMathSEOData | null;
}

// Slug-specific metadata image override. This post's WordPress featured image
// (container-office-by-saman-13-1_11zon-1024x584.webp) returns 404, so its
// og:image / twitter:image / BlogPosting schema image use a valid absolute local
// image. Keyed to this one slug only — no other page is affected.
const METADATA_IMAGE_OVERRIDES: Record<string, string> = {
  'best-porta-cabin-supplier': 'https://www.samanportable.com/container-office-by-saman-1.webp',
};
// Distinctive marker of the broken WordPress image (matches its size variants).
const BROKEN_WP_IMAGE_MARKER = 'container-office-by-saman-13-1_11zon';

const SEO_TITLE_OVERRIDES: Record<string, string> = {
  'container-houses-cost-guide-2024': 'Container Houses Cost Guide 2024 | SAMAN',
  'porta-cabin-office-price': 'Porta Office Cabin Price Guide 2025 | SAMAN',
};

const CONTENT_H1_DEMOTION_SLUGS = new Set([
  'best-porta-cabins-in-bangalore',
  'container-office-in-ahmedabad',
  'container-office-in-kolkata',
]);

type RelatedContainerCafeLink = {
  href: string;
  label: string;
};

const CONTAINER_CAFE_NCR_RELATED_LINKS: Record<string, RelatedContainerCafeLink[]> = {
  'container-cafes-in-central-delhi': [
    { href: '/container-cafes-in-east-delhi', label: 'container cafe options in East Delhi' },
    { href: '/container-cafes-in-south-delhi', label: 'modular cafe setups for South Delhi' },
    { href: '/container-cafes-in-west-delhi', label: 'cafe container units for West Delhi' },
    { href: '/product/container-cafe', label: 'custom container cafe design' },
  ],
  'container-cafes-in-east-delhi': [
    { href: '/container-cafes-in-central-delhi', label: 'container cafe choices in Central Delhi' },
    { href: '/container-cafes-in-noida', label: 'Noida container cafe projects' },
    { href: '/container-cafes-in-ghaziabad', label: 'cafe container units for Ghaziabad' },
    { href: '/product-category/container-cafe', label: 'container cafe designs and price bands' },
  ],
  'container-cafes-in-faridabad': [
    { href: '/container-cafes-in-south-delhi', label: 'South Delhi container cafe support' },
    { href: '/container-cafes-in-gurgaon', label: 'modular cafe cabins in Gurgaon' },
    { href: '/container-cafes-in-greater-noida', label: 'container cafe units for Greater Noida' },
    { href: '/product/container-cafe', label: 'SAMAN container cafe unit' },
  ],
  'container-cafes-in-ghaziabad': [
    { href: '/container-cafes-in-east-delhi', label: 'East Delhi container cafe options' },
    { href: '/container-cafes-in-noida', label: 'container cafes for Noida outlets' },
    { href: '/container-cafes-in-greater-noida', label: 'Greater Noida cafe container projects' },
    { href: '/product-category/container-cafe', label: 'full container cafe range' },
  ],
  'container-cafes-in-greater-noida': [
    { href: '/container-cafes-in-noida', label: 'Noida container cafe requirements' },
    { href: '/container-cafes-in-ghaziabad', label: 'cafe container units for Ghaziabad' },
    { href: '/container-cafes-in-faridabad', label: 'Faridabad modular cafe projects' },
    { href: '/product/container-cafe', label: 'container cafe build options' },
  ],
  'container-cafes-in-gurgaon': [
    { href: '/container-cafes-in-south-delhi', label: 'South Delhi modular cafe options' },
    { href: '/container-cafes-in-west-delhi', label: 'West Delhi cafe container units' },
    { href: '/container-cafes-in-faridabad', label: 'container cafe projects in Faridabad' },
    { href: '/product-category/container-cafe', label: 'container cafe formats' },
  ],
  'container-cafes-in-noida': [
    { href: '/container-cafes-in-greater-noida', label: 'Greater Noida container cafe projects' },
    { href: '/container-cafes-in-east-delhi', label: 'East Delhi cafe container options' },
    { href: '/container-cafes-in-ghaziabad', label: 'Ghaziabad modular cafe units' },
    { href: '/product/container-cafe', label: 'custom container cafe design' },
  ],
  'container-cafes-in-south-delhi': [
    { href: '/container-cafes-in-faridabad', label: 'Faridabad container cafe units' },
    { href: '/container-cafes-in-gurgaon', label: 'Gurgaon modular cafe cabins' },
    { href: '/container-cafes-in-central-delhi', label: 'Central Delhi cafe container options' },
    { href: '/product-category/container-cafe', label: 'container cafe designs and price bands' },
  ],
  'container-cafes-in-west-delhi': [
    { href: '/container-cafes-in-gurgaon', label: 'Gurgaon container cafe options' },
    { href: '/container-cafes-in-south-delhi', label: 'South Delhi modular cafe setups' },
    { href: '/container-cafes-in-central-delhi', label: 'Central Delhi cafe container units' },
    { href: '/product/container-cafe', label: 'SAMAN container cafe unit' },
  ],
};

const RelatedContainerCafeLocations = ({ slug }: { slug: string }) => {
  const links = CONTAINER_CAFE_NCR_RELATED_LINKS[slug];
  if (!links?.length) return null;

  const currentPath = `/${slug}`;
  const visibleLinks = links.filter((link) => link.href !== currentPath);

  return (
    <section className="mt-10 rounded-lg border border-emerald-100 bg-emerald-50/50 p-5 sm:p-6" aria-labelledby="related-container-cafe-locations">
      <h2 id="related-container-cafe-locations" className="text-xl font-semibold text-slate-900 mb-4">Related Container Cafe Locations in NCR</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-[#0A3D2A] transition-colors hover:border-emerald-300 hover:bg-emerald-50">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};
type RelatedLabourColonyLink = {
  href: string;
  label: string;
};

const LABOUR_COLONY_NCR_RELATED_LINKS: Record<string, RelatedLabourColonyLink[]> = {
  'labour-colonies-in-east-delhi': [
    { href: '/labour-colonies-in-north-delhi', label: 'labour colony setup in North Delhi' },
    { href: '/labour-colonies-in-noida', label: 'worker accommodation units in Noida' },
    { href: '/labour-colonies-in-ghaziabad', label: 'temporary worker housing in Ghaziabad' },
    { href: '/product/labor-colony', label: 'SAMAN labour colony cabins' },
  ],
  'labour-colonies-in-north-delhi': [
    { href: '/labour-colonies-in-east-delhi', label: 'labour colony setup in East Delhi' },
    { href: '/labour-colonies-in-west-delhi', label: 'worker housing units in West Delhi' },
    { href: '/labour-colonies-in-noida', label: 'site labour housing in Noida' },
    { href: '/product/labor-colony', label: 'labour colony cabin options' },
  ],
  'labour-colonies-in-south-delhi': [
    { href: '/labour-colonies-in-faridabad', label: 'worker accommodation units in Faridabad' },
    { href: '/labour-colonies-in-west-delhi', label: 'temporary labour housing in West Delhi' },
    { href: '/labour-colonies-in-east-delhi', label: 'labour colony cabins in East Delhi' },
    { href: '/product/labor-colony', label: 'factory-built labour colony units' },
  ],
  'labour-colonies-in-west-delhi': [
    { href: '/labour-colonies-in-south-delhi', label: 'site labour housing in South Delhi' },
    { href: '/labour-colonies-in-north-delhi', label: 'labour colony cabins in North Delhi' },
    { href: '/labour-colonies-in-faridabad', label: 'worker housing units in Faridabad' },
    { href: '/product/labor-colony', label: 'modular labour accommodation units' },
  ],
  'labour-colonies-in-faridabad': [
    { href: '/labour-colonies-in-south-delhi', label: 'South Delhi labour colony support' },
    { href: '/labour-colonies-in-noida', label: 'labour colony cabins in Noida' },
    { href: '/labour-colonies-in-greater-noida', label: 'site labour housing in Greater Noida' },
    { href: '/product/labor-colony', label: 'SAMAN worker accommodation cabins' },
  ],
  'labour-colonies-in-ghaziabad': [
    { href: '/labour-colonies-in-east-delhi', label: 'East Delhi worker housing options' },
    { href: '/labour-colonies-in-noida', label: 'labour colony setup in Noida' },
    { href: '/labour-colonies-in-greater-noida', label: 'worker accommodation units in Greater Noida' },
    { href: '/product/labor-colony', label: 'labour colony units for project sites' },
  ],
  'labour-colonies-in-greater-noida': [
    { href: '/labour-colonies-in-noida', label: 'Noida labour colony cabins' },
    { href: '/labour-colonies-in-ghaziabad', label: 'temporary worker housing in Ghaziabad' },
    { href: '/labour-colonies-in-faridabad', label: 'Faridabad site labour housing' },
    { href: '/product/labor-colony', label: 'worker accommodation cabin range' },
  ],
  'labour-colonies-in-noida': [
    { href: '/labour-colonies-in-greater-noida', label: 'site labour housing in Greater Noida' },
    { href: '/labour-colonies-in-east-delhi', label: 'East Delhi labour colony setup' },
    { href: '/labour-colonies-in-ghaziabad', label: 'Ghaziabad worker accommodation units' },
    { href: '/product/labor-colony', label: 'custom labour colony cabins' },
  ],
};

const RelatedLabourColonyLocations = ({ slug }: { slug: string }) => {
  const links = LABOUR_COLONY_NCR_RELATED_LINKS[slug];
  if (!links?.length) return null;

  const currentPath = `/${slug}`;
  const visibleLinks = links.filter((link) => link.href !== currentPath);

  return (
    <section className="mt-10 rounded-lg border border-amber-100 bg-amber-50/50 p-5 sm:p-6" aria-labelledby="related-labour-colony-locations">
      <h2 id="related-labour-colony-locations" className="text-xl font-semibold text-slate-900 mb-4">Related Labour Colony Locations in NCR</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-[#0A3D2A] transition-colors hover:border-amber-300 hover:bg-amber-50">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

type RelatedPortableOfficeLink = {
  href: string;
  label: string;
};

const PORTABLE_OFFICE_NCR_RELATED_LINKS: Record<string, RelatedPortableOfficeLink[]> = {
  'portable-office-cabins-in-faridabad': [
    { href: '/portable-office-cabins-in-gurgaon', label: 'modular office cabin options in Gurgaon' },
    { href: '/portable-office-cabins-in-south-delhi', label: 'portable office cabins in South Delhi' },
    { href: '/portable-office-cabins-in-ghaziabad', label: 'site office cabins in Ghaziabad' },
    { href: '/product/portable-office', label: 'SAMAN portable office cabins' },
  ],
  'portable-office-cabins-in-ghaziabad': [
    { href: '/portable-office-cabins-in-east-delhi', label: 'portable office cabin solutions in East Delhi' },
    { href: '/portable-office-cabins-in-faridabad', label: 'portable office cabins in Faridabad' },
    { href: '/portable-office-cabins-in-delhi-ncr', label: 'temporary site office cabins in Delhi NCR' },
    { href: '/product/portable-office', label: 'factory-built portable office units' },
  ],
  'portable-office-cabins-in-gurgaon': [
    { href: '/portable-office-cabins-in-faridabad', label: 'portable office cabins in Faridabad' },
    { href: '/portable-office-cabins-in-south-delhi', label: 'site office cabins in South Delhi' },
    { href: '/portable-office-cabins-in-central-delhi', label: 'modular office cabins for Central Delhi' },
    { href: '/product/portable-office', label: 'portable office cabin designs' },
  ],
  'portable-office-cabins-in-central-delhi': [
    { href: '/portable-office-cabins-in-east-delhi', label: 'East Delhi portable office cabins' },
    { href: '/portable-office-cabins-in-north-delhi', label: 'site office cabins in North Delhi' },
    { href: '/portable-office-cabins-in-gurgaon', label: 'Gurgaon modular office cabin options' },
    { href: '/product/portable-office', label: 'portable office cabin range' },
  ],
  'portable-office-cabins-in-east-delhi': [
    { href: '/portable-office-cabins-in-ghaziabad', label: 'Ghaziabad site office cabin support' },
    { href: '/portable-office-cabins-in-central-delhi', label: 'portable office cabins in Central Delhi' },
    { href: '/portable-office-cabins-in-delhi-ncr', label: 'Delhi NCR portable office projects' },
    { href: '/product/portable-office', label: 'custom portable office cabins' },
  ],
  'portable-office-cabins-in-north-delhi': [
    { href: '/portable-office-cabins-in-central-delhi', label: 'Central Delhi portable office cabins' },
    { href: '/portable-office-cabins-in-east-delhi', label: 'temporary site office cabins in East Delhi' },
    { href: '/portable-office-cabins-in-delhi-ncr', label: 'portable office cabin solutions in Delhi NCR' },
    { href: '/product/portable-office', label: 'portable office cabin options' },
  ],
  'portable-office-cabins-in-south-delhi': [
    { href: '/portable-office-cabins-in-faridabad', label: 'Faridabad portable office cabin support' },
    { href: '/portable-office-cabins-in-gurgaon', label: 'site office cabins in Gurgaon' },
    { href: '/portable-office-cabins-in-delhi-ncr', label: 'temporary office cabins across Delhi NCR' },
    { href: '/product/portable-office', label: 'SAMAN modular office cabins' },
  ],
  'portable-office-cabins-in-delhi-ncr': [
    { href: '/portable-office-cabins-in-gurgaon', label: 'modular office cabin options in Gurgaon' },
    { href: '/portable-office-cabins-in-ghaziabad', label: 'site office cabins in Ghaziabad' },
    { href: '/portable-office-cabins-in-faridabad', label: 'portable office cabins in Faridabad' },
    { href: '/product/portable-office', label: 'portable office cabin solutions' },
  ],
};

const RelatedPortableOfficeLocations = ({ slug }: { slug: string }) => {
  const links = PORTABLE_OFFICE_NCR_RELATED_LINKS[slug];
  if (!links?.length) return null;

  const currentPath = `/${slug}`;
  const visibleLinks = links.filter((link) => link.href !== currentPath);

  return (
    <section className="mt-10 rounded-lg border border-sky-100 bg-sky-50/50 p-5 sm:p-6" aria-labelledby="related-portable-office-locations">
      <h2 id="related-portable-office-locations" className="text-xl font-semibold text-slate-900 mb-4">Related Portable Office Cabin Locations in NCR</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md border border-sky-100 bg-white px-4 py-3 text-sm font-medium text-[#0A3D2A] transition-colors hover:border-sky-300 hover:bg-sky-50">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

type RelatedPortableCabinLink = {
  href: string;
  label: string;
};

const PORTABLE_CABIN_RELATED_LINKS: Record<string, RelatedPortableCabinLink[]> = {
  'portable-cabins-in-central-delhi': [
    { href: '/portable-cabins-in-east-delhi', label: 'site cabin options for East Delhi' },
    { href: '/portable-cabins-in-north-delhi', label: 'portable cabins in North Delhi' },
    { href: '/top-rated-portable-cabin-supplier-delhi', label: 'portable cabin buying guide for Delhi' },
    { href: '/product/portable-cabin', label: 'SAMAN portable cabin range' },
  ],
  'portable-cabins-in-east-delhi': [
    { href: '/portable-cabins-in-central-delhi', label: 'portable cabins in Central Delhi' },
    { href: '/portable-cabins-in-west-delhi', label: 'portable cabin suppliers in West Delhi' },
    { href: '/top-rated-portable-cabin-supplier-delhi', label: 'Delhi portable cabin buyer guide' },
    { href: '/product/portable-cabin', label: 'custom portable cabin options' },
  ],
  'portable-cabins-in-mg-road': [
    { href: '/best-porta-cabins-in-bangalore', label: 'portable cabins in Bangalore' },
    { href: '/portacabins-for-sale-in-frazer-town-2', label: 'porta cabin options in Frazer Town' },
    { href: '/portable-cabins-in-central-delhi', label: 'portable cabin projects in Central Delhi' },
    { href: '/product/portable-cabin', label: 'portable cabin product range' },
  ],
  'portable-cabins-in-north-delhi': [
    { href: '/portable-cabins-in-central-delhi', label: 'Central Delhi portable cabin support' },
    { href: '/portable-cabins-in-east-delhi', label: 'East Delhi site cabin options' },
    { href: '/portable-cabins-in-south-delhi', label: 'portable cabins in South Delhi' },
    { href: '/product/portable-cabin', label: 'SAMAN portable cabin solutions' },
  ],
  'portable-cabins-in-south-delhi': [
    { href: '/portable-cabins-in-west-delhi', label: 'West Delhi portable cabin suppliers' },
    { href: '/portable-cabins-in-central-delhi', label: 'portable cabins in Central Delhi' },
    { href: '/top-rated-portable-cabin-supplier-delhi', label: 'portable cabin guide for Delhi buyers' },
    { href: '/product/portable-cabin', label: 'portable cabin models from SAMAN' },
  ],
  'portable-cabins-in-west-delhi': [
    { href: '/portable-cabins-in-south-delhi', label: 'portable cabins in South Delhi' },
    { href: '/portable-cabins-in-east-delhi', label: 'East Delhi portable cabin options' },
    { href: '/top-rated-portable-cabin-supplier-delhi', label: 'Delhi portable cabin buying guide' },
    { href: '/product/portable-cabin', label: 'factory-built portable cabin range' },
  ],
  'portacabins-for-sale-in-frazer-town-2': [
    { href: '/best-porta-cabins-in-bangalore', label: 'portable cabins in Bangalore' },
    { href: '/portable-cabins-in-mg-road', label: 'portable cabins near MG Road' },
    { href: '/portable-cabins-in-central-delhi', label: 'portable cabin options in Central Delhi' },
    { href: '/product/portable-cabin', label: 'SAMAN portable cabin range' },
  ],
  'top-rated-portable-cabin-supplier-delhi': [
    { href: '/portable-cabins-in-central-delhi', label: 'portable cabins in Central Delhi' },
    { href: '/portable-cabins-in-east-delhi', label: 'site cabin options for East Delhi' },
    { href: '/portable-cabins-in-west-delhi', label: 'portable cabin suppliers in West Delhi' },
    { href: '/product/portable-cabin', label: 'portable cabin product range' },
  ],
  'best-porta-cabins-in-bangalore': [
    { href: '/portable-cabins-in-mg-road', label: 'portable cabins near MG Road' },
    { href: '/portacabins-for-sale-in-frazer-town-2', label: 'porta cabin options in Frazer Town' },
    { href: '/portable-cabins-in-central-delhi', label: 'portable cabin projects in Central Delhi' },
    { href: '/product/portable-cabin', label: 'SAMAN portable cabin solutions' },
  ],
};

const RelatedPortableCabinResources = ({ slug }: { slug: string }) => {
  const links = PORTABLE_CABIN_RELATED_LINKS[slug];
  if (!links?.length) return null;

  const currentPath = `/${slug}`;
  const visibleLinks = links.filter((link) => link.href !== currentPath);

  return (
    <section className="mt-10 rounded-lg border border-lime-100 bg-lime-50/50 p-5 sm:p-6" aria-labelledby="related-portable-cabin-resources">
      <h2 id="related-portable-cabin-resources" className="text-xl font-semibold text-slate-900 mb-4">Related Portable Cabin Locations and Resources</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md border border-lime-100 bg-white px-4 py-3 text-sm font-medium text-[#0A3D2A] transition-colors hover:border-lime-300 hover:bg-lime-50">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

const PORTABLE_CABIN_SUPPORT_RELATED_LINKS: Record<string, RelatedPortableCabinLink[]> = {
  'best-porta-cabin-manufacturer-ncr': [
    { href: '/portable-cabin-rental-services', label: 'portable cabin rental services' },
    { href: '/porta-cabins-on-rent', label: 'porta cabins on rent' },
    { href: '/eco-friendly-portable-cabins', label: 'eco-friendly portable cabins' },
    { href: '/product/portable-cabin', label: 'SAMAN portable cabin range' },
  ],
  'eco-friendly-portable-cabins': [
    { href: '/best-porta-cabin-manufacturer-ncr', label: 'porta cabin manufacturer in NCR' },
    { href: '/portable-cabin-rental-services', label: 'portable cabin rental services' },
    { href: '/porta-cabins-on-rent', label: 'porta cabins on rent' },
    { href: '/product-category/portable-cabin', label: 'portable cabin product category' },
  ],
  'porta-cabins-on-rent': [
    { href: '/portable-cabin-rental-services', label: 'portable cabin rental services' },
    { href: '/best-porta-cabin-manufacturer-ncr', label: 'NCR porta cabin manufacturer guide' },
    { href: '/eco-friendly-portable-cabins', label: 'eco-friendly portable cabin options' },
    { href: '/product/portable-cabin', label: 'portable cabin models from SAMAN' },
  ],
  'portable-cabin-rental-services': [
    { href: '/porta-cabins-on-rent', label: 'porta cabins on rent' },
    { href: '/best-porta-cabin-manufacturer-ncr', label: 'porta cabin manufacturer in NCR' },
    { href: '/eco-friendly-portable-cabins', label: 'eco-friendly portable cabins' },
    { href: '/product-category/portable-cabin', label: 'portable cabin product category' },
  ],
};

const RelatedPortableCabinSupportResources = ({ slug }: { slug: string }) => {
  const links = PORTABLE_CABIN_SUPPORT_RELATED_LINKS[slug];
  if (!links?.length) return null;

  const currentPath = `/${slug}`;
  const visibleLinks = links.filter((link) => link.href !== currentPath);

  return (
    <section className="mt-10 rounded-lg border border-emerald-100 bg-emerald-50/50 p-5 sm:p-6" aria-labelledby="related-portable-cabin-support-resources">
      <h2 id="related-portable-cabin-support-resources" className="text-xl font-semibold text-slate-900 mb-4">Related Portable Cabin Resources</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-[#0A3D2A] transition-colors hover:border-emerald-300 hover:bg-emerald-50">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

type RelatedContainerOfficeLink = {
  href: string;
  label: string;
};

const CONTAINER_OFFICE_RELATED_LINKS: Record<string, RelatedContainerOfficeLink[]> = {
  'container-offices-for-sale-in-jayanagar': [
    { href: '/container-offices-for-sale-in-jp-nagar', label: 'container offices in JP Nagar' },
    { href: '/container-offices-for-sale-in-vijayanagar', label: 'site container offices in Vijayanagar' },
    { href: '/20ft-container-office', label: '20ft container office options' },
    { href: '/product/container-offices', label: 'SAMAN container office range' },
  ],
  'container-offices-for-sale-in-vijayanagar': [
    { href: '/container-offices-for-sale-in-jayanagar', label: 'container offices in Jayanagar' },
    { href: '/container-offices-for-sale-in-jp-nagar', label: 'JP Nagar container office options' },
    { href: '/container-office-rental-is-perfect-solution', label: 'container office rental guide' },
    { href: '/product/container-offices', label: 'container office product range' },
  ],
  'customized-office-container-solutions': [
    { href: '/inside-container-office', label: 'inside container office layouts' },
    { href: '/20ft-container-office', label: '20ft container office planning' },
    { href: '/best-container-office-solutions', label: 'modular container office layouts' },
    { href: '/product/container-offices', label: 'custom container office range' },
  ],
  'container-offices-for-sale-in-jp-nagar': [
    { href: '/container-offices-for-sale-in-jayanagar', label: 'container offices in Jayanagar' },
    { href: '/container-offices-for-sale-in-vijayanagar', label: 'Vijayanagar site office containers' },
    { href: '/10-foot-shipping-container-office-perfect-fit-for-small-spaces', label: '10ft shipping container office ideas' },
    { href: '/product/container-offices', label: 'SAMAN container office units' },
  ],
  '10-foot-shipping-container-office-perfect-fit-for-small-spaces': [
    { href: '/12ft-office-container-smart-choice-for-growing-startups', label: '12ft office container options' },
    { href: '/20ft-container-office', label: '20ft container office options' },
    { href: '/inside-container-office', label: 'inside container office layouts' },
    { href: '/product/container-offices', label: 'compact container office range' },
  ],
  '12ft-office-container-smart-choice-for-growing-startups': [
    { href: '/10-foot-shipping-container-office-perfect-fit-for-small-spaces', label: '10ft shipping container office ideas' },
    { href: '/20ft-container-office', label: '20ft container office planning' },
    { href: '/customized-office-container-solutions', label: 'customized office container solutions' },
    { href: '/product/container-offices', label: 'factory-built container offices' },
  ],
  '20ft-container-office': [
    { href: '/inside-container-office', label: 'inside container office layouts' },
    { href: '/12ft-office-container-smart-choice-for-growing-startups', label: '12ft office container options' },
    { href: '/customized-office-container-solutions', label: 'custom container office layouts' },
    { href: '/product/container-offices', label: '20ft and modular container offices' },
  ],
  'inside-container-office': [
    { href: '/20ft-container-office', label: '20ft container office options' },
    { href: '/customized-office-container-solutions', label: 'modular container office layouts' },
    { href: '/best-container-office-solutions', label: 'best container office solutions' },
    { href: '/product/container-offices', label: 'container office design range' },
  ],
  'best-container-office-solutions': [
    { href: '/customized-office-container-solutions', label: 'customized office container solutions' },
    { href: '/inside-container-office', label: 'inside container office layouts' },
    { href: '/container-office-rental-is-perfect-solution', label: 'container office rental guide' },
    { href: '/product/container-offices', label: 'SAMAN container office range' },
  ],
  'container-office-rental-is-perfect-solution': [
    { href: '/20ft-container-office', label: '20ft container office options' },
    { href: '/best-container-office-solutions', label: 'modular container office solutions' },
    { href: '/container-offices-for-sale-in-vijayanagar', label: 'site container offices in Vijayanagar' },
    { href: '/product/container-offices', label: 'container office rental and sale range' },
  ],
};

const RelatedContainerOfficeResources = ({ slug }: { slug: string }) => {
  const links = CONTAINER_OFFICE_RELATED_LINKS[slug];
  if (!links?.length) return null;

  const currentPath = `/${slug}`;
  const visibleLinks = links.filter((link) => link.href !== currentPath);

  return (
    <section className="mt-10 rounded-lg border border-cyan-100 bg-cyan-50/50 p-5 sm:p-6" aria-labelledby="related-container-office-resources">
      <h2 id="related-container-office-resources" className="text-xl font-semibold text-slate-900 mb-4">Related Container Office Resources</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md border border-cyan-100 bg-white px-4 py-3 text-sm font-medium text-[#0A3D2A] transition-colors hover:border-cyan-300 hover:bg-cyan-50">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

const CONTAINER_OFFICE_NCR_RELATED_LINKS: Record<string, RelatedContainerOfficeLink[]> = {
  'container-offices-in-noida': [
    { href: '/container-offices-in-gurgaon', label: 'container offices in Gurgaon' },
    { href: '/product/container-offices', label: 'SAMAN container office range' },
    { href: '/product-category/container-offices', label: 'container office product category' },
    { href: '/customized-office-container-solutions', label: 'custom container office layouts' },
  ],
  'container-offices-in-gurgaon': [
    { href: '/container-offices-in-noida', label: 'container offices in Noida' },
    { href: '/product/container-offices', label: 'modular container office options' },
    { href: '/product-category/container-offices', label: 'container office product category' },
    { href: '/20ft-container-office', label: '20ft container office options' },
  ],
};

const RelatedContainerOfficeNcrLocations = ({ slug }: { slug: string }) => {
  const links = CONTAINER_OFFICE_NCR_RELATED_LINKS[slug];
  if (!links?.length) return null;

  const currentPath = `/${slug}`;
  const visibleLinks = links.filter((link) => link.href !== currentPath);

  return (
    <section className="mt-10 rounded-lg border border-teal-100 bg-teal-50/50 p-5 sm:p-6" aria-labelledby="related-container-office-ncr-locations">
      <h2 id="related-container-office-ncr-locations" className="text-xl font-semibold text-slate-900 mb-4">Related Container Office Locations in NCR</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md border border-teal-100 bg-white px-4 py-3 text-sm font-medium text-[#0A3D2A] transition-colors hover:border-teal-300 hover:bg-teal-50">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

type RelatedSupportLink = {
  href: string;
  label: string;
};

const PREFAB_HOME_SUPPORT_LINKS: Record<string, RelatedSupportLink[]> = {
  'durable-modular-homes-delhi': [
    { href: '/cost-of-prefab-homes', label: 'prefab home cost guide' },
    { href: '/prefab-homes-mumbai', label: 'prefab homes in Mumbai' },
    { href: '/prefabricated-houses-in-hyderabad', label: 'prefabricated houses in Hyderabad' },
    { href: '/product/prefabricated-houses', label: 'SAMAN prefabricated house range' },
  ],
  'cost-of-prefab-homes': [
    { href: '/build-a-prefabricated-modular-houses', label: 'building a prefabricated modular house' },
    { href: '/luxury-prefab-homes', label: 'luxury prefab home options' },
    { href: '/container-houses-cost-guide-2024', label: 'container house cost guide' },
    { href: '/product/prefabricated-houses', label: 'prefabricated house product range' },
  ],
  'prefab-homes-mumbai': [
    { href: '/cost-of-prefab-homes', label: 'prefab home cost guide' },
    { href: '/luxury-prefab-homes', label: 'luxury prefab homes' },
    { href: '/prefabricated-houses-in-hyderabad', label: 'prefabricated houses in Hyderabad' },
    { href: '/product-category/prefab-buildings', label: 'prefab building category' },
  ],
  'prefabricated-houses-in-hyderabad': [
    { href: '/durable-modular-homes-delhi', label: 'durable modular homes in Delhi' },
    { href: '/prefab-homes-mumbai', label: 'prefab homes in Mumbai' },
    { href: '/cost-of-prefab-homes', label: 'prefab home pricing guide' },
    { href: '/product/prefabricated-houses', label: 'prefabricated house range' },
  ],
  'build-a-prefabricated-modular-houses': [
    { href: '/cost-of-prefab-homes', label: 'cost of prefab homes' },
    { href: '/luxury-prefab-homes', label: 'luxury prefab home ideas' },
    { href: '/precast-housing-construction-guide', label: 'precast housing construction guide' },
    { href: '/product/prefabricated-houses', label: 'prefabricated house solutions' },
  ],
  'container-houses-cost-guide-2024': [
    { href: '/cost-of-prefab-homes', label: 'prefab home cost guide' },
    { href: '/build-a-prefabricated-modular-houses', label: 'build a prefabricated modular house' },
    { href: '/luxury-prefab-homes', label: 'luxury prefab homes' },
    { href: '/product/container-houses', label: 'container house product range' },
  ],
  'luxury-prefab-homes': [
    { href: '/cost-of-prefab-homes', label: 'prefab home cost guide' },
    { href: '/prefab-homes-mumbai', label: 'prefab homes in Mumbai' },
    { href: '/build-a-prefabricated-modular-houses', label: 'prefabricated modular house guide' },
    { href: '/product/prefabricated-houses', label: 'premium prefabricated houses' },
  ],
  'precast-housing-construction-guide': [
    { href: '/build-a-prefabricated-modular-houses', label: 'prefabricated modular house guide' },
    { href: '/cost-of-prefab-homes', label: 'prefab home cost guide' },
    { href: '/prefabricated-houses-in-hyderabad', label: 'prefabricated houses in Hyderabad' },
    { href: '/product/prefabricated-houses', label: 'prefabricated house range' },
  ],
};

const PORTABLE_OFFICE_SUPPORT_LINKS: Record<string, RelatedSupportLink[]> = {
  'modern-portable-office-solutions': [
    { href: '/sleek-prefab-office-cabins-ncr', label: 'prefab office cabins in NCR' },
    { href: '/low-cost-modular-office-solutions', label: 'low-cost modular office options' },
    { href: '/budget-friendly-office-workspace-alternatives', label: 'budget-friendly office workspace ideas' },
    { href: '/product/portable-office', label: 'SAMAN portable office range' },
  ],
  'sleek-prefab-office-cabins-ncr': [
    { href: '/modern-portable-office-solutions', label: 'modern portable office solutions' },
    { href: '/portable-office-cabin-manufacturers-in-bangalore', label: 'portable office cabin manufacturers in Bangalore' },
    { href: '/discount-mobile-office-units', label: 'discount mobile office units' },
    { href: '/product-category/portable-office', label: 'portable office category' },
  ],
  'low-cost-modular-office-solutions': [
    { href: '/budget-friendly-office-workspace-alternatives', label: 'budget-friendly office workspace alternatives' },
    { href: '/discount-mobile-office-units', label: 'discount mobile office units' },
    { href: '/modern-portable-office-solutions', label: 'modern portable office solutions' },
    { href: '/product/portable-office', label: 'portable office product range' },
  ],
  'budget-friendly-office-workspace-alternatives': [
    { href: '/low-cost-modular-office-solutions', label: 'low-cost modular office solutions' },
    { href: '/discount-mobile-office-units', label: 'discount mobile office units' },
    { href: '/cheap-office-trailers-for-sale', label: 'cheap office trailers for sale' },
    { href: '/product-category/portable-office', label: 'portable office category' },
  ],
  'discount-mobile-office-units': [
    { href: '/budget-friendly-office-workspace-alternatives', label: 'budget-friendly office workspace ideas' },
    { href: '/cheap-office-trailers-for-sale', label: 'cheap office trailers for sale' },
    { href: '/modern-portable-office-solutions', label: 'modern portable office options' },
    { href: '/product/portable-office', label: 'portable office units from SAMAN' },
  ],
  'cheap-office-trailers-for-sale': [
    { href: '/budget-friendly-office-workspace-alternatives', label: 'budget-friendly office workspace alternatives' },
    { href: '/discount-mobile-office-units', label: 'discount mobile office units' },
    { href: '/low-cost-modular-office-solutions', label: 'low-cost modular office solutions' },
    { href: '/product/portable-office', label: 'portable office product range' },
  ],
  'portable-office-cabin-manufacturers-in-bangalore': [
    { href: '/modern-portable-office-solutions', label: 'modern portable office solutions' },
    { href: '/sleek-prefab-office-cabins-ncr', label: 'prefab office cabins in NCR' },
    { href: '/low-cost-modular-office-solutions', label: 'low-cost modular office options' },
    { href: '/product-category/portable-office', label: 'portable office category' },
  ],
};

const PORTABLE_CABIN_GUIDE_LINKS: Record<string, RelatedSupportLink[]> = {
  '18-benefits-of-luxury-portable-cabin': [
    { href: '/7-tips-for-choosing-the-perfect-portable-cabin-location', label: 'portable cabin location tips' },
    { href: '/porta-cabin-office-price', label: 'porta cabin office price guide' },
    { href: '/prefab-porta-cabins', label: 'prefab porta cabin options' },
    { href: '/product/portable-cabin', label: 'SAMAN portable cabin range' },
  ],
  '7-tips-for-choosing-the-perfect-portable-cabin-location': [
    { href: '/18-benefits-of-luxury-portable-cabin', label: 'luxury portable cabin benefits' },
    { href: '/world-of-customized-porta-cabin', label: 'customized porta cabin ideas' },
    { href: '/prefab-porta-cabins', label: 'prefab porta cabins' },
    { href: '/product-category/portable-cabin', label: 'portable cabin category' },
  ],
  'porta-cabin-office-price': [
    { href: '/prefab-porta-cabins', label: 'prefab porta cabin options' },
    { href: '/world-of-customized-porta-cabin', label: 'customized porta cabin guide' },
    { href: '/18-benefits-of-luxury-portable-cabin', label: 'luxury portable cabin benefits' },
    { href: '/product/portable-cabin', label: 'portable cabin product range' },
  ],
  'prefab-porta-cabins': [
    { href: '/porta-cabin-office-price', label: 'porta cabin office price guide' },
    { href: '/world-of-customized-porta-cabin', label: 'customized porta cabin options' },
    { href: '/7-tips-for-choosing-the-perfect-portable-cabin-location', label: 'portable cabin location tips' },
    { href: '/product-category/portable-cabin', label: 'portable cabin category' },
  ],
  'world-of-customized-porta-cabin': [
    { href: '/prefab-porta-cabins', label: 'prefab porta cabins' },
    { href: '/porta-cabin-office-price', label: 'porta cabin office price guide' },
    { href: '/18-benefits-of-luxury-portable-cabin', label: 'luxury portable cabin benefits' },
    { href: '/product/portable-cabin', label: 'custom portable cabin range' },
  ],
};

const CONTAINER_CAFE_SUPPORT_LINKS: Record<string, RelatedSupportLink[]> = {
  'best-container-cafe-designs-for-experience': [
    { href: '/product/container-cafe', label: 'SAMAN container cafe range' },
    { href: '/product-category/container-cafe', label: 'container cafe category' },
    { href: '/container-cafes-in-noida', label: 'container cafe options in Noida' },
    { href: '/container-cafes-in-gurgaon', label: 'container cafe options in Gurgaon' },
  ],
};

const PREFAB_CONSTRUCTION_SUPPORT_LINKS: Record<string, RelatedSupportLink[]> = {
  'customized-prefab-structures-ncr': [
    { href: '/material-specifications-features', label: 'prefab material specifications' },
    { href: '/sustainable-construction', label: 'sustainable construction methods' },
    { href: '/peb-structure-cost-per-sq-ft-india', label: 'PEB structure cost guide' },
    { href: '/product/peb-constructions', label: 'PEB construction solutions' },
  ],
  'peb-structure-cost-per-sq-ft-india': [
    { href: '/customized-prefab-structures-ncr', label: 'customized prefab structures in NCR' },
    { href: '/material-specifications-features', label: 'material specifications and features' },
    { href: '/sustainable-construction', label: 'sustainable construction guide' },
    { href: '/product/pre-engineered-buildings', label: 'pre-engineered building range' },
  ],
  'material-specifications-features': [
    { href: '/customized-prefab-structures-ncr', label: 'customized prefab structures' },
    { href: '/peb-structure-cost-per-sq-ft-india', label: 'PEB structure cost guide' },
    { href: '/sustainable-construction', label: 'sustainable construction methods' },
    { href: '/product/industrial-sheds', label: 'industrial shed solutions' },
  ],
  'sustainable-construction': [
    { href: '/material-specifications-features', label: 'material specifications and features' },
    { href: '/customized-prefab-structures-ncr', label: 'customized prefab structures in NCR' },
    { href: '/peb-structure-cost-per-sq-ft-india', label: 'PEB cost planning guide' },
    { href: '/product/pre-engineered-buildings', label: 'pre-engineered building solutions' },
  ],
  'what-is-a-labour-hutment': [
    { href: '/material-specifications-features', label: 'portable structure material details' },
    { href: '/sustainable-construction', label: 'sustainable construction methods' },
    { href: '/customized-prefab-structures-ncr', label: 'customized prefab structures' },
    { href: '/product/labor-colony', label: 'labour colony product range' },
  ],
};

const SHELTER_SHED_SUPPORT_LINKS: Record<string, RelatedSupportLink[]> = {
  'temporary-garage-shelter': [
    { href: '/temporary-garden-shed', label: 'temporary garden shed options' },
    { href: '/portable-carports', label: 'portable carport solutions' },
    { href: '/product/industrial-sheds', label: 'industrial shed product range' },
    { href: '/product-category/industrial-sheds', label: 'industrial sheds category' },
  ],
  'temporary-garden-shed': [
    { href: '/temporary-garage-shelter', label: 'temporary garage shelter options' },
    { href: '/portable-carports', label: 'portable carport solutions' },
    { href: '/product/industrial-sheds', label: 'storage and industrial shed range' },
    { href: '/product-category/industrial-sheds', label: 'industrial sheds category' },
  ],
  'portable-carports': [
    { href: '/temporary-garage-shelter', label: 'temporary garage shelter options' },
    { href: '/temporary-garden-shed', label: 'temporary garden shed options' },
    { href: '/product/industrial-sheds', label: 'industrial shed product range' },
    { href: '/product-category/industrial-sheds', label: 'industrial sheds category' },
  ],
};

const RelatedSupportResources = ({
  slug,
  linksBySlug,
  title,
  sectionId,
}: {
  slug: string;
  linksBySlug: Record<string, RelatedSupportLink[]>;
  title: string;
  sectionId: string;
}) => {
  const links = linksBySlug[slug];
  if (!links?.length) return null;

  const currentPath = `/${slug}`;
  const visibleLinks = links.filter((link) => link.href !== currentPath);

  return (
    <section className="mt-10 rounded-lg border border-indigo-100 bg-indigo-50/50 p-5 sm:p-6" aria-labelledby={sectionId}>
      <h2 id={sectionId} className="text-xl font-semibold text-slate-900 mb-4">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleLinks.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md border border-indigo-100 bg-white px-4 py-3 text-sm font-medium text-[#0A3D2A] transition-colors hover:border-indigo-300 hover:bg-indigo-50">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};
// City/geo landing pages that emit the lean 3-node city graph (Organization +
// BreadcrumbList + FAQPage) instead of the default multi-node blog graph.
// Allowlisted per slug so no other blog post's schema is affected.
const CITY_PAGE_SCHEMA_SLUGS = new Set([
  'porta-cabin-in-hyderabad',
  'porta-cabin-in-chennai',
  'porta-cabin-in-kochi',
  'porta-cabin-in-coimbatore',
  'porta-cabin-in-mysore',
  'porta-cabin-in-vijayawada',
  'porta-cabin-in-visakhapatnam',
  'porta-cabin-in-madurai',
  'porta-cabin-in-mangalore',
  'porta-cabin-in-lucknow',
  'porta-cabin-in-mumbai',
  'porta-cabin-in-ahmedabad',
  'porta-cabin-in-kolkata',
  'porta-cabin-in-jaipur',
  'porta-cabin-in-kanpur',
  'porta-cabin-in-chandigarh',
  'porta-cabin-in-pune',
  'porta-cabin-in-surat',
  'porta-cabin-in-nashik',
  'porta-cabin-in-vadodara',
  'porta-cabin-in-nagpur',
  'porta-cabin-in-rajkot',
  'porta-cabin-in-patna',
  'porta-cabin-in-bhubaneswar',
  'porta-cabin-in-raipur',
  'porta-cabin-in-bhopal',
  'porta-cabin-in-ranchi',
  'porta-cabin-in-guwahati',
  'porta-cabin-in-dehradun',
  'porta-cabin-in-gwalior',
  'porta-cabin-in-indore',
  'porta-cabin-in-manesar',
  'porta-cabin-in-bhiwadi',
  'porta-cabin-in-sonipat',
  'porta-cabin-in-panipat',
  'porta-cabin-in-rourkela',
  'porta-cabin-in-durgapur',
  'porta-cabin-in-jamshedpur',
  'porta-cabin-in-hosur',
  'porta-cabin-in-salem',
  'porta-cabin-in-hubli',
  'porta-cabin-in-tumkur',
  'porta-cabin-in-belgaum',
  'porta-cabin-in-tirupur',
  'porta-cabin-in-aurangabad',
  // C3 Container Office city pages (Container Offices hub breadcrumb, not Porta Cabins)
  'container-office-in-bangalore',
  'container-office-in-chennai',
  'container-office-in-hyderabad',
  'container-office-in-mumbai',
  'container-office-in-delhi',
  'container-office-in-jaipur',
  'container-office-in-pune',
  'container-office-in-lucknow',
  'container-office-in-ahmedabad',
  'container-office-in-kolkata',
  'container-office-in-kochi',
  'container-office-in-mysore',
  'container-office-in-visakhapatnam',
  'container-office-in-vijayawada',
  'container-office-in-mangalore',
  'container-office-in-coimbatore',
  'container-office-in-penukonda',
  'container-office-in-ballari',
  'container-office-in-nellore',
  'container-office-in-warangal',
  'container-office-in-trichy',
  'container-office-in-tirupur',
  'container-office-in-tirupati',
  'container-office-in-sri-city',

  'container-office-in-madurai',
  'container-office-in-surat',
  'container-office-in-indore',
  'container-office-in-nagpur',
  'container-office-in-vadodara',
  'container-office-in-meerut',
  'container-office-in-kanpur',
  'container-office-in-chandigarh',
  'container-office-in-ludhiana',
  'container-office-in-ankleshwar',
  'container-office-in-dahej',
  'container-office-in-morbi',
  'container-office-in-mundra',
  'container-office-in-haridwar',
  'container-office-in-rudrapur',
  'container-office-in-kashipur',
  'container-office-in-agra',
  'container-office-in-neemrana',
  'container-office-in-bawal',
  'container-office-in-jalandhar',
  'container-office-in-moradabad',
]);

// Container-office (C3) city pages: same lean 3-node graph as the porta-cabin
// city pages, but the breadcrumb hub is "Container Offices", not "Porta Cabins".
const CONTAINER_OFFICE_CITY_SLUGS = new Set([
  'container-office-in-bangalore',
  'container-office-in-chennai',
  'container-office-in-hyderabad',
  'container-office-in-mumbai',
  'container-office-in-delhi',
  'container-office-in-jaipur',
  'container-office-in-pune',
  'container-office-in-lucknow',
  'container-office-in-ahmedabad',
  'container-office-in-kolkata',
  'container-office-in-kochi',
  'container-office-in-mysore',
  'container-office-in-visakhapatnam',
  'container-office-in-vijayawada',
  'container-office-in-mangalore',
  'container-office-in-coimbatore',
  'container-office-in-penukonda',
  'container-office-in-ballari',
  'container-office-in-nellore',
  'container-office-in-warangal',
  'container-office-in-trichy',
  'container-office-in-tirupur',
  'container-office-in-tirupati',
  'container-office-in-sri-city',

  'container-office-in-madurai',
  'container-office-in-surat',
  'container-office-in-indore',
  'container-office-in-nagpur',
  'container-office-in-vadodara',
  'container-office-in-meerut',
  'container-office-in-kanpur',
  'container-office-in-chandigarh',
  'container-office-in-ludhiana',
  'container-office-in-ankleshwar',
  'container-office-in-dahej',
  'container-office-in-morbi',
  'container-office-in-mundra',
  'container-office-in-haridwar',
  'container-office-in-rudrapur',
  'container-office-in-kashipur',
  'container-office-in-agra',
  'container-office-in-neemrana',
  'container-office-in-bawal',
  'container-office-in-jalandhar',
  'container-office-in-moradabad',
]);

// City pages served from the North (Greater Noida) factory: their Organization
// contactPoint uses the North sales number instead of the South default.
const NORTH_CITY_PAGE_SLUGS = new Set([
  'porta-cabin-in-lucknow',
  'porta-cabin-in-mumbai',
  'porta-cabin-in-ahmedabad',
  'porta-cabin-in-kolkata',
  'porta-cabin-in-jaipur',
  'porta-cabin-in-kanpur',
  'porta-cabin-in-chandigarh',
  'porta-cabin-in-pune',
  'porta-cabin-in-surat',
  'porta-cabin-in-nashik',
  'porta-cabin-in-vadodara',
  'porta-cabin-in-nagpur',
  'porta-cabin-in-patna',
  'porta-cabin-in-rajkot',
  'porta-cabin-in-bhubaneswar',
  'porta-cabin-in-raipur',
  'porta-cabin-in-bhopal',
  'porta-cabin-in-ranchi',
  'porta-cabin-in-guwahati',
  'porta-cabin-in-dehradun',
  'porta-cabin-in-gwalior',
  'porta-cabin-in-indore',
  'porta-cabin-in-manesar',
  'porta-cabin-in-bhiwadi',
  'porta-cabin-in-sonipat',
  'porta-cabin-in-panipat',
  'porta-cabin-in-rourkela',
  'porta-cabin-in-durgapur',
  'porta-cabin-in-jamshedpur',
  'porta-cabin-in-aurangabad',
  'container-office-in-mumbai',
  'container-office-in-delhi',
  'container-office-in-jaipur',
  'container-office-in-pune',
  'container-office-in-lucknow',
  'container-office-in-ahmedabad',
  'container-office-in-kolkata',
  'container-office-in-surat',
  'container-office-in-indore',
  'container-office-in-nagpur',
  'container-office-in-vadodara',
  'container-office-in-meerut',
  'container-office-in-kanpur',
  'container-office-in-chandigarh',
  'container-office-in-ludhiana',
  'container-office-in-ankleshwar',
  'container-office-in-dahej',
  'container-office-in-morbi',
  'container-office-in-mundra',
  'container-office-in-haridwar',
  'container-office-in-rudrapur',
  'container-office-in-kashipur',
  'container-office-in-agra',
  'container-office-in-neemrana',
  'container-office-in-bawal',
  'container-office-in-jalandhar',
  'container-office-in-moradabad',
]);

export const getServerSideProps: GetServerSideProps<BlogPostProps> = async ({ params, res }) => {
  try {
    const slug = params?.slug as string;
    
    if (!slug) {
      return {
        notFound: true,
      };
    }

    // Check if slug is numeric-only (should be handled by middleware, but as fallback)
    if (/^\d+$/.test(slug)) {
      return {
        redirect: {
          destination: '/410',
          permanent: false,
        },
      };
    }

    // Check if this is a reserved route (avoid conflicts with other pages)
    const reservedRoutes = [
      'product', 'blog', 'about-us', 'gallery', 'rental-services', 
      'privacy-policy', 'terms-and-conditions', 'delivery-policy', 
      'refund-and-return-policy', 'contact', 'cart', 'checkout'
    ];
    
    if (reservedRoutes.includes(slug)) {
      return {
        notFound: true,
      };
    }

    // Static content layer: reads the exported post file — no WordPress call.
    // Server-only module, loaded dynamically so fs never reaches the client bundle.
    const staticContent = await import('../lib/staticContent');
    const post = await staticContent.fetchBlogPost(slug);

    if (!post) {
      return {
        notFound: true,
      };
    }

    // ─── SSR Content Normalisation ──────────────────────────────────────────
    // Runs server-side so the initial HTML sent to browsers and search engine
    // crawlers is already clean — before any client-side JavaScript executes.
    //
    // Rule 1: Replace blog subdomain hrefs with the canonical frontend domain.
    //   href="https://blog.samanportable.com/[path]"
    //   → href="https://www.samanportable.com/[path]"
    //   Images (src=) are intentionally left unchanged — they must continue to
    //   resolve against the WordPress media library host.
    //   EXCEPTION: media asset links under /wp-content/ (click-to-enlarge full-size
    //   <a href="blog…/wp-content/…jpg">) are NOT rewritten — the static www site does
    //   not host /wp-content/, so rewriting them to www would 404 (Semrush "internal
    //   images are broken"). They must stay on the blog origin that serves the files.
    //
    // Rule 2: Strip ?utm_source=chatgpt.com ONLY from internal samanportable.com
    //   links. External URLs (grandviewresearch.com, willscot.com, etc.) are not
    //   touched.
    function normaliseContent(html: string): string {
      if (!html) return html;

      // Rule 1 — subdomain href rewrite (href only, not src), skipping /wp-content/ media links
      let cleaned = html.replace(
        /(<a[^>]*\s)href="https?:\/\/blog\.samanportable\.com\/((?!wp-content\/)[^"]*)"/gi,
        '$1href="https://www.samanportable.com/$2"'
      );

      // Rule 2 — strip utm_source=chatgpt.com from internal links only
      cleaned = cleaned.replace(
        /(href="https?:\/\/(?:www\.)?samanportable\.com\/[^"]*)\?utm_source=chatgpt\.com([^"]*")/gi,
        '$1$2'
      );

      return cleaned;
    }

    post.content.rendered  = normaliseContent(post.content.rendered);
    post.excerpt.rendered  = normaliseContent(post.excerpt.rendered);
    if (CONTENT_H1_DEMOTION_SLUGS.has(slug)) {
      post.content.rendered = demoteHtmlH1ToH2(post.content.rendered);
    }
    // ────────────────────────────────────────────────────────────────────────

    // Fetch Rank Math SEO data with fallback
    let rankMathSEO: RankMathSEOData | null = null;
    try {
      rankMathSEO = await staticContent.fetchBlogPostRankMathSEO(slug);
      
      // If RankMath data is empty or incomplete, create fallback SEO data
      if (!rankMathSEO || Object.keys(rankMathSEO).length === 0) {
        rankMathSEO = {
          title: decodeHtmlEntities(post.title.rendered) + ' - Saman Portable',
          description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
          canonical: `https://www.samanportable.com/${slug}`,
          og_title: decodeHtmlEntities(post.title.rendered),
          og_description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
          og_image: post.featured_media_url || 'https://www.samanportable.com/og-image.svg',
          og_locale: 'en_US',
          twitter_title: decodeHtmlEntities(post.title.rendered),
          twitter_description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
          twitter_image: post.featured_media_url || 'https://www.samanportable.com/og-image.svg',
          robots: { index: 'index', follow: 'follow' }
        };
      }
    } catch (error) {
      console.warn('Failed to fetch Rank Math SEO data:', error);
      // Create fallback SEO data
      rankMathSEO = {
        title: decodeHtmlEntities(post.title.rendered) + ' - Saman Portable',
        description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
        canonical: `https://www.samanportable.com/${slug}`,
        og_title: decodeHtmlEntities(post.title.rendered),
        og_description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
        og_image: post.featured_media_url || 'https://www.samanportable.com/og-image.svg',
        og_locale: 'en_US',
        twitter_title: decodeHtmlEntities(post.title.rendered),
        twitter_description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
        twitter_image: post.featured_media_url || 'https://www.samanportable.com/og-image.svg',
        robots: { index: 'index', follow: 'follow' }
      };
    }

    // Slug-specific fix: override RankMath og/twitter image ONLY when it points to
    // the broken WordPress featured image (or is missing), for this one slug.
    // RankMath has highest priority in UnifiedSEO, so this must run here.
    const metadataImageOverride = METADATA_IMAGE_OVERRIDES[slug];
    if (metadataImageOverride && rankMathSEO) {
      if (!rankMathSEO.og_image || rankMathSEO.og_image.includes(BROKEN_WP_IMAGE_MARKER)) {
        rankMathSEO.og_image = metadataImageOverride;
      }
      if (!rankMathSEO.twitter_image || rankMathSEO.twitter_image.includes(BROKEN_WP_IMAGE_MARKER)) {
        rankMathSEO.twitter_image = metadataImageOverride;
      }
    }

    const seoTitleOverride = SEO_TITLE_OVERRIDES[slug];
    if (seoTitleOverride) {
      rankMathSEO = {
        ...(rankMathSEO || {}),
        title: seoTitleOverride,
        og_title: seoTitleOverride,
        twitter_title: seoTitleOverride,
      };
    }

    // Public marketing page with no per-user data — safe to edge-cache. Set only
    // on the success path so the 404s/redirects above keep Next's default no-store
    // and newly-published URLs are never cache-poisoned.
    setPublicEdgeCache(res);

    return {
      props: {
        post,
        slug,
        rankMathSEO,
      },
    };
  } catch (error) {
    // A transient backend failure (network/timeout/5xx/429, surfaced as
    // BackendFetchError by fetchBlogPost) must NOT become a false 404 — that would
    // deindex a real post. Re-throw so Next returns HTTP 500 (retryable by Google)
    // instead of notFound. A GENUINE missing post is handled above (post === null →
    // notFound) and only happens when the backend responded successfully.
    // Only the error message is logged (no request URL), so no secrets are exposed.
    console.error(
      'Blog post SSR failed — returning 5xx, not 404:',
      error instanceof Error ? error.message : 'unknown error'
    );
    throw error instanceof Error ? error : new Error('Failed to render blog post');
  }
};

const BlogPostPage = ({ post, slug, rankMathSEO }: BlogPostProps) => {
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);



  if (!post) {
    return (
      <>
        <main className="section-padding bg-background">
          <div className="max-w-7xl mx-auto container-padding text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground">Blog post not found</h1>
          </div>
        </main>
      </>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get featured image
  const getFeaturedImage = () => {
    // Slug-specific override: this post's WordPress featured image
    // (a blog.samanportable.com upload) returns 404, so serve a valid local image.
    const featuredImageOverrides: Record<string, string> = {
      'best-porta-cabin-supplier': '/container-office-by-saman-1.webp',
    };
    if (featuredImageOverrides[slug]) {
      return featuredImageOverrides[slug];
    }
    if (post._embedded?.['wp:featuredmedia']?.[0]) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    // Fallback when a post has no featured image. Use a valid local raster image
    // instead of /placeholder.svg, which fails Next/Image optimization (HTTP 400).
    return '/hero-image/premium-container-site-office-rental.webp';
  };

  // Get author info
  const getAuthor = () => {
    if (post._embedded?.author?.[0]) {
      return post._embedded.author[0];
    }
    return null;
  };

  const author = getAuthor();
  const featuredImage = getFeaturedImage();

  // HTML Parser Options for semantic rendering
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name) {
        // Handle headings with proper Tailwind classes
        if (domNode.name === 'h1') {
          return (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 mt-8 mb-4">
              {domToReact(domNode.children as any, parserOptions)}
            </h2>
          );
        }
        if (domNode.name === 'h2') {
          return (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 mt-6 sm:mt-10 mb-3 sm:mb-5 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h2>
          );
        }
        if (domNode.name === 'h3') {
          return (
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-700 mt-5 sm:mt-8 mb-2 sm:mb-4 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h3>
          );
        }
        if (domNode.name === 'h4') {
          return (
            <h4 className="text-lg font-semibold text-slate-700 mt-6 mb-3 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h4>
          );
        }
        if (domNode.name === 'h5') {
          return (
            <h5 className="text-base font-semibold text-slate-700 mt-5 mb-2 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h5>
          );
        }
        if (domNode.name === 'h6') {
          return (
            <h6 className="text-sm font-semibold text-slate-700 mt-4 mb-2 leading-tight">
              {domToReact(domNode.children as any, parserOptions)}
            </h6>
          );
        }

        // Handle paragraphs with proper spacing
        if (domNode.name === 'p') {
          return (
            <p className="text-slate-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              {domToReact(domNode.children as any, parserOptions)}
            </p>
          );
        }

        // Handle tables with responsive styling
        if (domNode.name === 'table') {
          return (
            <div className="overflow-x-auto my-8 border border-slate-200 rounded-lg shadow-sm">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden border border-slate-200 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-200">
                    {domToReact(domNode.children as any, parserOptions)}
                  </table>
                </div>
              </div>
            </div>
          );
        }

        // Handle table headers
        if (domNode.name === 'thead') {
          return (
            <thead className="bg-gradient-to-r from-slate-50 to-green-50">
              {domToReact(domNode.children as any, parserOptions)}
            </thead>
          );
        }

        // Handle table header cells
        if (domNode.name === 'th') {
          return (
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b border-slate-200">
              {domToReact(domNode.children as any, parserOptions)}
            </th>
          );
        }

        // Handle table body
        if (domNode.name === 'tbody') {
          return (
            <tbody className="bg-white divide-y divide-slate-200">
              {domToReact(domNode.children as any, parserOptions)}
            </tbody>
          );
        }

        // Handle table rows
        if (domNode.name === 'tr') {
          return (
            <tr className="hover:bg-slate-50 transition-colors duration-150">
              {domToReact(domNode.children as any, parserOptions)}
            </tr>
          );
        }

        // Handle table data cells
        if (domNode.name === 'td') {
          return (
            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-900 border-b border-slate-100 break-words">
              {domToReact(domNode.children as any, parserOptions)}
            </td>
          );
        }

        // Handle unordered lists
        if (domNode.name === 'ul') {
          return (
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-slate-700 pl-4 sm:pl-6 text-sm sm:text-base">
              {domToReact(domNode.children as any, parserOptions)}
            </ul>
          );
        }

        // Handle ordered lists
        if (domNode.name === 'ol') {
          return (
            <ol className="list-decimal list-inside space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-slate-700 pl-4 sm:pl-6 text-sm sm:text-base">
              {domToReact(domNode.children as any, parserOptions)}
            </ol>
          );
        }

        // Handle list items
        if (domNode.name === 'li') {
          return (
            <li className="text-slate-700 leading-relaxed">
              {domToReact(domNode.children as any, parserOptions)}
            </li>
          );
        }

        // Handle blockquotes
        if (domNode.name === 'blockquote') {
          return (
            <blockquote className="border-l-4 border-[#0A3D2A] pl-4 sm:pl-6 py-3 sm:py-4 my-4 sm:my-6 bg-[#0A3D2A]/10 rounded-r-lg">
              <p className="text-slate-700 italic text-base sm:text-lg">
                {domToReact(domNode.children as any, parserOptions)}
              </p>
            </blockquote>
          );
        }

        // Handle strong/bold text
        if (domNode.name === 'strong' || domNode.name === 'b') {
          return (
            <strong className="font-semibold text-slate-900">
              {domToReact(domNode.children as any, parserOptions)}
            </strong>
          );
        }

        // Handle emphasis/italic text
        if (domNode.name === 'em' || domNode.name === 'i') {
          return (
            <em className="italic text-slate-800">
              {domToReact(domNode.children as any, parserOptions)}
            </em>
          );
        }

                 // Handle links
         if (domNode.name === 'a') {
           const href = domNode.attribs?.href || '#';
           return (
             <a 
               href={href}
               className="text-green-600 hover:text-green-800 underline decoration-green-400 hover:decoration-green-600 transition-colors duration-200"
               target="_blank"
               rel="noopener noreferrer"
             >
               {domToReact(domNode.children as any, parserOptions)}
             </a>
           );
         }

        // Handle images
        if (domNode.name === 'img') {
          const src = domNode.attribs?.src || '';
          const alt = domNode.attribs?.alt || '';
          const className = domNode.attribs?.class || '';
          
          // Check if image has alignment classes
          const isAlignedLeft = className.includes('alignleft');
          const isAlignedRight = className.includes('alignright');
          const isAlignedCenter = className.includes('aligncenter');
          
          // Determine container classes based on alignment
          let containerClasses = "my-4 sm:my-8 text-center";
          if (isAlignedLeft) containerClasses = "my-4 sm:my-8 float-left mr-4 mb-4";
          if (isAlignedRight) containerClasses = "my-4 sm:my-8 float-right ml-4 mb-4";
          if (isAlignedCenter) containerClasses = "my-4 sm:my-8 text-center clear-both";
          
          return (
            <div className={containerClasses}>
              <Image 
                src={src} 
                alt={alt}
                width={800}
                height={600}
                className="max-w-full h-auto rounded-lg shadow-lg border border-slate-200 mx-auto responsive-img"
                loading="lazy"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
              {alt && (
                <p className="text-xs sm:text-sm text-slate-500 mt-2 italic px-4">{alt}</p>
              )}
            </div>
          );
        }

        // Handle code blocks
        if (domNode.name === 'pre') {
          return (
            <pre className="bg-slate-900 text-slate-100 p-3 sm:p-4 rounded-lg overflow-x-auto my-4 sm:my-6 text-xs sm:text-sm font-mono">
              {domToReact(domNode.children as any, parserOptions)}
            </pre>
          );
        }

        // Handle inline code
        if (domNode.name === 'code') {
          return (
            <code className="bg-slate-100 text-slate-800 px-1 sm:px-2 py-1 rounded text-xs sm:text-sm font-mono">
              {domToReact(domNode.children as any, parserOptions)}
            </code>
          );
        }

        // Handle horizontal rules
        if (domNode.name === 'hr') {
          return (
            <hr className="my-6 sm:my-8 border-t border-slate-200" />
          );
        }

        // Handle WordPress specific blocks
        if (domNode.name === 'div' && domNode.attribs?.class?.includes('wp-block')) {
          return (
            <div className="my-4 sm:my-6">
              {domToReact(domNode.children as any, parserOptions)}
            </div>
          );
        }
      }
      return undefined;
    }
  };



  const handleShare = () => {
    if (!isClient) return;
    
    if (navigator.share) {
      navigator.share({
        title: decodeHtmlEntities(post.title.rendered),
        text: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '')),
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Layout>
      {/* Unified SEO - Single source of truth for all meta tags */}
      <UnifiedSEO 
        rankMathSEO={rankMathSEO} 
        fallbackCanonical={`https://www.samanportable.com/${slug}`}
        fallbackTitle={`${decodeHtmlEntities(post?.title?.rendered || 'Blog Post')} - Saman Portable`}
        fallbackDescription={decodeHtmlEntities(post?.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Read our latest blog post at Saman Portable.')}
        fallbackOgImage={METADATA_IMAGE_OVERRIDES[slug] || post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://www.samanportable.com/og-image.svg'}
        keywords={`blog, portable office, container office, prefab solutions, ${post?._embedded?.['wp:term']?.[0]?.[0]?.name || ''}`}
        structuredData={(() => {
          if (!post) return undefined;

          // City/geo landing pages: emit exactly three schemas
          // (Organization + BreadcrumbList + FAQPage), no LocalBusiness/Product.
          if (CITY_PAGE_SCHEMA_SLUGS.has(slug)) {
            return getCityPageGraph({
              url: `https://www.samanportable.com/${slug}`,
              breadcrumbs: [
                { name: 'Home', url: 'https://www.samanportable.com/' },
                CONTAINER_OFFICE_CITY_SLUGS.has(slug)
                  ? { name: 'Container Offices', url: 'https://www.samanportable.com/product-category/container-offices' }
                  : { name: 'Porta Cabins', url: 'https://www.samanportable.com/product-category/porta-cabins' },
                { name: decodeHtmlEntities(post.title.rendered), url: `https://www.samanportable.com/${slug}` },
              ],
              faqSchema: getFAQSchemaOverride(slug) || extractFAQSchema(post.content.rendered),
              contactTelephone: NORTH_CITY_PAGE_SLUGS.has(slug)
                ? ['+91 87960 39938', '+91 97089 89937']
                : ['container-office-in-trichy', 'container-office-in-tirupur', 'container-office-in-tirupati', 'container-office-in-sri-city'].includes(slug)
                  ? ['+91 88616 22859', '+91 80886 85440']
                  : undefined,
            });
          }

          const isOrgAuthor = !post._embedded?.author?.[0]?.name || post._embedded?.author?.[0]?.name === 'Saman Portable';

          return generateUnifiedBlogGraph({
            postSchema: {
              title: decodeHtmlEntities(post.title.rendered),
              description: decodeHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)),
              image: METADATA_IMAGE_OVERRIDES[slug] || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://www.samanportable.com/default-blog-image.jpg',
              author: post._embedded?.author?.[0]?.name || 'Saman Portable',
              authorUrl: isOrgAuthor ? undefined : 'https://www.samanportable.com/about-us',
              datePublished: post.date,
              dateModified: post.modified,
              url: `https://www.samanportable.com/${slug}`,
              category: post._embedded?.['wp:term']?.[0]?.[0]?.name
            },
            breadcrumbs: [
              { name: 'Home', url: 'https://www.samanportable.com/' },
              { name: 'Blog', url: 'https://www.samanportable.com/blog' },
              { name: decodeHtmlEntities(post.title.rendered), url: `https://www.samanportable.com/${slug}` }
            ],
            faqSchema: getFAQSchemaOverride(slug) || extractFAQSchema(post.content.rendered),
            serviceSchema: getCityServiceSchema({
              slug,
              description: post.excerpt.rendered,
              image: METADATA_IMAGE_OVERRIDES[slug] || post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
              url: `https://www.samanportable.com/${slug}`,
            })
          });
        })()}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-10">
                         <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition-all duration-200 font-medium group">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/blog" className="text-slate-600 hover:text-green-600 transition-all duration-200 font-medium">
              Blog
            </Link>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-800 font-semibold line-clamp-1 max-w-xs">{decodeHtmlEntities(post.title.rendered)}</span>
          </nav>

          {/* Back Button */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="outline" size="sm" className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-[#0A3D2A]/30 hover:bg-[#0A3D2A]/10 text-slate-700 hover:text-[#0A3D2A] transition-all duration-300 shadow-sm hover:shadow-md rounded-xl">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Blog</span>
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <article className="mb-16">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
                {decodeHtmlEntities(post.title.rendered)}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {author && (
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1 font-medium uppercase tracking-wide">Author</span>
                    <span className="text-lg font-semibold text-slate-800">{author.name}</span>
                  </div>
                </div>
              )}
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1 font-medium uppercase tracking-wide">Published</span>
                  <span className="text-lg font-semibold text-slate-800">{formatDate(post.date)}</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1 font-medium uppercase tracking-wide">Updated</span>
                  <span className="text-lg font-semibold text-slate-800">{formatDate(post.modified)}</span>
                </div>
              </div>
            </div>

            {/* Featured Image — suppressed for city/geo landing pages, which carry
                their hero as the first in-body content image (eager LCP) instead, so
                the template block does not duplicate it or show a wrong fallback. */}
            {featuredImage && !CITY_PAGE_SCHEMA_SLUGS.has(slug) && (
              <div className="mb-12">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                  <Image
                    src={featuredImage}
                    alt={decodeHtmlEntities(post.title.rendered)}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-white text-sm font-medium">Featured Image</div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            {post._embedded?.['wp:term']?.[0] && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Tag className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-lg font-semibold text-slate-700">Categories</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {post._embedded['wp:term'][0].map((category: any) => (
                    <Link key={category.id} href={`/blog?category=${category.slug}`}>
                      <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#0A3D2A]/10 to-[#0A3D2A]/20 hover:from-[#0A3D2A]/20 hover:to-[#0A3D2A]/30 text-[#0A3D2A] border border-[#0A3D2A]/20 hover:border-[#0A3D2A]/30 transition-all duration-300 rounded-full hover:scale-105 shadow-sm">
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

             

            {/* Blog Content - Direct rendering without LongformContent to avoid FAQ duplication */}
            <div className="mb-10">
              <OptimizedContent 
                content={post.content.rendered}
                className="prose prose-lg max-w-none text-lg text-slate-700 leading-relaxed space-y-6"
              />
            </div>

            <RelatedContainerCafeLocations slug={slug} />
            <RelatedLabourColonyLocations slug={slug} />
            <RelatedPortableOfficeLocations slug={slug} />
            <RelatedPortableCabinResources slug={slug} />
            <RelatedPortableCabinSupportResources slug={slug} />
            <RelatedContainerOfficeResources slug={slug} />
            <RelatedContainerOfficeNcrLocations slug={slug} />
            <RelatedSupportResources slug={slug} linksBySlug={PREFAB_HOME_SUPPORT_LINKS} title="Related Prefab Home Resources" sectionId="related-prefab-home-resources" />
            <RelatedSupportResources slug={slug} linksBySlug={PORTABLE_OFFICE_SUPPORT_LINKS} title="Related Portable Office Resources" sectionId="related-portable-office-support-resources" />
            <RelatedSupportResources slug={slug} linksBySlug={PORTABLE_CABIN_GUIDE_LINKS} title="Related Portable Cabin Guides" sectionId="related-portable-cabin-guides" />
            <RelatedSupportResources slug={slug} linksBySlug={CONTAINER_CAFE_SUPPORT_LINKS} title="Related Container Cafe Resources" sectionId="related-container-cafe-support-resources" />
            <RelatedSupportResources slug={slug} linksBySlug={PREFAB_CONSTRUCTION_SUPPORT_LINKS} title="Related Prefab Construction Resources" sectionId="related-prefab-construction-resources" />
            <RelatedSupportResources slug={slug} linksBySlug={SHELTER_SHED_SUPPORT_LINKS} title="Related Shelter and Shed Resources" sectionId="related-shelter-shed-resources" />
          </article>

          {/* Article Footer */}
          <Separator className="my-12" />
          
                     <div className="bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-8 rounded-3xl border border-slate-200 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Enjoyed this article?</h3>
              <p className="text-slate-600">Share it with others or explore more content</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                             {/* Share Button */}
               <Button 
                 variant="outline" 
                 onClick={handleShare}
                 className="group flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-700 hover:text-green-700 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl text-lg font-medium"
               >
                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Share Article</span>
              </Button>

                             {/* Back to Blog */}
               <Link href="/blog">
                 <Button variant="default" className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl text-lg font-medium">
                   <ArrowLeft className="w-5 h-5 mr-2" />
                   View All Posts
                 </Button>
               </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default BlogPostPage;
