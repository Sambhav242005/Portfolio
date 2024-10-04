import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";

export function SocialButton({
  href,
  icon,
  label,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex justify-center items-center",
        className
      )}
      aria-label={label}
    >
      {icon}
    </Link>
  );
}
