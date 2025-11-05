import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Card } from './components/ui/Card';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search Section */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Search City</h2>
              <div className="flex gap-4">
                <Input 
                  placeholder="Enter city name..." 
                  className="flex-1"
                />
                <Button>Search</Button>
              </div>
            </Card>

            {/* UI Components Demo */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">UI Components</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Email" type="email" placeholder="Enter email" />
                  <Input label="Password" type="password" placeholder="Enter password" />
                </div>
                <div className="flex items-center gap-4">
                  <span>Loading state:</span>
                  <LoadingSpinner />
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;