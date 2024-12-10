# Frontend

This project is a frontend application developed using React with Vite as a bundler and Ant Design as a component library. The application includes various features such as internationalization, state management, routing, form handling, and notifications.

## Features

- **Internationalization (i18n)**: Implemented using 

react-intl

 to support multiple languages. Users can switch between languages using a language switcher in the footer.
- **State Management**: Managed using Zustand for handling authentication state, including login, registration, and password updates.
- **Routing**: Handled using 

react-router-dom

 for navigation between different views such as login, registration, and regions.
- **Form Handling**: Utilizes Ant Design's form components for handling user input and validation.
- **Notifications**: Provides feedback to users using Ant Design's notification component.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm (preferred package manager)

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd frontend
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

### Running the Application

To start the development server, run:

```bash
pnpm dev
```

This will start the Vite development server and you can access the application at `http://localhost:3000`.

### Building the Application

To build the application for production, run:

```bash
pnpm build
```

The built files will be output to the `dist` directory.

### Linting

To lint the codebase, run:

```bash
pnpm lint
```

### Previewing the Build

To preview the built application, run:

```bash
pnpm preview
```

This will start a local server to serve the built files.

## Project Structure

- `src/`: Contains the source code of the application.
- `public/`: Contains static assets.
- 

vite.config.ts

: Vite configuration file.
- `tsconfig.json`: TypeScript configuration file.

## Dependencies

- `@ant-design/icons`: Ant Design icons.
- `antd`: Ant Design component library.
- `axios`: Promise-based HTTP client.
- 

react

: React library.
- 

react-dom

: React DOM library.
- 

react-intl

: Internationalization for React.
- 

react-router-dom

: Routing library for React.
- `zustand`: State management library.

## DevDependencies

- `@eslint/js`: ESLint configuration for JavaScript.
- `@types/react`: TypeScript types for React.
- `@types/react-dom`: TypeScript types for React DOM.
- `@vitejs/plugin-react`: Vite plugin for React.
- `eslint`: Linter for JavaScript and TypeScript.
- `eslint-plugin-react-hooks`: ESLint plugin for React hooks.
- `eslint-plugin-react-refresh`: ESLint plugin for React Refresh.
- 

globals

: Global variables for ESLint.
- 

typescript

: TypeScript language.
- 

typescript-eslint

: ESLint plugin for TypeScript.
- `vite`: Vite bundler.
- `vite-tsconfig-paths`: Vite plugin for TypeScript paths.
