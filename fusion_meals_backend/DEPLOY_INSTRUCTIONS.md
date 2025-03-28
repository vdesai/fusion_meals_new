# Deployment Instructions for Backend Changes

## Summary of Changes
We've updated the backend to support detailed micronutrient data in meal plans:

1. Enhanced the `generate_meal_plan_prompt` function to include a comprehensive micronutrient structure in the response
2. Added post-processing in the `ai_personal_chef` endpoint to ensure all micronutrient data follows the expected format
3. Implemented fallback values for missing micronutrients to maintain UI consistency

## Deployment Steps

### Option 1: Automatic Deployment via GitHub
If your Render service is configured for automatic deployments:

1. Commit these changes to your repository
   ```bash
   git add app/routers/ai_chef.py
   git commit -m "Add detailed micronutrients support to AI Chef API"
   git push origin main
   ```

2. Render should automatically detect the push and deploy the changes
3. Monitor the deployment in your Render dashboard at https://dashboard.render.com/

### Option 2: Manual Deployment
If you have automatic deployments disabled:

1. Log in to your Render dashboard at https://dashboard.render.com/
2. Navigate to your Fusion Meals backend service
3. Click "Manual Deploy" button
4. Select "Deploy latest commit" (or the specific commit containing these changes)
5. Wait for the deployment to complete

## Verification After Deployment

1. Verify that the backend is running by making a request to the root endpoint:
   ```bash
   curl https://fusion-meals-new.onrender.com/
   ```

2. Check the AI Chef Premium endpoint with a test request:
   ```bash
   curl -X POST https://fusion-meals-new.onrender.com/api/ai-chef/premium/ai-chef \
     -H "Content-Type: application/json" \
     -d '{"request_type":"meal_plan","timeframe":"week","budget_level":"moderate"}'
   ```

3. Verify the response includes the detailed micronutrient data

## Troubleshooting

- If the backend deployment fails, check the build logs in Render dashboard
- If the API returns errors, inspect the logs for specific error messages
- If micronutrient data is still missing, verify that the OpenAI API is returning the expected format
- For connection issues between frontend and backend, check CORS settings and API URLs

## Need Help?

Contact the development team via:
- Email: support@fusion-meals.com
- Slack: #fusion-meals-dev 