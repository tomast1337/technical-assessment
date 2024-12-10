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

## Infamações passados para o desafio

Olá desenvolvedor(a)! Bem-vindo(a) ao Desafio Técnico do OZmap. Este é um projeto que simula um cenário real de nossa empresa, onde você irá desempenhar um papel crucial ao desenvolver uma API RESTful robusta para gerenciar usuários e localizações. Estamos muito animados para ver sua abordagem e solução!

## 🌍 **Visão Geral**

Em um mundo conectado e globalizado, a geolocalização se torna cada vez mais essencial. E aqui no OZmap, buscamos sempre otimizar e melhorar nossos sistemas. Assim, você encontrará um protótipo que precisa de sua experiência para ser corrigido, melhorado e levado ao próximo nível.

## 🛠 **Especificações Técnicas**

- **Node.js**: Versão 20 ou superior.
- **Banco de Dados**: Mongo 7+.
- **ORM**: Mongoose / Typegoose.
- **Linguagem**: Typescript.
- **Formatação e Linting**: Eslint + prettier.
- **Comunicação com MongoDB**: Deve ser feita via container.

## 🔍 **Funcionalidades Esperadas**

### Usuários

- **CRUD** completo para usuários.
- Cada usuário deve ter nome, email, endereço e coordenadas.
- Na criação, o usuário pode fornecer endereço ou coordenadas. Haverá erro caso forneça ambos ou nenhum.
- Uso de serviço de geolocalização para resolver endereço ↔ coordenadas.
- Atualização de endereço ou coordenadas deve seguir a mesma lógica.

### Regiões

- **CRUD** completo para regiões.
- Uma região é definida como um polígono em GeoJSON, um formato padrão para representar formas geográficas. Cada região tem um nome, um conjunto de coordenadas que formam o polígono, e um usuário que será o dono da região.
- Listar regiões contendo um ponto específico.
- Listar regiões a uma certa distância de um ponto, com opção de filtrar regiões não pertencentes ao usuário que fez a requisição.
- Exemplo de um polígono simples em GeoJSON:
  ```json
  {
    "type": "Polygon",
    "coordinates": [
      [
        [longitude1, latitude1],
        [longitude2, latitude2],
        [longitude3, latitude3],
        [longitude1, latitude1] // Fecha o polígono
      ]
    ]
  }
  ```

### Testes

- Unitários e de integração.

## 🌟 **Diferenciais**

- Autenticação não é requisito, podendo então o usuário ser fornecido junto do corpo da requisição. Caso implemente autenticação, o usuário deve ser obtido a partir do token.
- Interface básica de usuário.
- Documentação completa da API.
- Internacionalização.
- Cobertura de código.
- Utilização de mongo session

## ⚖ **Critérios de Avaliação**

1. Organização e clareza do código.
2. Estruturação do projeto.
3. Qualidade e eficiência do código.
4. Cobertura e qualidade de testes.
5. Pontos diferenciais citados acima.
6. Tempo de entrega.
7. Padronização e clareza das mensagens de erro.
8. Organização dos commits.
9. Implementação de logs.
10. Adesão às boas práticas de API RESTful.

## 🚀 **Entrega**

1. Crie um repositório público com a base desse código.
2. Crie uma branch para realizar o seu trabalho.
3. Ao finalizar, faça um pull request para a branch `main` deste repositório.
4. Envie um email para `rh@ozmap.com.br` informando que o teste foi concluído.
5. Aguarde nosso feedback.

---

Estamos ansiosos para ver sua implementação e criatividade em ação! Boa sorte e que a força do código esteja com você! 🚀
