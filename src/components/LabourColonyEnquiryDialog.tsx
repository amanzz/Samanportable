import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2 } from 'lucide-react';
import { pushDataLayer, safeText } from '@/lib/analytics';

interface Props { isOpen: boolean; onClose: () => void; prefillMessage?: string }

const KEYS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'campaignid', 'adgroupid', 'creative', 'keyword', 'matchtype', 'device', 'network'] as const;
type Attribution = Partial<Record<typeof KEYS[number], string>> & { landingPage?: string; firstLandingPage?: string; leadSource?: string; marketingPlatform?: string };
const initial = { firstName: '', companyName: '', email: '', phone: '', projectLocation: '', industry: '', workerCapacity: '', requiredDate: '', configuration: '', requirementType: '', message: '', website: '' };
const industries = ['Construction Company', 'Civil Contractor', 'EPC Contractor', 'Builder or Real Estate Developer', 'Infrastructure Company', 'Mining Company', 'Steel, Cement or Power Company', 'Industrial Project Company', 'Highway, Railway or Metro Contractor', 'Solar or Renewable Energy Project', 'Project Management Consultant', 'Architect or Civil Consultant'];

function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  const query = new URLSearchParams(window.location.search);
  const values: Attribution = {};
  KEYS.forEach((key) => {
    const current = query.get(key);
    if (current) sessionStorage.setItem(`sp_${key}`, current);
    const value = current || sessionStorage.getItem(`sp_${key}`) || '';
    if (value) values[key] = value;
  });
  const landingPage = window.location.href;
  const firstLandingPage = sessionStorage.getItem('sp_first_landing_page') || landingPage;
  if (!sessionStorage.getItem('sp_first_landing_page')) sessionStorage.setItem('sp_first_landing_page', firstLandingPage);
  const google = Boolean(values.gclid || values.gbraid || values.wbraid || values.utm_source?.toLowerCase() === 'google');
  return { ...values, landingPage, firstLandingPage, leadSource: google ? 'Google Ads' : 'Website Enquiry', marketingPlatform: google ? 'Google Ads' : 'Website' };
}

const Field = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => <div className="space-y-1.5"><Label htmlFor={id}>{label}</Label>{children}</div>;
const selectClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

export default function LabourColonyEnquiryDialog({ isOpen, onClose, prefillMessage }: Props) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const attribution = useMemo(() => isOpen ? readAttribution() : {}, [isOpen]);

  useEffect(() => {
    if (isOpen && prefillMessage) setForm((current) => current.message ? current : { ...current, message: prefillMessage });
    if (isOpen) pushDataLayer('lc_form_started', { form_type: 'labour_colony_enquiry', page_path: '/product/labor-colony' });
  }, [isOpen, prefillMessage]);

  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const close = () => { setForm(initial); setLoading(false); setSubmitted(false); setError(''); onClose(); };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, ...attribution, isLabourColony: true, productName: 'Labour Colony', pageUrl: window.location.href }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Failed to submit enquiry');
      if (result.ignored) return;
      setSubmitted(true);
      pushDataLayer('contact_form_submit', { form_type: 'labour_colony_enquiry', product_type: 'labour_colony', industry: safeText(form.industry), lead_source: safeText(attribution.leadSource), page_path: '/product/labor-colony' });
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Failed to submit enquiry. Please try again.'); }
    finally { setLoading(false); }
  };

  if (submitted) return <Dialog open={isOpen} onOpenChange={close}><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Enquiry Sent!</DialogTitle></DialogHeader><div className="py-6 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><CheckCircle className="h-8 w-8 text-green-600" /></div><p className="text-gray-600">Thank you for your enquiry! We&apos;ll get back to you within 24 hours.</p></div></DialogContent></Dialog>;

  return <Dialog open={isOpen} onOpenChange={close}><DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[760px]"><DialogHeader><DialogTitle>Request a Labour Colony Quotation</DialogTitle></DialogHeader><form onSubmit={submit} className="grid gap-4 py-2 sm:grid-cols-2">
    <input aria-hidden="true" autoComplete="off" className="hidden" name="website" onChange={change} tabIndex={-1} value={form.website} />
    <Field id="lc-name" label="Full Name"><Input id="lc-name" name="firstName" value={form.firstName} onChange={change} autoComplete="name" required /></Field>
    <Field id="lc-company" label="Company Name"><Input id="lc-company" name="companyName" value={form.companyName} onChange={change} autoComplete="organization" required /></Field>
    <Field id="lc-email" label="Business Email"><Input id="lc-email" name="email" type="email" value={form.email} onChange={change} autoComplete="email" required /></Field>
    <Field id="lc-phone" label="Mobile Number"><Input id="lc-phone" name="phone" type="tel" value={form.phone} onChange={change} autoComplete="tel" required /></Field>
    <Field id="lc-location" label="Project Location"><Input id="lc-location" name="projectLocation" value={form.projectLocation} onChange={change} required /></Field>
    <Field id="lc-industry" label="Industry or Project Type"><select id="lc-industry" name="industry" value={form.industry} onChange={change} className={selectClass} required><option value="">Select industry</option>{industries.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
    <Field id="lc-workers" label="Number of Workers"><Input id="lc-workers" name="workerCapacity" type="number" min="1" step="1" inputMode="numeric" value={form.workerCapacity} onChange={change} required /></Field>
    <Field id="lc-date" label="Required Installation Date"><Input id="lc-date" name="requiredDate" type="date" min={new Date().toISOString().split('T')[0]} value={form.requiredDate} onChange={change} required /></Field>
    <Field id="lc-config" label="Required Configuration"><select id="lc-config" name="configuration" value={form.configuration} onChange={change} className={selectClass} required><option value="">Select configuration</option><option value="Ground Floor">Ground Floor</option><option value="G+1">G+1</option><option value="Not Decided">Not Decided</option></select></Field>
    <Field id="lc-type" label="Requirement Type"><select id="lc-type" name="requirementType" value={form.requirementType} onChange={change} className={selectClass} required><option value="">Select requirement</option><option value="Purchase">Purchase</option><option value="Rental">Rental</option><option value="Not Decided">Not Decided</option></select></Field>
    <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="lc-details">Requirement Details</Label><Textarea id="lc-details" name="message" value={form.message} onChange={change} rows={3} required /></div>
    {error && <p className="text-sm text-red-600 sm:col-span-2" role="alert">{error}</p>}
    <div className="flex justify-end gap-2 pt-2 sm:col-span-2"><Button type="button" variant="outline" onClick={close}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : 'Send Enquiry'}</Button></div>
  </form></DialogContent></Dialog>;
}
