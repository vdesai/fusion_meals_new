# Micronutrients Feature Manual Testing Guide

This document outlines the steps to manually test the micronutrients feature in the Fusion Meals application UI.

## Prerequisites

- Ensure you have a premium subscription or are in demo mode
- The application should be running locally or be deployed to a testing environment
- Chrome DevTools or similar browser developer tools should be available

## Testing Scenarios

### Scenario 1: Meal Plan Micronutrients Display

1. **Access the Meal Plan Feature**:
   - Log in to your Fusion Meals account
   - Navigate to the "Meal Plan" feature
   - Click on "Generate Meal Plan" or use an existing meal plan

2. **Verify Nutrition Summary Section**:
   - Scroll to the "Nutrition Summary" section
   - Confirm that there is a "Micronutrients" subsection
   - Verify it displays key micronutrients like vitamin_a, vitamin_c, calcium, and iron
   - Each micronutrient should show a percentage value with "% DV" format (e.g., "120% DV")

3. **Interaction Testing**:
   - Hover over micronutrient values to check for any tooltips or additional information
   - Click on micronutrient labels to see if they provide detailed explanations (if implemented)

4. **Visual Verification**:
   - The micronutrients section should be properly aligned and formatted
   - Font size and style should be consistent with the rest of the nutrition summary
   - Percentages above 100% might be highlighted or displayed differently (e.g., green color)

### Scenario 2: Recipe Detail Micronutrients

1. **Access a Recipe Detail**:
   - Navigate to an individual recipe page
   - Scroll to the nutritional information section

2. **Verify Micronutrient Content**:
   - Confirm the presence of a micronutrients breakdown
   - Check that each listed micronutrient has:
     - A proper name (e.g., "Vitamin A", not "vitamin_a")
     - A percentage value with "% DV" format
     - Optionally, the actual amount (e.g., "900 mcg (120% DV)")

3. **Responsive Design Testing**:
   - Test the display on different screen sizes:
     - Desktop (1920×1080)
     - Tablet (768×1024)
     - Mobile (375×667)
   - Verify that the micronutrient information remains readable and properly formatted

### Scenario 3: Premium API Response Testing

1. **Trigger a Premium API Request**:
   - Open Chrome DevTools (F12 or right-click → Inspect)
   - Go to the Network tab
   - Generate a new meal plan or request recipe information that would trigger the premium API

2. **Examine the API Response**:
   - In the Network tab, find the request to `/api/ai-chef/premium/ai-chef`
   - Click on it and navigate to the "Response" tab
   - Verify that the response JSON contains a `micronutrients` object within the `nutrition_summary`
   - Confirm that micronutrients include vitamin_a, vitamin_c, calcium, iron, and possibly others
   - Each value should follow the "XX% DV" format

3. **Error Handling**:
   - Temporarily disconnect from the internet
   - Attempt to generate a meal plan
   - Reconnect to the internet
   - Verify that the application recovers and displays micronutrient data correctly

### Scenario 4: Edge Cases and Validation

1. **Missing Micronutrient Values**:
   - If possible, find or create a recipe that might be missing some micronutrient data
   - Verify how the UI handles missing values (should show "N/A", "0% DV", or similar)

2. **Very High or Low Values**:
   - Look for recipes with extremely high micronutrient values (e.g., 500% DV)
   - Check how these extreme values are displayed
   - Verify if there are any visual indicators for values significantly above or below recommendations

## Reporting Issues

When reporting issues, include the following information:

1. Which scenario and step you were testing
2. Expected behavior
3. Actual behavior
4. Browser and device information
5. Screenshots showing the issue
6. Steps to reproduce the issue

## Completion Checklist

- [ ] Verified meal plan micronutrients display
- [ ] Tested recipe detail micronutrient information
- [ ] Confirmed API response structure contains correct micronutrient data
- [ ] Checked responsive behavior on different screen sizes
- [ ] Tested edge cases with missing or extreme values
- [ ] Verified proper formatting of percentage values 