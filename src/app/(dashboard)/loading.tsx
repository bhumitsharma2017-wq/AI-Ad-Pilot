export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="h-8 w-56 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-white rounded-xl border border-gray-100 animate-pulse" />
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-white rounded-xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
