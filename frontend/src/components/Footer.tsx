export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">AI MES System</h3>
            <span className="text-gray-400 text-sm">|</span>
            <span className="text-gray-400 text-sm">AI-powered Manufacturing Execution System</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">
              © 2025 SK AX. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Developed by Manufacturing Service 1 Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 