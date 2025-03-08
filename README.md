# GitHub Explorer

A comprehensive React application built with Vite and Tailwind CSS that provides an enhanced interface for exploring GitHub users, repositories, and file structures using the GitHub public API.

## Features

### User Profile Exploration
- Search for any GitHub user by username
- Quick access to popular GitHub organizations (GitHub, Microsoft, Google, Facebook)
- View detailed user profile information including:
  - Avatar and name
  - Bio and location
  - Company and employment details
  - Blog and social links (Twitter/X)
  - Email contact (when available)
  - Join date on GitHub
  - Comprehensive statistics (followers, following, repositories, gists)

### Repository Management
- View all user repositories with rich details:
  - Repository name and description
  - Stars, forks, and watchers counts
  - Primary programming language
  - Topics and tags
  - Last update timestamps
  - Fork status indicators
- Smart repository listing with:
  - Initial display of most recent repositories
  - Option to view all repositories
  - Global repository search across all user repos (handles GitHub's 100 repo limit)
  - Direct navigation to repository details

### Repository Explorer
- Browse repository details including:
  - Stars, forks, watchers, and issues counts
  - Primary language used
  - License information
  - Creation and last update dates
- View file structure in an interactive tree explorer
- Expand/collapse folders for easier navigation
- Copy repository tree structure to clipboard for documentation
- One-click navigation to view repositories on GitHub

### Responsive Design
- Mobile-friendly interface that adapts to all screen sizes
- Optimized layout for both desktop and mobile viewing
- Clean, modern UI using Tailwind CSS

## Technologies Used

- [React 19](https://react.dev/) - UI library
- [React Router 6](https://reactrouter.com/) - Navigation and routing
- [Vite 6](https://vitejs.dev/) - Build tool and development server
- [Tailwind CSS 3](https://tailwindcss.com/) - Utility-first CSS framework
- [Axios](https://axios-http.com/) - HTTP client for API requests
- [GitHub REST API](https://docs.github.com/en/rest) - Data source

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/github-explorer.git
   cd github-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

### Building for Production

Build the application:

```bash
npm run build
```

The optimized build files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## API Rate Limiting and Handling

This application implements several strategies to work with GitHub API rate limits:

- Unauthenticated requests are limited to 60 requests per hour
- Efficient data fetching to minimize API calls
- Smart caching for repeated requests
- Global search functionality to overcome the 100 repository limit
- Informative messaging when rate limits are encountered

For more information, see [GitHub's documentation on rate limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

## Project Structure

```
github-explorer/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # Reusable UI components
│   │   ├── RepoTree.jsx # Repository file explorer
│   │   ├── SearchForm.jsx 
│   │   ├── UserProfile.jsx
│   │   └── ...
│   ├── pages/           # Main page components
│   │   ├── HomePage.jsx # Landing page with search
│   │   ├── UserProfilePage.jsx
│   │   ├── RepositoryExplorer.jsx
│   │   └── ...
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
└── README.md            # Project documentation
```

## License

This project is open source and available under the [MIT License](LICENSE).
