# Deploying and Testing Fusion Meals in Production

This guide outlines the steps to deploy your Fusion Meals application to production and test it in a real production environment.

## Production Deployment Options

### 1. Vercel Deployment (Recommended for Frontend)

#### Deploy the Frontend:

1. **Create a Vercel account** at [vercel.com](https://vercel.com) if you don't have one.

2. **Connect your GitHub repository** to Vercel.

3. **Configure the deployment**:
   - Framework preset: Next.js
   - Root directory: `fusion_meals_frontend`
   - Environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-domain.com
     NEXT_PUBLIC_USE_MOCK_DATA=false
     NEXTAUTH_URL=https://your-frontend-domain.com
     NEXTAUTH_SECRET=your-secret-key
     ```

4. **Deploy** and Vercel will automatically build and host your frontend application.

### 2. Heroku Deployment (For Backend)

#### Deploy the Backend:

1. **Create a Heroku account** at [heroku.com](https://heroku.com) if you don't have one.

2. **Install the Heroku CLI**:
   ```
   npm install -g heroku
   ```

3. **Login to Heroku**:
   ```
   heroku login
   ```

4. **Create a new Heroku app**:
   ```
   cd fusion_meals_backend
   heroku create fusion-meals-api
   ```

5. **Create a Procfile** in the `fusion_meals_backend` directory:
   ```
   web: node server.js
   ```

6. **Deploy to Heroku**:
   ```
   git subtree push --prefix fusion_meals_backend heroku main
   ```

7. **Open your deployed app**:
   ```
   heroku open
   ```

### 3. AWS Deployment (Alternative option)

For a more scalable solution, you can deploy both frontend and backend to AWS:

#### Backend on AWS Elastic Beanstalk:
- Create an Elastic Beanstalk environment with Node.js platform
- Deploy your backend code using the EB CLI or AWS Console
- Configure environment variables in the AWS Console

#### Frontend on AWS Amplify:
- Connect your GitHub repository to AWS Amplify
- Configure build settings for Next.js
- Set environment variables in Amplify Console

## Database Setup for Production

Replace the local JSON file with a real database:

1. **Set up a MongoDB Atlas account** (cloud-hosted MongoDB):
   - Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Set up a database user and whitelist your IP
   - Get your connection string

2. **Update your backend code** to use MongoDB:
   - Install Mongoose: `npm install mongoose`
   - Update `server.js` to connect to MongoDB
   - Replace file operations with database queries

3. **Set the database connection string** as an environment variable:
   ```
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/fusion_meals
   ```

## Testing Your Production Deployment

1. **Verify API connectivity**:
   - Test your API endpoints directly: `https://your-backend-domain.com/api/restaurant-dishes/search?query=chicken`
   - Use a tool like Postman to test all endpoints

2. **Test the frontend**:
   - Visit your deployed frontend URL
   - Search for dishes and verify data is being fetched from your production backend
   - Test all features including saving dishes

3. **Check logs for errors**:
   - Vercel: Check deployment logs in the Vercel dashboard
   - Heroku: Run `heroku logs --tail` for real-time logs

## Production Monitoring

1. **Set up error monitoring** with Sentry:
   - Create an account at [sentry.io](https://sentry.io)
   - Install Sentry in both frontend and backend
   - Configure error reporting

2. **Set up performance monitoring** with New Relic or Datadog.

3. **Configure uptime monitoring** with UptimeRobot or StatusCake.

## Scaling Considerations

As your application grows:

1. **Implement caching** with Redis for frequent database queries
2. **Set up a CDN** for serving images and static assets
3. **Implement rate limiting** to prevent API abuse
4. **Enable server-side caching** for common API requests

## Security Best Practices

1. **Secure your API** with proper authentication
2. **Enable HTTPS** for all traffic
3. **Store sensitive values** in environment variables
4. **Implement input validation** on all user inputs
5. **Set up proper CORS configuration** to restrict access 