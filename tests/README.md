# Testing Framework Documentation

This document describes the Jest testing framework setup for the 3Dmap project.

## Overview

The testing framework uses Jest with jsdom environment to test the 3D Star Map application functionality without requiring a browser environment.

## Setup

The testing framework includes:

- **Jest**: JavaScript testing framework
- **jsdom**: DOM implementation for testing browser-based applications
- **Mock setup**: Three.js and underscore.js mocking for isolated testing

## Test Structure

Tests are organized in the `/tests` directory:

```
tests/
├── setup.js          # Jest setup and mocks
├── app.test.js        # Core application tests
├── starSystem.test.js # Star classification and system tests
└── dateFilter.test.js # Date filtering and utility tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in verbose mode (shows all test descriptions)
npm run test:verbose

# Run tests in watch mode (reruns on file changes)
npm run test:watch
```

### Test Categories

#### 1. Application Core Tests (`app.test.js`)
- DOM element validation
- Three.js mocking verification
- Basic data structure validation
- Event handling setup

#### 2. Star System Tests (`starSystem.test.js`)
- Star type classification (A, F, G, K, M, D types)
- System data validation
- Jump link type recognition
- 3D coordinate handling and scaling

#### 3. Date Filter Tests (`dateFilter.test.js`)
- Year-based filtering logic
- Date slider functionality
- CSS class management
- Utility function testing

## Mock Setup

The testing framework includes comprehensive mocks for:

### Three.js Objects
- `THREE.Vector3` - 3D vector operations
- `THREE.Scene` - 3D scene container
- `THREE.PerspectiveCamera` - Camera projection
- `THREE.WebGLRenderer` - WebGL rendering
- Basic geometry and material classes

### DOM Elements
- Date slider and display elements
- Checkbox controls for link filtering
- Container elements for 3D rendering

### Global Variables
- `systemsArr` - Star system data
- `jumpList` - Hyperspace jump connections
- `window` object with dimensions

## Configuration

Jest configuration is defined in `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
```

## Coverage Reports

Coverage reports are generated in the `/coverage` directory and show:
- Statement coverage
- Branch coverage  
- Function coverage
- Line coverage

## Adding New Tests

To add new tests:

1. Create a new `.test.js` file in the `/tests` directory
2. Import or mock any required dependencies
3. Use Jest's `describe` and `test` functions to structure tests
4. Follow the existing naming conventions and patterns

### Example Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code for each test
  });

  describe('Sub-feature', () => {
    test('should do something specific', () => {
      // Test implementation
      expect(result).toBe(expected);
    });
  });
});
```

## Best Practices

1. **Isolated Tests**: Each test should be independent and not rely on other tests
2. **Clear Descriptions**: Use descriptive test names that explain what is being tested
3. **Mock External Dependencies**: Mock Three.js, DOM APIs, and other external dependencies
4. **Test Edge Cases**: Include tests for boundary conditions and error cases
5. **Maintain Setup**: Keep the `setup.js` file updated with necessary mocks

## Troubleshooting

### Common Issues

1. **Three.js not defined**: Ensure `setup.js` is properly configured in Jest setup
2. **DOM elements not found**: Verify DOM setup in `beforeEach` hooks
3. **Async operations**: Use appropriate Jest async testing patterns if needed

### Debugging Tests

```bash
# Run specific test file
npx jest tests/app.test.js

# Run tests matching a pattern
npx jest --testNamePattern="star classification"

# Run tests with detailed output
npx jest --verbose --no-coverage
```

## Dependencies

Testing framework dependencies in `package.json`:

```json
{
  "devDependencies": {
    "jest": "^29.x.x",
    "jest-environment-jsdom": "^29.x.x"
  }
}
```

This testing framework provides comprehensive coverage for the 3Dmap application while maintaining simplicity and ease of use.