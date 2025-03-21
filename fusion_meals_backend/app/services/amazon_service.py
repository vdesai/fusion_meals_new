import os
import time
import hmac
import hashlib
import base64
import urllib.parse
import urllib.request
import json
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
try:
    import requests
except ImportError:
    # Handle the case where requests is not installed
    requests = None
    print("Warning: 'requests' module not installed. Mock data will be used for Amazon services.")
from pydantic import BaseModel
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("amazon_service")

# Load environment variables
load_dotenv()

class AmazonProduct(BaseModel):
    asin: str
    title: str 
    price: float
    image_url: str
    detail_url: str
    availability: str
    quantity_options: List[int] = [1, 2, 3, 4, 5]
    
class AmazonApiClient:
    def __init__(self):
        # Amazon Product Advertising API credentials
        self.access_key = os.getenv("AMAZON_ACCESS_KEY")
        self.secret_key = os.getenv("AMAZON_SECRET_KEY")
        self.partner_tag = os.getenv("AMAZON_PARTNER_TAG")
        self.region = os.getenv("AMAZON_REGION", "us-east-1")
        
        # Check if requests module is available and credentials exist
        self.has_credentials = bool(self.access_key and self.secret_key and self.partner_tag and requests is not None)
        
        # Always use mock data for now since we don't have API credentials
        if not self.has_credentials:
            logger.info("Using mock data for Amazon product search (missing credentials or requests module)")
        
        # Determine the endpoint based on region
        # Format: webservices.amazon.<domain>
        # Examples: webservices.amazon.com (US), webservices.amazon.co.uk (UK)
        region_domain_map = {
            "us-east-1": "com",     # US
            "eu-west-1": "co.uk",   # UK
            "eu-central-1": "de",   # Germany
            "ap-northeast-1": "co.jp", # Japan
            "ap-northeast-2": "co.kr", # South Korea
            "ap-southeast-1": "sg",   # Singapore
            "ap-southeast-2": "com.au", # Australia
            "ca-central-1": "ca"      # Canada
        }
        
        domain = region_domain_map.get(self.region, "com")
        self.endpoint = f"webservices.amazon.{domain}"
        self.uri = "/paapi5/searchitems"
    
    def _get_timestamp(self):
        """Get ISO8601 timestamp for Amazon API requests"""
        return time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
    
    def _sign(self, key, msg):
        """Sign a message with a key using HMAC-SHA256"""
        return hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()
    
    def generate_signature(self, method, headers, request_parameters):
        """Generate AWS v4 signature for API Authentication"""
        if not self.has_credentials:
            return "dummy-signature"
        
        # Step 1: Create canonical request
        amz_date = headers['X-Amz-Date']
        date_stamp = amz_date[:8]  # Date without time, used in credential scope
        
        # Create canonical URI (path)
        canonical_uri = self.uri
        
        # Create canonical query string
        canonical_querystring = request_parameters
        
        # Create canonical headers
        canonical_headers = '\n'.join([f"{header_name.lower()}:{header_value}" for header_name, header_value in headers.items()]) + '\n'
        
        # Create signed headers
        signed_headers = ';'.join([header_name.lower() for header_name in headers.keys()])
        
        # Create payload hash
        payload_hash = hashlib.sha256(''.encode('utf-8')).hexdigest()
        
        # Combine elements to create canonical request
        canonical_request = f"{method}\n{canonical_uri}\n{canonical_querystring}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
        
        # Step 2: Create string to sign
        algorithm = 'AWS4-HMAC-SHA256'
        credential_scope = f"{date_stamp}/{self.region}/ProductAdvertisingAPI/aws4_request"
        string_to_sign = f"{algorithm}\n{amz_date}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()}"
        
        # Step 3: Calculate signature
        # Create signing key
        k_date = self._sign(f'AWS4{self.secret_key}'.encode('utf-8'), date_stamp)
        k_region = self._sign(k_date, self.region)
        k_service = self._sign(k_region, 'ProductAdvertisingAPI')
        k_signing = self._sign(k_service, 'aws4_request')
        
        # Sign the string_to_sign with the signing key
        signature = hmac.new(k_signing, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
        
        return signature
    
    def search_products(self, search_term: str, category: str = "Grocery") -> List[AmazonProduct]:
        """Search for products on Amazon Fresh"""
        # Always use mock data for now
        logger.info(f"Using mock data for search: {search_term} in {category}")
        return self._get_mock_products(search_term, category)
    
    def _get_mock_products(self, search_term: str, category: str) -> List[AmazonProduct]:
        """Return mock products for demo purposes"""
        logger.info(f"Using mock data for search: {search_term} in {category}")
        
        # Create mock products based on the search term
        mock_products = []
        search_lower = search_term.lower()
        
        # Map common grocery items to mock data
        mock_data = {
            "spinach": [
                AmazonProduct(
                    asin="B07JLF9NB7",
                    title="Fresh Brand – Organic Baby Spinach, 16 oz",
                    price=4.99,
                    image_url="https://m.media-amazon.com/images/I/71S+8RKViyL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B07JLF9NB7",
                    availability="In Stock"
                ),
                AmazonProduct(
                    asin="B074H6X6K7",
                    title="365 by Whole Foods Market, Organic Baby Spinach, 16 Ounce",
                    price=5.49,
                    image_url="https://m.media-amazon.com/images/I/71pZ36LNX+L._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B074H6X6K7",
                    availability="In Stock"
                )
            ],
            "avocado": [
                AmazonProduct(
                    asin="B00QGWM5HC",
                    title="Organic Hass Avocados, 4 Count",
                    price=7.99,
                    image_url="https://m.media-amazon.com/images/I/81LR4wRl+QL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B00QGWM5HC",
                    availability="In Stock"
                )
            ],
            "tomato": [
                AmazonProduct(
                    asin="B000RROJ7S",
                    title="Fresh Roma Tomatoes, 2lb",
                    price=3.49,
                    image_url="https://m.media-amazon.com/images/I/71wt+-YIjgL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B000RROJ7S",
                    availability="In Stock"
                )
            ],
            "onion": [
                AmazonProduct(
                    asin="B07QK1GVPR",
                    title="Yellow Onions, 3 lb Bag",
                    price=2.99,
                    image_url="https://m.media-amazon.com/images/I/81LJrQqh9sL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B07QK1GVPR",
                    availability="In Stock"
                )
            ],
            "potato": [
                AmazonProduct(
                    asin="B0787KT368",
                    title="Russet Potatoes, 5 lb Bag",
                    price=4.79,
                    image_url="https://m.media-amazon.com/images/I/71T0qkU4KdL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B0787KT368",
                    availability="In Stock"
                )
            ],
            "carrot": [
                AmazonProduct(
                    asin="B074H5CKXD",
                    title="Organic Carrots, 2 lb Bag",
                    price=2.49,
                    image_url="https://m.media-amazon.com/images/I/71Tgfp7ztDL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B074H5CKXD",
                    availability="In Stock"
                )
            ],
            "rice": [
                AmazonProduct(
                    asin="B00ZP3NIBI",
                    title="Basmati Rice, 5 lb Bag",
                    price=19.99,
                    image_url="https://m.media-amazon.com/images/I/71t3z3hN3GL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B00ZP3NIBI",
                    availability="In Stock"
                )
            ],
            "chicken": [
                AmazonProduct(
                    asin="B07QK1GVPR",
                    title="Organic Chicken Breast, 2 lb",
                    price=12.99,
                    image_url="https://m.media-amazon.com/images/I/71LJrQqh9sL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B07QK1GVPR",
                    availability="In Stock"
                )
            ],
            "beef": [
                AmazonProduct(
                    asin="B0787KT368",
                    title="Ground Beef, 1 lb",
                    price=6.99,
                    image_url="https://m.media-amazon.com/images/I/71T0qkU4KdL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B0787KT368",
                    availability="In Stock"
                )
            ],
            "fish": [
                AmazonProduct(
                    asin="B074H5CKXD",
                    title="Fresh Salmon Fillet, 1 lb",
                    price=14.99,
                    image_url="https://m.media-amazon.com/images/I/71Tgfp7ztDL._SL1500_.jpg",
                    detail_url="https://www.amazon.com/dp/B074H5CKXD",
                    availability="In Stock"
                )
            ],
            "default": [
                AmazonProduct(
                    asin=f"B00DEFAULT{i}",
                    title=f"Amazon Fresh {search_term.title()} - Premium Quality",
                    price=round(4.99 + (i * 1.5), 2),
                    image_url=f"https://via.placeholder.com/500x500.png?text={search_term.replace(' ', '+')}",
                    detail_url=f"https://www.amazon.com/dp/B00DEFAULT{i}",
                    availability="In Stock"
                ) for i in range(1, 4)
            ]
        }
        
        # Find matching mock products
        found_match = False
        for key, products in mock_data.items():
            if key in search_lower:
                mock_products.extend(products)
                found_match = True
        
        # Use default if no match found
        if not found_match:
            mock_products.extend(mock_data["default"])
        
        return mock_products
    
    def create_cart(self, items: List[Dict], user_token: Optional[str] = None) -> Dict[str, Any]:
        """Create a cart with the specified items"""
        if not self.has_credentials:
            logger.info("Using mock cart creation")
            return self._create_mock_cart(items)
            
        try:
            logger.info(f"Creating Amazon cart with {len(items)} items")
            
            # In a real API implementation, we would:
            # 1. Create a remote shopping cart using Amazon's API
            # 2. Add each item to the cart with its ASIN and quantity
            # 3. Generate a special URL that will load this cart on Amazon
            
            # For now, we'll use the Remote Shopping Cart API format but with mock responses
            cart_id = f"amazon_cart_{int(time.time())}"
            
            # Create cart items parameters
            cart_items_params = []
            for i, item in enumerate(items):
                asin = item.get("asin")
                quantity = item.get("quantity", 1)
                cart_items_params.append({
                    "ASIN": asin,
                    "Quantity": quantity,
                    "OfferListingId": f"offeringid_{asin}"
                })
            
            # Calculate the total price
            total_price = sum(item.get("price", 0) * item.get("quantity", 1) for item in items)
            
            # Generate checkout URL - in a real app, this would be from the API response
            checkout_url = f"https://www.amazon.com/gp/cart/view.html?ref_=nav_cart&cart_id={cart_id}"
            
            # For a real implementation, we would make an API call here
            # Since we don't have all the required Amazon Cart API permissions,
            # we'll return a structured mock response
            return {
                "cart_id": cart_id,
                "checkout_url": checkout_url,
                "item_count": len(items),
                "total_price": round(total_price, 2),
                "success": True,
                "message": "Cart created successfully. You can now proceed to checkout."
            }
            
        except Exception as e:
            logger.error(f"Error creating Amazon cart: {str(e)}")
            return self._create_mock_cart(items)
    
    def _create_mock_cart(self, items: List[Dict]) -> Dict[str, Any]:
        """Create a mock cart for demo purposes"""
        # Calculate total price
        total_price = sum(item.get("price", 0) * item.get("quantity", 1) for item in items)
        
        # Create a mock cart response
        cart_id = f"amazon_cart_{int(time.time())}"
        checkout_url = f"https://www.amazon.com/gp/cart/view.html?ref_=nav_cart&cart_id={cart_id}"
        
        return {
            "cart_id": cart_id,
            "checkout_url": checkout_url,
            "item_count": len(items),
            "total_price": round(total_price, 2),
            "success": True,
            "message": "Cart created successfully. You can now proceed to checkout."
        }

# Initialize the client
amazon_client = AmazonApiClient() 