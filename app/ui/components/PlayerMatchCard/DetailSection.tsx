type MatchDetailItem = {
  main: string;
  sub?: string;
};

type DetailSectionProps = {
  icon: React.ReactNode;
  title: string;
  items: MatchDetailItem[];
};

function DetailSection({ icon, title, items }: DetailSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        {icon} {title}
      </h4>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="bg-muted/30 rounded-lg px-3 py-2">
            <p className="text-sm text-foreground">{item.main}</p>
            {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailSection;
