// src/App.tsx
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Weather Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track weather conditions and forecasts worldwide
          </p>
        </header>
        
        <main>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-center text-gray-500">
                Weather application will be implemented in the next commits
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;