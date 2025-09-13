import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { arenas } from '../utils/api';
import { useAuth } from '../hooks/useAuth.jsx';

const CreateArena = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatingTests, setGeneratingTests] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      // Create arena
      const arenaResponse = await arenas.create({
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        tokenPrize: parseInt(data.tokenPrize)
      });

      const arenaId = arenaResponse.data.arenaId;

      // Generate test cases with AI
      setGeneratingTests(true);
      await arenas.generateTestCases(arenaId, data.description);

      navigate(`/arena/${arenaId}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create arena');
    } finally {
      setLoading(false);
      setGeneratingTests(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Create New Arena</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Arena Title
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., String Manipulation Challenge"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Challenge Description
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe the coding challenge. AI will generate test cases based on this description."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
            <p className="text-sm text-muted mt-1">
              💡 Be specific about input/output format for better AI test case generation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                {...register('startTime', { required: 'Start time is required' })}
                className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Token Prize
              </label>
              <input
                type="number"
                {...register('tokenPrize', { 
                  required: 'Token prize is required',
                  min: { value: 1, message: 'Minimum 1 token' }
                })}
                className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="100"
                min="1"
              />
              {errors.tokenPrize && (
                <p className="text-red-500 text-sm mt-1">{errors.tokenPrize.message}</p>
              )}
            </div>
          </div>

          <div className="bg-accent p-4 rounded-lg">
            <h3 className="font-medium text-primary mb-2">🤖 AI Test Case Generation</h3>
            <p className="text-sm text-muted">
              Our AI will automatically generate comprehensive test cases based on your challenge description. 
              This includes edge cases, normal cases, and boundary conditions to ensure fair evaluation.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || generatingTests}
            className="w-full bg-primary text-secondary py-3 px-6 rounded-lg font-medium hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
          >
            {generatingTests ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating AI Test Cases...
              </span>
            ) : loading ? (
              'Creating Arena...'
            ) : (
              'Create Arena & Generate Test Cases'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateArena;