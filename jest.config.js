module.exports = {
  testPathIgnorePatterns: ["/node-modules", '/.next/'],//ignorar pastas que não possuem testes
  transform: { //transforma os arquivos testes de ts para js, fazendo o babel entender
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest" //<rootDir> - simboliza a pasta root onde fica o babel
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts" //Para o jests executar antes dos tests
  ],
  testEnvironment: 'jsdom', //indica em qual ambiente os testes estão executando
  //jsdom - ele cria uma representação dda dom em js para conseguir entender o que foi e o que não foi renderizado em tela
  moduleNameMapper: {
    "^.+\\.(scss|css|sass)$": "identity-obj-proxy"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{tsx}",
    "!src/**/*.spec.tsx",
    "!src/**/*._app.tsx",
    "!src/**/*._document.tsx",
  ],
  coverageReporters : ["lcov", "json"]
}