import Head from 'next/head';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';
import {
  PriceCalculatorEstimate,
  PriceCalculatorPrintPayload,
  AddOnBudgetLine,
  buildPrintDate,
  safeEstimateRefToken,
  safeFileSlug,
  currencyInRupee,
} from '@/lib/price-calculator-config';
import { fetchEstimateSession } from '@/lib/price-calculator-session';

interface EstimatePrintPageProps {
  payload: PriceCalculatorPrintPayload | null;
  referenceToken: string | null;
  error?: string;
}

const formatDate = (value: string) => {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
  }
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const renderField = (label: string, value: string | number | null | undefined) => (
  <div className="space-y-1">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="text-sm font-medium text-slate-900">{value ?? 'N/A'}</p>
  </div>
);

const renderBudgetBreakdown = (estimate: PriceCalculatorEstimate) => {
  if (estimate.mode === 'custom') {
    return null;
  }

  return (
    <section className="rounded border border-slate-200 p-4 space-y-2">
      <h2 className="text-lg font-semibold text-teal-700">Budget Breakdown</h2>
      <table className="w-full text-sm border border-slate-200">
        <tbody>
          <tr className="bg-slate-50">
            <th className="border border-slate-200 px-2 py-1 text-left">Line Item</th>
            <th className="border border-slate-200 px-2 py-1 text-left">Details</th>
            <th className="border border-slate-200 px-2 py-1 text-left">Estimated Range</th>
          </tr>
          <tr>
            <td className="border border-slate-200 px-2 py-1">Base Product</td>
            <td className="border border-slate-200 px-2 py-1">{estimate.budgetBreakdown.base.details}</td>
            <td className="border border-slate-200 px-2 py-1">
              {currencyInRupee(estimate.budgetBreakdown.base.lowRange)} - {currencyInRupee(estimate.budgetBreakdown.base.highRange)}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-200 px-2 py-1">Specification / Material</td>
            <td className="border border-slate-200 px-2 py-1">{estimate.budgetBreakdown.specification.details}</td>
            <td className="border border-slate-200 px-2 py-1">
              {currencyInRupee(estimate.budgetBreakdown.specification.lowRange)} - {currencyInRupee(estimate.budgetBreakdown.specification.highRange)}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-200 px-2 py-1">Optional Add-ons</td>
            <td className="border border-slate-200 px-2 py-1">
              {estimate.budgetBreakdown.addOns.items.length
                ? estimate.budgetBreakdown.addOns.items
                    .map((item) =>
                      item.isIncludedInEstimate
                        ? `${item.name} (${item.quantity} nos): ${currencyInRupee(item.lowRange)} - ${currencyInRupee(item.highRange)}`
                        : `${item.name} (${item.quantity} nos): Quotation review required`,
                    )
                    .join(', ')
                : 'No optional add-ons selected.'}
            </td>
            <td className="border border-slate-200 px-2 py-1">
              Priced subtotal: {currencyInRupee(estimate.budgetBreakdown.addOns.lowRange)} -{' '}
              {currencyInRupee(estimate.budgetBreakdown.addOns.highRange)}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-200 px-2 py-1">GST / Transport / Installation</td>
            <td className="border border-slate-200 px-2 py-1">
              GST: {estimate.gst} | Transport: {estimate.transport} | Installation: {estimate.installation}
            </td>
            <td className="border border-slate-200 px-2 py-1">Included</td>
          </tr>
          <tr>
            <td className="border border-slate-200 px-2 py-1 font-medium">Estimated Budget Range</td>
            <td className="border border-slate-200 px-2 py-1">Typical / Low / High</td>
            <td className="border border-slate-200 px-2 py-1">
              {currencyInRupee(estimate.lowRange)} / {currencyInRupee(estimate.typicalRange)} / {currencyInRupee(estimate.highRange)}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-slate-600">
        Estimated budget range shown only. Final quotation will be shared after drawing and specification review.
      </p>
    </section>
  );
};

