import styles from './ProcessSteps.module.css';

/**
 * ProcessSteps — an ordered, numbered process (e.g. Enquiry → Site survey →
 * Fabrication → Delivery → Install). Semantic ordered list. Server component.
 */
export interface ProcessStep {
  title: string;
  description?: string;
}

export interface ProcessStepsProps {
  steps: ProcessStep[];
  /** Optional section heading. */
  title?: string;
  className?: string;
}

export function ProcessSteps({ steps, title, className }: ProcessStepsProps) {
  return (
    <section className={[styles.wrap, className].filter(Boolean).join(' ')}>
      {title && <h2 className={styles.heading}>{title}</h2>}
      <ol className={styles.list}>
        {steps.map((step, i) => (
          <li className={styles.step} key={i}>
            <span className={styles.num} aria-hidden="true">{i + 1}</span>
            <span className={styles.body}>
              <span className={styles.title}>{step.title}</span>
              {step.description && <span className={styles.desc}>{step.description}</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default ProcessSteps;
