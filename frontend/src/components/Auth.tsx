import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { palettes, primary, text, background } from '../config/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    // Set loaded state after a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      // Extract error message from API response
      const errorMessage = err.message || err.detail || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Robot hand image */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden rounded-3xl m-5" style={{
        backgroundColor: background.teal,
      }}>
        <div className={`absolute inset-0 transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-teal-400/10"></div>
          <img 
            src="/images/robot_hand.png"
            alt="AD4SCREEN AI Technology" 
            className="w-full h-full object-cover rounded-r-3xl"
          />
        </div>
      </div>

      {/* Right side - Login/Register form */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center bg-white">
        <div 
          className={`w-full max-w-md px-8 py-12 pb-32 transition-all duration-1000 ease-out relative
                     ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium font-space" style={{ color: palettes.teal.teal3 }}>
              Welcome Back
            </h2>
            <p className="mt-2 font-satoshi" style={{ color: text.subtle }}>
              Sign in to access your ASO dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`transition-all duration-500 ease-out transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 font-satoshi" style={{ color: text.subtle }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-base"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 font-satoshi" style={{ color: text.subtle }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-base"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm font-satoshi" style={{
                  backgroundColor: palettes.danger.danger0,
                  borderColor: palettes.danger.danger1,
                  color: palettes.danger.danger3,
                  border: '1px solid',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="fa-spin-fast" />
                ) : 'Sign In'}
              </button>
            </div>
          </form>
          
          {/* Bottom center logo */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-2" style={{ color: text.subtle }}>
              <img 
                src="/images/logo.png" 
                alt="AD4SCREEN Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile background */}
      <div className="absolute inset-0 md:hidden -z-10">
        <div className="absolute inset-0 bg-white/90"></div>
        <img 
          src="/images/robot_hand.png"
          alt="AD4SCREEN AI Technology" 
          className="w-full h-full object-cover object-left opacity-10 rounded-xl"
        />
        
        {/* Mobile top logo */}
        <div className="absolute top-6 left-6 z-20 w-12 h-12">
          <img 
            src="/images/logo.png" 
            alt="AD4SCREEN Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}