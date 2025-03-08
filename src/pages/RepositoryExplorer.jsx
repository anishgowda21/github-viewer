import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import RepoTree from '../components/RepoTree'

const RepositoryExplorer = () => {
  const { owner, repoName } = useParams()
  const navigate = useNavigate()
  
  const [repository, setRepository] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('files')
  
  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      setLoading(true)
      try {
        const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repoName}`)
        setRepository(repoResponse.data)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching repository details')
        setRepository(null)
      } finally {
        setLoading(false)
      }
    }
    
    if (owner && repoName) {
      fetchRepositoryDetails()
    }
  }, [owner, repoName])
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  const handleBack = () => {
    navigate(-1)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
            <p className="font-medium">Error: {error}</p>
            <p className="mt-2">
              <button 
                onClick={handleBack}
                className="text-blue-600 hover:underline"
              >
                &larr; Back
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!repository) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded my-6">
            <p>Repository not found. Please check the owner name and repository name.</p>
            <p className="mt-2">
              <button 
                onClick={handleBack}
                className="text-blue-600 hover:underline"
              >
                &larr; Back
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back button */}
        <button 
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        {/* Repository header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                {repository.full_name}
                {repository.private && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded-full">Private</span>
                )}
              </h1>
              {repository.description && (
                <p className="text-gray-600 mt-2">{repository.description}</p>
              )}
            </div>
            
            <div className="mt-4 md:mt-0">
              <a 
                href={repository.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.9-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xl font-semibold">{repository.stargazers_count.toLocaleString()}</div>
              <div className="text-gray-600 text-sm">Stars</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xl font-semibold">{repository.forks_count.toLocaleString()}</div>
              <div className="text-gray-600 text-sm">Forks</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xl font-semibold">{repository.watchers_count.toLocaleString()}</div>
              <div className="text-gray-600 text-sm">Watchers</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xl font-semibold">{repository.open_issues_count.toLocaleString()}</div>
              <div className="text-gray-600 text-sm">Issues</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {repository.language && (
              <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                {repository.language}
              </div>
            )}
            
            <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Updated {formatDate(repository.updated_at)}
            </div>
            
            <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Created {formatDate(repository.created_at)}
            </div>
            
            {repository.license && (
              <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {repository.license.name}
              </div>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'files'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('files')}
          >
            Files
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'files' && (
          <RepoTree 
            owner={owner} 
            repo={repoName} 
            onClose={() => {}} 
          />
        )}
        
        {activeTab === 'details' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Repository Details</h2>
            
            <div className="space-y-4">
              {repository.homepage && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Homepage</h3>
                  <a 
                    href={repository.homepage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {repository.homepage}
                  </a>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Default Branch</h3>
                <p>{repository.default_branch}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Clone URL</h3>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={repository.clone_url}
                    readOnly
                    className="flex-grow min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-900 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(repository.clone_url);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200 text-gray-700 sm:text-sm"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {repository.topics && repository.topics.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Topics</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {repository.topics.map(topic => (
                      <span 
                        key={topic} 
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                <div className="mt-1 flex items-center">
                  <img 
                    src={repository.owner.avatar_url} 
                    alt={`${repository.owner.login}'s avatar`}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  <a 
                    href={repository.owner.html_url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {repository.owner.login}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RepositoryExplorer