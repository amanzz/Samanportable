import React from 'react';
import {
  ShieldCheck,
  Leaf,
  HardHat,
  Landmark,
  Receipt,
  Scale,
  FileText,
  ExternalLink,
} from 'lucide-react';
import {
  PROOF_CREDENTIALS,
  GOVERNANCE_CREDENTIALS,
  type Credential,
  type CredentialCategory,
} from '@/data/certifications';

const CATEGORY_ICON: Record<CredentialCategory, React.ComponentType<{ className?: string }>> = {
  quality: ShieldCheck,
  environment: Leaf,
  safety: HardHat,
  government: Landmark,
  tax: Receipt,
  governance: Scale,
};

const CredentialCard = ({ cert }: { cert: Credential }) => {
  const Icon = CATEGORY_ICON[cert.category] ?? FileText;
  return (
    <div className="flex flex-col bg-background rounded-xl p-6 shadow-sm border border-border/60 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground leading-tight">{cert.name}</h3>
          <p className="text-sm text-muted-foreground">{cert.scope}</p>
        </div>
      </div>

      <dl className="text-sm space-y-1 text-muted-foreground mb-4">
        <div className="flex gap-2">
          <dt className="font-semibold text-foreground/80 shrink-0">Issued by:</dt>
          <dd>{cert.issuer}</dd>
        </div>
        {cert.number && (
          <div className="flex gap-2">
            <dt className="font-semibold text-foreground/80 shrink-0">Reg. no.:</dt>
            <dd className="break-all">{cert.number}</dd>
          </div>
        )}
        {cert.validUntil && (
          <div className="flex gap-2">
            <dt className="font-semibold text-foreground/80 shrink-0">Valid until:</dt>
            <dd>{cert.validUntil}</dd>
          </div>
        )}
      </dl>

      <p className="text-sm text-foreground/90 leading-relaxed mb-5 flex-1">{cert.benefit}</p>

      {cert.publicPdf && cert.pdf ? (
        <a
          href={`/certifications/${cert.pdf}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-auto"
        >
          View {cert.name} certificate (PDF)
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      ) : (
        <span className="text-xs text-muted-foreground italic mt-auto">
          Document available from us on request.
        </span>
      )}
    </div>
  );
};

/**
 * Full "Certifications, Registrations and Manufacturer Proof" section for the
 * About page. This is the site's main certificate library: every credential as a
 * clean card, with a View-PDF link where a public-safe document exists. The
 * homepage and product pages link here rather than repeating the detail.
 */
const CertificationsSection = () => {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="section-padding bg-muted/30 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto container-padding">
        <div className="max-w-3xl mb-12">
          <h2
            id="certifications-heading"
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            Certifications, Registrations and Manufacturer Proof
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            These documents support SAMAN&apos;s manufacturing, quality, safety, environmental
            and government-registration credentials. They are issued to SAMAN POS India Private
            Limited, our registered manufacturing company.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROOF_CREDENTIALS.map((cert) => (
            <CredentialCard key={cert.key} cert={cert} />
          ))}
        </div>

        {GOVERNANCE_CREDENTIALS.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Business ethics &amp; governance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GOVERNANCE_CREDENTIALS.map((cert) => (
                <CredentialCard key={cert.key} cert={cert} />
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-10 max-w-3xl">
          Certificate and registration numbers shown are reproduced from the issued documents.
          Validity is subject to the periodic surveillance and renewal terms of each issuing body.
        </p>
      </div>
    </section>
  );
};

export default CertificationsSection;
