# Vite React App with TypeScript

This guide outlines the process of creating a Vite React application with TypeScript and building it for production.

## Code Quality Setup

This project uses pre-commit hooks and code quality tools to maintain consistent code standards.

### Initial Setup
1. Install pre-commit (choose one):
   ```bash
   # Using apt (Ubuntu/Debian)
   sudo apt install pre-commit

   # Or using pipx (recommended)
   sudo apt install pipx
   pipx ensurepath
   pipx install pre-commit
   ```

2. Clone and setup:
   ```bash
   git clone [repository-url]
   cd [project-directory]
   npm install
   pre-commit install
   ```

### Code Quality Tools

The project includes several tools to maintain code quality:

1. Pre-commit Hooks (Automatic)
   - Run automatically when you try to commit
   - Check for trailing whitespace
   - Ensure proper file endings
   - Validate JSON files

2. Manual Quality Checks
   You should run these before committing:

   - Lint check: `npm run lint`
     - Think of this as your automated code reviewer
     - Checks for potential errors
     - Ensures TypeScript types are correct
     - Enforces coding standards

   - Code formatting: `npm run format`
     - Formats code to project standards
     - Ensures consistent style

## Prerequisites
- **Node.js and npm**: Install Node.js and npm using [nvm](https://github.com/nvm-sh/nvm).
- **Docker**: Ensure Docker is installed and configured.

## Project Setup

1. **Update Node.js and npm**:
    ```bash
    nvm install node
    npm install -g npm
    ```
2. **Create a Production Build**:
    ```bash
    npm run build
    ```
