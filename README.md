
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/59a69159-cf08-46e3-89c3-51f217027a65

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/59a69159-cf08-46e3-89c3-51f217027a65) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option 1: Deploy with Lovable

Simply open [Lovable](https://lovable.dev/projects/59a69159-cf08-46e3-89c3-51f217027a65) and click on Share -> Publish.

### Option 2: Deploy with Netlify

You can easily deploy this project to Netlify by following these steps:

1. **Create a Netlify account**: If you don't already have one, sign up at [netlify.com](https://netlify.com).

2. **Connect your repository**: 
   - Go to the Netlify dashboard.
   - Click "Add new site" > "Import an existing project".
   - Connect to your Git provider and select your repository.

3. **Configure the build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: Set to 18 or higher

4. **Deploy**: Click "Deploy site" to start the deployment process.

5. **Custom domain (optional)**: 
   - Once deployed, go to "Domain settings" to add your custom domain.
   - Add the domain and follow the instructions to set up DNS records.

6. **Environment variables (if needed)**:
   - If your app uses environment variables, add them in the Netlify dashboard under "Site settings" > "Environment variables".

After deployment, Netlify will automatically rebuild your site when you push changes to your repository.

## I want to use a custom domain - is that possible?

You can use a custom domain by deploying with Netlify as mentioned above and adding your domain in the Netlify dashboard. For Lovable deployments, we don't support custom domains (yet). Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
