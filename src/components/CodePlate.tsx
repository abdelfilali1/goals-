/** The category's line code, set like a route badge on a timetable. */
export function CodePlate({
  code,
  color,
  name,
  size = "sm",
}: {
  code: string;
  color: string;
  name?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`board inline-flex flex-none items-center justify-center rounded-plate font-extrabold leading-none text-paper ${
        size === "md" ? "h-7 min-w-11 px-1.5 text-body" : "h-5 min-w-9 px-1 text-meta"
      }`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {code}
      {name && <span className="sr-only"> ({name})</span>}
    </span>
  );
}
