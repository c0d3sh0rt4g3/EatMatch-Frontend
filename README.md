# EatMatch

## Project Description

EatMatch is a web application developed with Vue.js that allows users to search for restaurants, write reviews, 
and manage their food critic profile. The platform is designed to connect food lovers with the best restaurants based 
on their personal preferences.

### Main Features

- **Restaurant Search**: Find restaurants according to different criteria.
- **Review System**: Write, edit, and delete your own reviews about restaurants you've visited.
- **Personalized User Profile**:
    - View your average rating as a critic
    - Access all your reviews in one place
    - Information about your account creation date
- **Review Management**: Edit or delete your previous reviews directly from your profile.
- **Contact Form**: Communicate with the EatMatch team for suggestions or issues.
- **Authentication System**: Secure registration and login to access all functionalities.


## Installation and Usage Instructions

### Prerequisites

- Node.js (version 14.0 or higher)
- NPM
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/c0d3sh0rt4g3/EatMatch-Frontend.git
```

2. Navigate to the project directory:

```bash
cd EatMatch-Frontend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root and configure the necessary environment variables.

### Development Mode

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the configured port).

### Production Build

To generate the production version:

```bash
npm run build
```

The generated files will be stored in the `dist/` directory.

## Development proccess
During my development process I found some issues wrking with google maps places API so I had to change the API to geoapify 
due to it, I couldn't add features like the restaurants type of food, menus or photos, so I'll try to fix it in future versions tu use google places API

### Future features

- Fix issues with google maps places API and implement:
- - Restaurant menus display
- - Search by restaurant type
- - Search by average price
- Add following and recommendation feature

## Public Deployment Link

You can access the online version of EatMatch at the following link:

[https://eatmatch.example.com](https://eatmatch-frontend.onrender.com)
