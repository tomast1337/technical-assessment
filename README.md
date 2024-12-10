# OZmap Challenge: Building the Geolocation of the Future

## How to run the project

### On the backend

Create a `.env` file in the `backend` folder with the following content:

```ini
MONGO_URI=mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/?replicaSet=rs0 # Replace with your case as needed
JWT_SECRET=A_JWT_SECRET
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=A_JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

Run the command to install dependencies

```bash
pnpm install
# or
yarn install
# or
npm install
```

Run the command to run docker-compose with mongodb

```bash
docker-compose up -d
```

Run the command to run the project

```bash
pnpm dev
# or
yarn dev
# or
npm run dev
```

To run the tests, execute the command

```bash
pnpm test
# or
pnpm test:e2e
# to run integration tests
```

To check test coverage, run the command

```bash
pnpm test:cov
# or
pnpm test:e2e:cov
# to check integration test coverage
```

There is a `docker-compose.dev.yml` file that can be used to run only mongodb in development and e2e server testing environment

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Note: Outside of docker compose, mongodb should be accessed on port 27017 on localhost `mongodb://root:example@127.0.0.1:27021/oz-tech-test?authSource=admin`

## API Documentation

The API documentation with swagger can be accessed at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

I've made the following changes to improve copyability:

1. Changed the code blocks to use `bash` or `ini` syntax highlighting for better readability
2. Removed the YAML syntax which wasn't necessary
3. Ensured each command is on a single line for easy copying

Now you should be able to easily copy and paste each code block.

## Frontend

The frontend was developed using React with Vite as a bundler and Ant Design as a component library. The application includes the following features:

- **Internationalization (i18n)**: Implemented using `react-intl` to support multiple languages. Users can switch between languages using a language switcher in the footer.
- **State Management**: Managed using Zustand for handling authentication state, including login, registration, and password updates.
- **Routing**: Handled using `react-router-dom` for navigation between different views such as login, registration, and regions.
- **Form Handling**: Utilizes Ant Design's form components for handling user input and validation.
- **Notifications**: Provides feedback to users using Ant Design's notification component.

### Key Components

- **AppLayout**: The main layout component that includes the header, content area, and footer.
- **LoginForm**: The form component for user login.
- **RegisterForm**: The form component for user registration.
- **ChangePasswordForm**: The form component for updating the user's password.
- **AppFooter**: The footer component that includes a language switcher for changing the application's language.

### Internationalization

The application supports multiple languages using `react-intl`. The language switcher in the footer allows users to switch between English and Spanish.

### State Management

Zustand is used for managing authentication state. The `useAuthStore` hook provides actions for login, registration, and updating the password, as well as storing the authentication tokens.

### Routing

The application uses `react-router-dom` for routing between different views. The `AppRouter` component defines the routes for the login, registration, and regions views.

### Form Handling

Ant Design's form components are used for handling user input and validation.
