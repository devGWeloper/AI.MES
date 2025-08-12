export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/80 backdrop-blur" role="contentinfo">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-slate-900 font-semibold">AI MES System</h3>
            <p className="text-sm text-slate-500">AI-powered Manufacturing Execution System</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">© 2025 SK AX. All rights reserved.</p>
            <p className="text-xs text-slate-400">Developed by Manufacturing Service 1 Team</p>
          </div>
        </div>
      </div>
    </footer>
  );
}