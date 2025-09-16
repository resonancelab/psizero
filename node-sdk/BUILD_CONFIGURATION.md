# Nomyx Resonance SDK Build Configuration

## Package.json Configuration

```json
{
  "name": "@nomyx/resonance-sdk",
  "version": "1.0.0",
  "description": "Official Node.js SDK for the Nomyx Resonance Platform - Quantum AI and collaborative computing",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "rollup -c",
    "build:watch": "rollup -c --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "type-check": "tsc --noEmit",
    "docs": "typedoc src/index.ts",
    "docs:serve": "typedoc src/index.ts --watch",
    "prepublishOnly": "npm run build && npm run test",
    "prepack": "npm run build"
  },
  "keywords": [
    "nomyx",
    "resonance",
    "quantum",
    "ai",
    "p-np",
    "collaborative",
    "api",
    "sdk",
    "typescript"
  ],
  "author": "Nomyx Technologies",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/nomyx-tech/resonance-sdk"
  },
  "bugs": {
    "url": "https://github.com/nomyx-tech/resonance-sdk/issues"
  },
  "homepage": "https://docs.nomyx.dev/sdk",
  "engines": {
    "node": ">=16.0.0"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "ws": "^8.14.0",
    "eventemitter3": "^5.0.1",
    "debug": "^4.3.4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/ws": "^8.5.0",
    "@types/debug": "^4.1.12",
    "@types/jest": "^29.5.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.2.0",
    "rollup": "^4.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^25.0.0",
    "@rollup/plugin-json": "^6.0.0",
    "rollup-plugin-dts": "^6.1.0",
    "typedoc": "^0.25.0",
    "nock": "^13.3.0"
  },
  "peerDependencies": {
    "typescript": ">=4.5.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

## TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

## Rollup Build Configuration (rollup.config.js)

```javascript
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';

const external = ['axios', 'ws', 'eventemitter3', 'debug'];

export default [
  // Main build
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    external,
    plugins: [
      resolve({ 
        preferBuiltins: true,
        browser: false
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.spec.ts']
      })
    ]
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm'
    },
    external,
    plugins: [dts()]
  }
];
```

## Jest Testing Configuration (jest.config.js)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
  maxWorkers: 4
};
```

## ESLint Configuration (.eslintrc.js)

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js',
    '*.d.ts'
  ]
};
```

## GitHub Actions CI/CD (.github/workflows/ci.yml)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

  build:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js 18.x
      uses: actions/setup-node@v4
      with:
        node-version: 18.x
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build package
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/

  publish:
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js 18.x
      uses: actions/setup-node@v4
      with:
        node-version: 18.x
        cache: 'npm'
        registry-url: 'https://registry.npmjs.org'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build package
      run: npm run build
    
    - name: Publish to NPM
      run: npm publish
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Project Directory Structure

```
node-sdk/
├── src/
│   ├── index.ts                    # Main export file
│   ├── core/
│   │   ├── errors.ts               # Error classes
│   │   ├── types.ts                # Core type definitions
│   │   └── constants.ts            # SDK constants
│   ├── resonance-client.ts         # Main client class
│   ├── dynamic-api.ts              # Existing dynamic API foundation
│   ├── foundation/
│   │   ├── rnet-client.ts          # RNET foundational layer
│   │   └── types.ts                # RNET type definitions
│   ├── flagship/
│   │   ├── sai-client.ts           # SAI flagship service
│   │   └── types.ts                # SAI type definitions
│   ├── engines/
│   │   ├── srs-client.ts           # SRS P=NP solver
│   │   ├── hqe-client.ts           # Holographic quantum
│   │   ├── qsem-client.ts          # Semantic encoding
│   │   ├── nlc-client.ts           # Non-local communication
│   │   ├── qcr-client.ts           # Consciousness resonance
│   │   ├── iching-client.ts        # Quantum oracle
│   │   ├── unified-client.ts       # Unified physics
│   │   └── types.ts                # Engine type definitions
│   ├── realtime/
│   │   ├── websocket-manager.ts    # WebSocket management
│   │   ├── space-session.ts        # RNET space sessions
│   │   └── types.ts                # Real-time type definitions
│   └── utils/
│       ├── retry.ts                # Retry utilities
│       ├── validation.ts           # Input validation
│       └── logger.ts               # Debug logging
├── tests/
│   ├── setup.ts                    # Test setup
│   ├── mocks/                      # Mock backend responses
│   ├── unit/                       # Unit tests
│   ├── integration/                # Integration tests
│   └── e2e/                        # End-to-end tests
├── docs/                           # Generated documentation
├── examples/                       # Usage examples
├── package.json
├── tsconfig.json
├── rollup.config.js
├── jest.config.js
├── .eslintrc.js
├── .gitignore
├── README.md
└── LICENSE
```

## Development Workflow

### Initial Setup
```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm test

# Start development with watch mode
npm run build:watch
```

### Quality Assurance
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Generate documentation
npm run docs

# Serve documentation with live reload
npm run docs:serve
```

### Testing Strategy
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test files
npm test -- --testNamePattern="ResonanceClient"
```

## Build Outputs

The build process generates multiple output formats:

- **CommonJS**: `dist/index.js` - For Node.js environments
- **ES Modules**: `dist/index.esm.js` - For modern bundlers
- **Type Definitions**: `dist/index.d.ts` - TypeScript support
- **Source Maps**: `dist/*.map` - For debugging

## Package Features

### Tree Shaking Support
The ESM build supports tree shaking, allowing developers to import only the components they need:

```typescript
// Import only specific engines
import { RNETClient, SAIClient } from '@nomyx/resonance-sdk';

// Import specific utilities
import { ResonanceError } from '@nomyx/resonance-sdk/errors';
```

### Dual Package Support
The package supports both CommonJS and ES modules:

```javascript
// CommonJS
const { ResonanceClient } = require('@nomyx/resonance-sdk');

// ES Modules
import { ResonanceClient } from '@nomyx/resonance-sdk';
```

### TypeScript Integration
Full TypeScript support with comprehensive type definitions:

```typescript
import { ResonanceClient, SpaceConfig } from '@nomyx/resonance-sdk';

const client = new ResonanceClient({ apiKey: 'key' });
const config: SpaceConfig = { name: 'test', basis: { primes: [2, 3] } };
```

This build configuration provides a robust, production-ready foundation for the Nomyx Resonance SDK with modern development tooling, comprehensive testing, and automated CI/CD pipeline.