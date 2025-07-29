# 3D Star Map

![3D Star Map Screenshot](https://github.com/user-attachments/assets/f2c0bc91-43dc-40ec-8cc4-b174a411d8a3)

## Description

The 3D Star Map application is an interactive tool that allows users to explore a virtual representation of stars and constellations in three-dimensional space from the Ten Worlds Universe by Attack Vector. It provides features such as zooming, rotating, searching for specific celestial objects, and time-based visualization of hyperlink discovery dates.

## Features

- **Interactive 3D Navigation**: Use mouse controls to rotate, zoom, and pan around the star map
- **Time-based Discovery**: Use the date slider to see how hyperlinks were discovered over time (2110-2213)
- **Link Type Filtering**: Toggle visibility of different hyperlink types:
  - Alpha (0.6pc) - Blue links
  - Beta (0.9-1.0pc) - Purple links
  - Gamma (1.5-1.7pc) - Orange links
  - Delta (2.4-2.7pc) - Yellow links
  - Epsilon (3.9-4.4pc) - Green links
- **Dynamic Star Visualization**: Star systems display different sizes and colors based on their stellar classification
- **Distance-based Text Visibility**: Star and planet names appear/disappear based on camera distance for better readability

## Technical Details

- **Built with**: Three.js for 3D rendering, CSS3DRenderer for HTML elements in 3D space
- **Browser Compatibility**: Modern browsers with WebGL support
- **Responsive Design**: Adapts to different screen sizes

## Installation

```bash
# Clone the repository
git clone https://github.com/jbarson/3Dmap.git

# Navigate to the directory
cd 3Dmap

# Install development dependencies (for linting)
npm install
```

## Usage

### Running the Application

1. Open `index.html` in a modern web browser, or
2. Serve the files using a local web server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Then open http://localhost:8000 in your browser
```

### Controls

- **Mouse Drag**: Rotate the view
- **Mouse Wheel**: Zoom in/out
- **Date Slider**: Change the discovery date to see how hyperlinks appeared over time
- **Checkboxes**: Toggle visibility of different hyperlink types

## Development

### Linting

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Automatically fix linting errors where possible
```

### Code Structure

- `scripts/app.js` - Main application logic with 3D scene setup and interactions
- `scripts/systemsList.js` - Star system data
- `scripts/jumpLinks.js` - Hyperlink connection data
- `css/style.css` - Styling with CSS custom properties for maintainability
- `index.html` - Main HTML structure

### Code Quality Features

- **Modern JavaScript**: ES2021 features with comprehensive ESLint configuration
- **Modular Functions**: Well-structured, documented functions with single responsibilities
- **CSS Custom Properties**: Maintainable styling with CSS variables
- **JSDoc Documentation**: Comprehensive function documentation
- **Constants Management**: Centralized configuration constants

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes following the existing code style
4. Run linting (`npm run lint`)
5. Commit your changes (`git commit -am 'Add new feature'`)
6. Push to the branch (`git push origin feature/new-feature`)
7. Create a Pull Request

## License

ISC License

## Acknowledgments

- Based on the Ten Worlds Universe by Attack Vector
- Built with Three.js library
- Uses Underscore.js for utility functions