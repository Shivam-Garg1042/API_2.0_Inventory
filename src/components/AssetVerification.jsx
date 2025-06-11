    import  { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const AssetVerification = () => {
  const [oemNumber, setOemNumber] = useState('');
  const [batteryNumber, setBatteryNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleOemChange = (e) => {
    const value = e.target.value;
    setOemNumber(value);
    if (value) {
      setBatteryNumber('');
    }
    setError('');
    setResults(null);
  };

  const handleBatteryChange = (e) => {
    const value = e.target.value;
    setBatteryNumber(value);
    if (value) {
      setOemNumber('');
    }
    setError('');
    setResults(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!oemNumber && !batteryNumber) {
      setError('Please enter either OEM Number or Battery Number');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Replace with your actual BigQuery API endpoint
      const apiEndpoint = 'https://your-gcp-function-url.cloudfunctions.net/asset-verification';
      
      const requestBody = {
        oemNumber: oemNumber || null,
        batteryNumber: batteryNumber || null
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers here if needed
          // 'Authorization': 'Bearer your-token'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOemNumber('');
    setBatteryNumber('');
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
      <div className="max-w-4xl mx-auto">
        {/* Company Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-64 h-20 bg-white rounded-full shadow-lg mb-4">
            <img src="/chargeup_logo.png" alt="Chargeup" className='p-2'  />
          </div>
          
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Asset Verification
          </h1>

          {/* Form */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* OEM Number Input */}
              <div className="space-y-3">
                <label htmlFor="oem" className="block text-base font-medium text-gray-700 px-1">
                  OEM Number
                </label>
                <div className="relative">
                  <input
                    id="oem"
                    type="text"
                    value={oemNumber}
                    onChange={handleOemChange}
                    disabled={batteryNumber !== ''}
                    placeholder="Enter OEM Number"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      batteryNumber !== '' 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-900 hover:border-blue-300'
                    }`}
                  />
                  {batteryNumber !== '' && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                {batteryNumber !== '' && (
                  <p className="text-xs text-gray-500">
                    Disabled while Battery Number is entered
                  </p>
                )}
              </div>

              {/* Battery Number Input */}
              <div className="space-y-3">
                <label htmlFor="battery" className="block text-base font-medium text-gray-700 px-1">
                  Battery Number
                </label>
                <div className="relative">
                  <input
                    id="battery"
                    type="text"
                    value={batteryNumber}
                    onChange={handleBatteryChange}
                    disabled={oemNumber !== ''}
                    placeholder="Enter Battery Number"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      oemNumber !== '' 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-900 hover:border-blue-300'
                    }`}
                  />
                  {oemNumber !== '' && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                {oemNumber !== '' && (
                  <p className="text-xs text-gray-500">
                    Disabled while OEM Number is entered
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                disabled={loading || (!oemNumber && !batteryNumber)}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  loading || (!oemNumber && !batteryNumber)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Submit</span>
                  </>
                )}
              </button>
              
              {(oemNumber || batteryNumber || results) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Verification Results</h2>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
              
              {/* You can customize this section based on your actual data structure */}
              {results.data && Array.isArray(results.data) && (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(results.data[0] || {}).map((key) => (
                          <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.data.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AssetVerification;