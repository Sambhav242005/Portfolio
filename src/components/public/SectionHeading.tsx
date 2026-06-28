import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

type SectionHeadingProps = {
  title: string;
  actionLabel?: string;
  actionHref?: string;
};

export function SectionHeading({ title, actionLabel, actionHref }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {actionLabel && actionHref ? (
        <Link className="section-link" href={actionHref}>
          {actionLabel}
          <IconArrowRight aria-hidden="true" size={16} stroke={1.7} />
        </Link>
      ) : null}
    </div>
  );
}
