interface PageContainerProps {
  title: string;
  description: string;
}

export default function PageContainer({
  title,
  description,
}: PageContainerProps) {
  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950">
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      {/* Page Content */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          The {title.toLowerCase()} page is ready for development.
        </p>
      </div>
    </div>
  );
}