const OptionalAddons = ({ entries }: { entries: AddOnBudgetLine[] }) => (
  <section className="rounded border border-slate-200 p-4 space-y-2">
    <h2 className="text-lg font-semibold text-teal-700">Optional Add-ons Selected</h2>
    {entries.length > 0 ? (
      <table className="w-full text-sm border border-slate-200">
        <tbody>
          <tr className="bg-slate-50">
            <th className="border border-slate-200 px-2 py-1 text-left">Add-on</th>
            <th className="border border-slate-200 px-2 py-1 text-left">Quantity</th>
            <th className="border border-slate-200 px-2 py-1 text-left">Budget Range</th>
            <th className="border border-slate-200 px-2 py-1 text-left">Status</th>
          </tr>
          {entries.map((entry) => (
            <tr key={entry.name}>
              <td className="border border-slate-200 px-2 py-1">{entry.name}</td>
              <td className="border border-slate-200 px-2 py-1">{entry.quantity} nos</td>
              <td className="border border-slate-200 px-2 py-1">
                {entry.isIncludedInEstimate ? (
                  <>
                    {currencyInRupee(entry.lowRange)} - {currencyInRupee(entry.highRange)}
                    <br />
                    Typical: {currencyInRupee(entry.typicalRange)}
                  </>
                ) : (
                  'Quotation review required'
                )}
              </td>
              <td className="border border-slate-200 px-2 py-1">{entry.statusLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-sm text-slate-700">No optional add-ons selected.</p>
    )}
    <p className="text-xs text-slate-600">
      Optional add-ons are subject to final specification, drawing, and quotation approval.
    </p>
  </section>
);

function EstimatePrintPage({
  payload,
  referenceToken,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!payload || !payload.estimate) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-6 text-center">
          <h1 className="text-2xl font-semibold text-destructive">Estimate Not Available</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {error || 'The printable estimate data is missing or has expired. Please regenerate it from the calculator.'}
          </p>
        </div>
      </div>
    );
  }

  const estimate = payload.estimate;
  if (estimate.mode === 'custom') {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-6 text-center">
          <h1 className="text-2xl font-semibold text-destructive">Estimate Not Available</h1>
          <p className="text-sm text-muted-foreground mt-2">Printable estimate is not available for custom requirement entries.</p>
        </div>
      </div>
    );
  }

  const isPanel = estimate.mode === 'panel';
  const dateStamp = buildPrintDate(new Date(payload.createdAt));
  const productSlug = safeFileSlug(payload.productName || 'Estimate');
  const title = `SAMAN-Estimate-${productSlug}-${dateStamp}`;
  const refToken = safeEstimateRefToken(referenceToken || 'estimate');
  const estimateRef = `SAMAN-CALC-${dateStamp}-${refToken}`;
  const suggestedFile = `${title}.pdf`;

  const selectedAddOns = estimate.budgetBreakdown.addOns.items;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`Portable budget estimate for ${payload.productName}`} />
      </Head>
      <div className="min-h-screen bg-white text-slate-900 print:bg-white">
        <main className="mx-auto w-full max-w-4xl p-6">
          <section className="border border-slate-200 rounded-lg p-6 space-y-4">
            <header>
              <p className="text-xs uppercase tracking-wide text-slate-500">Estimate / Budget Range</p>
              <h1 className="text-2xl font-semibold">SAMAN Portable Estimate</h1>
              <p className="text-sm text-slate-500">
                Estimate Ref: <strong>{estimateRef}</strong> · Generated: {formatDate(payload.createdAt)}
              </p>
            </header>

            <section className="rounded border border-slate-200 p-4">
              <h2 className="text-lg font-semibold text-teal-700">Customer Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderField('Full Name', payload.customerName)}
                {renderField('Email Address', payload.customerEmail)}
                {renderField('Mobile Number', payload.customerMobile)}
                {renderField('Zone', payload.zone || 'N/A')}
              </div>
            </section>

            <section className="rounded border border-slate-200 p-4 space-y-3">
              <h2 className="text-lg font-semibold text-teal-700">Product &amp; Size</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderField('Product', payload.productName)}
                {renderField('Length', `${estimate.length} ${isPanel ? 'm' : 'ft'}`)}
                {renderField('Width', `${estimate.width} ${isPanel ? 'm' : 'ft'}`)}
                {renderField('Area', `${estimate.area.toLocaleString('en-IN')} ${isPanel ? 'm²' : 'sq ft'}`)}
                {renderField('Quantity', payload.quantity)}
                {renderField('Zone', payload.zone || 'N/A')}
                {isPanel && renderField('Panel Type', payload.productName)}
                {isPanel && renderField('Panel Thickness', `${estimate.thicknessMm} mm`)}
                {isPanel && renderField('Panel Note', 'Square meter based calculation')}
              </div>
            </section>

            <OptionalAddons entries={selectedAddOns} />

            <section className="rounded border border-slate-200 p-4 space-y-3">
              <h2 className="text-lg font-semibold text-teal-700">Commercial Options</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {renderField('GST', `${payload.gst}`)}
                {renderField('Transport', `${payload.transport}`)}
                {renderField('Installation', `${payload.installation}`)}
              </div>
            </section>

            {renderBudgetBreakdown(estimate)}

            <section className="rounded border border-slate-200 p-4 space-y-2">
              <h2 className="text-lg font-semibold text-teal-700">Zone Contact</h2>
              <p className="text-sm text-slate-700">{payload.zoneContact}</p>
            </section>

            <section className="rounded border border-slate-200 p-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded border border-slate-200 p-2">
                <p className="font-semibold">Manufacturing Unit - 1</p>
                <p>Sy No 34/2, near India Oil petrol pump, Gopasandra, Bengaluru, Karnataka 560099</p>
                <p>+91 88616 22859</p>
                <p>+91 80886 85440</p>
                <p>sales@samanportable.com</p>
              </div>
              <div className="rounded border border-slate-200 p-2">
                <p className="font-semibold">Manufacturing Unit - 2</p>
                <p>Khata No 226, Vill-Jalpura, Bisrakh Rd, Jalpura, Dadri, Greater Noida, Uttar Pradesh 201308</p>
                <p>+91 8796039938</p>
                <p>+91 9708989937</p>
                <p>ncr@samanportable.com</p>
              </div>
            </section>

            <section className="rounded border border-slate-200 p-4">
              <h2 className="text-lg font-semibold text-teal-700">Disclaimer</h2>
              <p className="text-xs text-slate-600">
                This is a budget-range estimate only. Final quotation depends on approved drawing, detailed structural requirements,
                site conditions, transport, installation scope, GST treatment, and current market rates.
              </p>
            </section>

            <section className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Print / Save as PDF
              </button>
              <p className="text-xs text-slate-600 self-center">Suggested file name: {suggestedFile}</p>
            </section>
          </section>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<EstimatePrintPageProps> = async ({ query }) => {
  const token = typeof query.token === 'string' ? query.token : '';
  if (!token) {
    return {
      props: {
        payload: null,
        referenceToken: null,
        error: 'Print token is required.',
      },
    };
  }

  const payload = fetchEstimateSession(token);
  if (!payload) {
    return {
      props: {
        payload: null,
        referenceToken: null,
        error: 'Print token is missing or expired.',
      },
    };
  }

  return {
    props: {
      payload,
      referenceToken: token,
    },
  };
};

export default EstimatePrintPage;
