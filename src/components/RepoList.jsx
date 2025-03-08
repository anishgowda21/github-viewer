const RepoList = ({ repos }) => {
  if (repos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-600">No repositories found.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold p-4 border-b">
        Latest Repositories
      </h3>
      <ul className="divide-y">
        {repos.map(repo => (
          <li key={repo.id} className="p-4 hover:bg-gray-50 transition duration-150">
            <div className="flex justify-between items-start">
              <div>
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {repo.name}
                </a>
                {repo.fork && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">Fork</span>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  {repo.description || 'No description provided'}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {repo.language && (
                    <span className="flex items-center text-xs text-gray-600">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                      {repo.language}
                    </span>
                  )}
                  
                  <span className="flex items-center text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                    {repo.stargazers_count}
                  </span>
                  
                  <span className="flex items-center text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                    </svg>
                    {repo.forks_count}
                  </span>
                  
                  <span className="text-xs text-gray-600">
                    Updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 max-w-xs justify-end">
                    {repo.topics.slice(0, 3).map(topic => (
                      <span 
                        key={topic} 
                        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                    {repo.topics.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                        +{repo.topics.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RepoList