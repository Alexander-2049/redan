To initialize the development environment for this project, follow these steps:

1. **Ensure the correct Node.js version**:  
   This project requires Node.js version `>=18.0.0` and `<=20.17.0`. If you use `nvm`, you can run the following command to switch to Node.js version 20:

   ```sh
   nvm use 20
   ```

2. Install dependencies:
   Run the following command to install all required dependencies listed in package.json:
   ```sh
   npm install
   ```

3. Start the development environment:
   Use the following command to start the Electron application in development mode:
   ```sh
   npm run start
   ```

4. Optional - Run Storybook:
   If you want to work on UI components, you can start Storybook with:
   ```sh
   npm run storybook
   ```

5. Lint the code:
   To ensure code quality, run the linter:
   ```sh
   npm run lint
   ```
