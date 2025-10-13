import { useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaRedo } from 'react-icons/fa';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6">
            <FaTimesCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Payment Failed</h1>
          <p className="text-red-100 text-lg">We couldn't process your payment</p>
        </div>
        
        <div className="px-8 py-10 space-y-8">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-6">
              Don't worry! No charges have been made to your account.
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                <FaRedo /> Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}