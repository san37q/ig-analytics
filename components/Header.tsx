export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="text-4xl">📱</span> IG Tracker
            </h1>
            <p className="text-blue-100 mt-1">
              Track your Instagram followers and following changes
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-sm text-blue-100">
              Instagram Analytics Dashboard
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
