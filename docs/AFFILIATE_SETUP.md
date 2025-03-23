# Fusion Meals Affiliate Marketing Setup Guide

This document provides instructions for monetizing Fusion Meals using affiliate marketing.

## Overview

Fusion Meals uses contextual affiliate marketing to generate revenue without requiring subscriptions.
The application recommends relevant products and services based on what the user is currently doing.

## Affiliate Program Sign-Up Checklist

### Food Delivery & Ingredients

- [ ] **Amazon Associates** (amazon.com/associates)
  - Sign up at: https://affiliate-program.amazon.com/
  - Replace tracking ID: `fusionmeals-20` with your own
  - Commission: 1-10% depending on product category
  - Payment: Direct deposit or Amazon gift cards

- [ ] **HelloFresh** (Meal Kit Delivery)
  - Sign up at: https://www.hellofresh.com/pages/affiliate
  - Replace referral code: `HS-C53S0JVNM` 
  - Commission: Typically $10-20 per new customer signup
  - Payment: Usually paid via PayPal

- [ ] **Blue Apron** (Meal Kit Delivery)
  - Sign up at: https://www.blueapron.com/pages/affiliate
  - Replace sample URL with your own referral link
  - Commission: Usually fixed amount per new customer
  - Payment: Direct deposit, PayPal, or check

- [ ] **Imperfect Foods**
  - Sign up at: https://www.imperfectfoods.com/affiliate-program
  - Update placeholder link in student meals section
  - Commission: Fixed amount for new customers
  - Payment: Usually quarterly payments

- [ ] **Thrive Market**
  - Join at: https://thrivemarket.com/affiliate-program
  - Commission: $20+ per new membership
  - Payment: Monthly payouts via PayPal or direct deposit

### Kitchen Equipment & Specialty Foods

- [ ] **Williams Sonoma**
  - Join through a network like CJ Affiliate (cj.com)
  - Update tracking parameters in URL
  - Commission: Usually 5-7% on sales
  - Payment: Monthly via direct deposit

- [ ] **Sur La Table**
  - Join through affiliate network (like ShareASale)
  - Replace `clickid=fusion` with your assigned tracking ID
  - Commission: Typically 5-8% on sales
  - Payment: Monthly payouts after reaching minimum threshold

- [ ] **Made In Cookware**
  - Apply directly at: https://madeincookware.com/pages/affiliate-program
  - Update URL parameters in code
  - Commission: Usually 8-10% on sales
  - Payment: Monthly via PayPal

- [ ] **Instacart**
  - Join at: https://shoppers.instacart.com/apps/affiliate
  - Replace the short URL with your own tracking link
  - Commission: Usually $5-10 per new customer
  - Payment: Monthly when reaching threshold

## Banner Image Requirements

Create or request branded banner images from each partner and place them in:
```
/public/images/sponsors/
```

Image requirements:
- File format: JPG or PNG
- Dimensions: 600 x 200 pixels recommended
- File naming convention: `partner-name-banner.jpg`
- Default fallback image: `default-sponsored.jpg`

## Analytics Implementation

Once all affiliate partnerships are established:

1. Uncomment and configure one of the tracking methods in `src/app/ai-chef-premium/page.tsx`
2. Consider setting up a simple API endpoint to track clicks server-side
3. Connect with Google Analytics for comprehensive tracking
4. Create a dashboard to monitor which partnerships perform best

## Testing Affiliate Links

Before deploying to production:
1. Test each affiliate link to ensure proper tracking
2. Verify that promo codes are valid
3. Check that analytics events are firing correctly
4. Test the fallback image system with missing images

## Compliance Requirements

- Add a disclosure statement on your website indicating affiliate relationships
- Update your Privacy Policy to mention tracking of affiliate link clicks
- Ensure all sponsored content is clearly labeled as such (already implemented)

## Monetization Enhancement Ideas

- A/B test different affiliate partners for the same product category
- Rotate featured partners to avoid banner blindness
- Create special themed content that lends itself to high-value affiliate products
- Consider seasonal promotions aligned with partner sales

## Contact Information

For each affiliate program, keep track of:
- Your affiliate/tracking ID
- Account manager contact information
- Payment thresholds and schedules
- Program terms and requirements 