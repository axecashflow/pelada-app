type StatBoxProps = {
  label: string;
  value: number;
  highlight?: boolean;
};

function StatBox({ label, value, highlight }: StatBoxProps) {
  return (
    <div className={`rounded-lg p-3 text-center ${highlight ? 'bg-primary/10' : 'bg-muted/50'}`}>
      <p className={`text-xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  );
}

export default StatBox;
