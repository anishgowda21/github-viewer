# GitHub Profile Viewer

A React application built with Vite and Tailwind CSS that uses the GitHub public API to fetch and display information about GitHub users and their repositories.

## Features

- Search for GitHub users by username
- View user profile information including:
  - Avatar
  - Name
  - Bio
  - Location
  - Company
  - Social links
  - Follower counts
- View latest repositories with details:
  - Repository name and description
  - Stars and forks count
  - Main programming language
  - Topics/tags
  - Last update date

## Technologies Used

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v3](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [GitHub REST API](https://docs.github.com/en/rest)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

This will start the application on [http://localhost:5173](http://localhost:5173).

### Build for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## API Rate Limiting

The GitHub API has rate limiting. Unauthenticated requests are limited to 60 requests per hour. For more information, see [GitHub's documentation on rate limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

## License

This project is open source and available under the [MIT License](LICENSE).
