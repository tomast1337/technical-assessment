# OZmap Challenge: Construindo a Geolocalização do Futuro

# Como rodar o projeto

defina as variáveis de ambiente no arquivo .env ou no ambiente de execução

```bash
MONGO_URI=mongodb://root:example@mongo:27021/oz-tech-test?authSource=admin # Substitua pelo seu caso necessário
JWT_SECRET=A_JWT_SECRET
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=A_JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

Execute o comando para instalar as dependências

```bash
pnpm install
# ou
yarn install
# ou
npm install
```

Execute o comando para rodar o docker-compose com o mongodb

```bash
docker-compose up -d
```

Execute o comando para rodar o projeto

```bash
pnpm dev
# ou
yarn dev
# ou
npm run dev
```

Para rodar os testes execute o comando

```bash
pnpm test
# ou
pnpm test:e2e
# para rodar os testes de integração
```

Existe um arquivo `docker-compose.dev.yml` que pode ser utilizado para rodar apenas o mongodb em ambiente de desenvolvimento e testes e2e do servidor

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Obs: fora do docker compose o mongodb deve ser acessado na porta 27017 no localhost `mongodb://root:example@127.0.0.1:27021/oz-tech-test?authSource=admin`

# Documentação da API

A documentação da API com o swagger pode ser acessada em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

# Infamações passados para o desafio

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
