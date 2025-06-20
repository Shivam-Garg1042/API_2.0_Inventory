import React, { useState } from 'react';
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

  const handleSubmit = async () => {
    if (!oemNumber && !batteryNumber) {
      setError('Please enter either OEM Number or Battery Number');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Replace with your actual API endpoint
      const apiEndpoint = 'http://localhost:8080/api/asset-verification'; // Local development
      // const apiEndpoint = 'https://your-deployed-api-url/api/asset-verification'; // Production
      
      const requestBody = {
        oemNumber: oemNumber || null,
        batteryNumber: batteryNumber || null
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'X-API-Key': 'your-api-key'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-12">
      <div className="max-w-4xl mx-auto">
        {/* Company Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-64 h-20 bg-white rounded-full shadow-lg mb-4">
            <img
              src="/chargeup_logo.png" // Replace with your logo path
              alt="Chargeup"
              className="p-4"></img>
          </div>
          {/* <p className="text-gray-600 text-sm">Your Company Name</p> */}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Heading */}
          <h1 className="text-4xl font-medium text-gray-800 text-center mb-8">
            Asset Verification
          </h1>

          {/* Form */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* OEM Number Input */}
              <div className="space-y-3">
                <label htmlFor="oem" className="block text-base font-medium text-gray-700 px-1">
                  OEM Battery Number
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
                  Chargeup Battery Number
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
                type="button"
                onClick={handleSubmit}
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
        {/* <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div> */}
      </div>
    </div>
  );
};

export default AssetVerification;