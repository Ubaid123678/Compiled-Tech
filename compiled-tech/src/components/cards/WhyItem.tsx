import { cn, slugify } from "@/lib/utils";

type WhyItemProps = {
  title: string;
  text: string;
  icon: React.ReactNode;
  className?: string;
};

export function WhyItem({ title, text, icon, className }: WhyItemProps) {
  return (
    <article className={cn("border-t border-line pt-8", className)}>
      <div className="text-steel mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3
        id={slugify(title)}
        className="font-display font-semibold uppercase tracking-[0.06em] text-frost text-[1.15rem] leading-[1.3] mb-2">
        {title}
      </h3>
      <p className="text-mist text-base leading-[1.6]">{text}</p>
    </article>
  );
}