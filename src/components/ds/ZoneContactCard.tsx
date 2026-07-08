import styles from './ZoneContactCard.module.css';

export type ContactZone = 'south' | 'north';

export interface ZoneContactCardProps {
  zone: ContactZone;
  /** Display name of the branch/office. */
  office: string;
  /** tel-formatted display number, caller-supplied. */
  phone: string;
  phoneHref: string;
  whatsappHref?: string;
  /** Zone email address (e.g. sales@ for South, ncr@ for North). */
  email?: string;
  /** Cities served by this zone (rendered as tags). */
  cities?: string[];
  /** Optional address / serving line. */
  serving?: string;
  className?: string;
}

const ZONE_LABEL: Record<ContactZone, string> = {
  south: 'South Zone',
  north: 'North Zone',
};

/**
 * ZoneContactCard — South / North regional contact card. The zone drives an
 * accent treatment and label; content is caller-supplied. Server component.
 */
export function ZoneContactCard({ zone, office, phone, phoneHref, whatsappHref, email, cities, serving, className }: ZoneContactCardProps) {
  return (
    <article className={[styles.card, styles[zone], className].filter(Boolean).join(' ')}>
      <span className={styles.zone}>{ZONE_LABEL[zone]}</span>
      <h3 className={styles.office}>{office}</h3>
      {serving && <p className={styles.serving}>{serving}</p>}

      <dl className={styles.contact}>
        <div className={styles.line}>
          <dt className={styles.k}>Phone</dt>
          <dd className={styles.v}>
            <a className={styles.tel} href={phoneHref}>{phone}</a>
          </dd>
        </div>
        {whatsappHref && (
          <div className={styles.line}>
            <dt className={styles.k}>WhatsApp</dt>
            <dd className={styles.v}>
              <a className={styles.tel} href={whatsappHref}>Message us</a>
            </dd>
          </div>
        )}
        {email && (
          <div className={styles.line}>
            <dt className={styles.k}>Email</dt>
            <dd className={styles.v}>
              <a className={styles.tel} href={`mailto:${email}`}>{email}</a>
            </dd>
          </div>
        )}
      </dl>

      {cities && cities.length > 0 && (
        <ul className={styles.cities}>
          {cities.map((c) => (
            <li className={styles.cityTag} key={c}>{c}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default ZoneContactCard;
