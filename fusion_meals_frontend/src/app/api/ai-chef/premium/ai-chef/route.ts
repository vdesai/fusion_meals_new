import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the session cookie to pass to the backend
    const sessionCookie = request.cookies.get('session_id');
    
    // Demo mode for testing - if no session, create a demo response
    if (!sessionCookie) {
      console.log("No session found, returning demo response for:", body.request_type);
      
      // For demo purposes, return sample responses based on request type
      if (body.request_type === "meal_plan") {
        return NextResponse.json({
          premium_content: {
            meal_plan: {
              days: [
                {
                  day: "Monday",
                  breakfast: {
                    name: "Greek Yogurt Parfait",
                    description: "Greek yogurt with honey, nuts and fresh berries",
                    time_to_prepare: "5 minutes",
                    calories: "350 kcal"
                  },
                  lunch: {
                    name: "Mediterranean Salad",
                    description: "Fresh greens with feta, olives, and grilled chicken",
                    time_to_prepare: "15 minutes",
                    calories: "450 kcal"
                  },
                  dinner: {
                    name: "Herb-Crusted Salmon",
                    description: "Oven-baked salmon with a crispy herb topping, served with roasted vegetables",
                    time_to_prepare: "30 minutes",
                    calories: "550 kcal",
                    wine_pairing: "Pinot Grigio"
                  },
                  snacks: [
                    {
                      name: "Apple with Almond Butter",
                      description: "Sliced apple with 1 tbsp almond butter",
                      calories: "200 kcal"
                    },
                    {
                      name: "Mixed Nuts",
                      description: "1oz of mixed raw nuts",
                      calories: "170 kcal"
                    }
                  ]
                },
                {
                  day: "Tuesday",
                  breakfast: {
                    name: "Avocado Toast",
                    description: "Whole grain toast with mashed avocado, cherry tomatoes, and poached egg",
                    time_to_prepare: "10 minutes",
                    calories: "380 kcal"
                  },
                  lunch: {
                    name: "Quinoa Bowl",
                    description: "Quinoa with roasted sweet potatoes, black beans, and avocado",
                    time_to_prepare: "20 minutes",
                    calories: "420 kcal"
                  },
                  dinner: {
                    name: "Lemon Garlic Chicken",
                    description: "Roasted chicken breast with lemon and garlic, served with asparagus and wild rice",
                    time_to_prepare: "40 minutes",
                    calories: "580 kcal",
                    wine_pairing: "Sauvignon Blanc"
                  },
                  snacks: [
                    {
                      name: "Greek Yogurt with Honey",
                      description: "Plain Greek yogurt with a drizzle of honey",
                      calories: "180 kcal"
                    },
                    {
                      name: "Carrot Sticks with Hummus",
                      description: "Fresh carrot sticks with 2 tbsp hummus",
                      calories: "140 kcal"
                    }
                  ]
                },
                {
                  day: "Wednesday",
                  breakfast: {
                    name: "Berry Smoothie Bowl",
                    description: "Frozen berries blended with banana and topped with granola and chia seeds",
                    time_to_prepare: "8 minutes",
                    calories: "340 kcal"
                  },
                  lunch: {
                    name: "Turkey Wrap",
                    description: "Whole grain wrap with turkey, avocado, lettuce, and mustard",
                    time_to_prepare: "10 minutes",
                    calories: "410 kcal"
                  },
                  dinner: {
                    name: "Vegetable Stir Fry",
                    description: "Seasonal vegetables stir-fried with tofu and served over brown rice",
                    time_to_prepare: "25 minutes",
                    calories: "490 kcal",
                    wine_pairing: "Riesling"
                  },
                  snacks: [
                    {
                      name: "Cottage Cheese with Pineapple",
                      description: "1/2 cup cottage cheese with fresh pineapple chunks",
                      calories: "160 kcal"
                    },
                    {
                      name: "Dark Chocolate Square",
                      description: "1 oz of 70% dark chocolate",
                      calories: "170 kcal"
                    }
                  ]
                },
                {
                  day: "Thursday",
                  breakfast: {
                    name: "Overnight Oats",
                    description: "Rolled oats soaked overnight with almond milk, topped with sliced banana and cinnamon",
                    time_to_prepare: "5 minutes (plus overnight soaking)",
                    calories: "360 kcal"
                  },
                  lunch: {
                    name: "Lentil Soup",
                    description: "Hearty lentil soup with carrots, celery, and spinach, served with a slice of crusty bread",
                    time_to_prepare: "30 minutes",
                    calories: "390 kcal"
                  },
                  dinner: {
                    name: "Baked Cod with Herbs",
                    description: "Oven-baked cod with fresh herbs, served with quinoa and roasted brussels sprouts",
                    time_to_prepare: "35 minutes",
                    calories: "520 kcal",
                    wine_pairing: "Chardonnay"
                  },
                  snacks: [
                    {
                      name: "Bell Peppers with Guacamole",
                      description: "Sliced bell peppers with 2 tbsp guacamole",
                      calories: "150 kcal"
                    },
                    {
                      name: "Rice Cakes with Peanut Butter",
                      description: "2 rice cakes with 1 tbsp natural peanut butter",
                      calories: "180 kcal"
                    }
                  ]
                },
                {
                  day: "Friday",
                  breakfast: {
                    name: "Veggie Omelette",
                    description: "Two-egg omelette with spinach, bell peppers, and feta cheese",
                    time_to_prepare: "12 minutes",
                    calories: "320 kcal"
                  },
                  lunch: {
                    name: "Tuna Salad",
                    description: "Mixed greens with tuna, cherry tomatoes, cucumber, and light vinaigrette",
                    time_to_prepare: "15 minutes",
                    calories: "380 kcal"
                  },
                  dinner: {
                    name: "Mushroom Risotto",
                    description: "Creamy arborio rice with wild mushrooms, parmesan, and fresh herbs",
                    time_to_prepare: "45 minutes",
                    calories: "610 kcal",
                    wine_pairing: "Pinot Noir"
                  },
                  snacks: [
                    {
                      name: "Protein Smoothie",
                      description: "Protein powder blended with banana, spinach, and almond milk",
                      calories: "220 kcal"
                    },
                    {
                      name: "Edamame",
                      description: "1 cup steamed edamame with sea salt",
                      calories: "150 kcal"
                    }
                  ]
                },
                {
                  day: "Saturday",
                  breakfast: {
                    name: "Whole Grain Pancakes",
                    description: "Whole grain pancakes topped with fresh berries and a drizzle of maple syrup",
                    time_to_prepare: "20 minutes",
                    calories: "420 kcal"
                  },
                  lunch: {
                    name: "Chickpea Salad Sandwich",
                    description: "Mashed chickpeas with celery, red onion, and light mayo on whole grain bread",
                    time_to_prepare: "15 minutes",
                    calories: "440 kcal"
                  },
                  dinner: {
                    name: "Grilled Steak",
                    description: "Lean grilled steak with chimichurri sauce, sweet potato, and grilled vegetables",
                    time_to_prepare: "35 minutes",
                    calories: "650 kcal",
                    wine_pairing: "Malbec"
                  },
                  snacks: [
                    {
                      name: "Trail Mix",
                      description: "1/4 cup homemade trail mix with nuts, seeds, and dried fruit",
                      calories: "190 kcal"
                    },
                    {
                      name: "Fresh Fruit",
                      description: "Seasonal fresh fruit assortment",
                      calories: "120 kcal"
                    }
                  ]
                },
                {
                  day: "Sunday",
                  breakfast: {
                    name: "Breakfast Burrito",
                    description: "Scrambled eggs with black beans, avocado, salsa, and cheese in a whole wheat tortilla",
                    time_to_prepare: "15 minutes",
                    calories: "460 kcal"
                  },
                  lunch: {
                    name: "Roasted Vegetable Soup",
                    description: "Blended soup of roasted seasonal vegetables with a slice of whole grain bread",
                    time_to_prepare: "40 minutes",
                    calories: "350 kcal"
                  },
                  dinner: {
                    name: "Baked Eggplant Parmesan",
                    description: "Baked eggplant layered with tomato sauce and fresh mozzarella, served with a side salad",
                    time_to_prepare: "50 minutes",
                    calories: "580 kcal",
                    wine_pairing: "Chianti"
                  },
                  snacks: [
                    {
                      name: "Homemade Kale Chips",
                      description: "Crispy kale chips baked with olive oil and sea salt",
                      calories: "130 kcal"
                    },
                    {
                      name: "Greek Yogurt with Berries",
                      description: "Plain Greek yogurt with mixed berries and a drizzle of honey",
                      calories: "160 kcal"
                    }
                  ]
                }
              ]
            },
            grocery_list: {
              "proteins": [
                "Chicken breast (1 lb)",
                "Salmon fillets (1 lb)",
                "Greek yogurt (32 oz)",
                "Lean ground turkey (1 lb)",
                "Tofu, extra firm (14 oz)",
                "Eggs (1 dozen)",
                "Tuna (2 cans)",
                "Lean steak (12 oz)",
                "Cottage cheese (16 oz)"
              ],
              "produce": [
                "Mixed greens (1 bag)",
                "Cherry tomatoes (1 pint)",
                "Cucumber (2)",
                "Red onion (1)",
                "Apples (3)",
                "Mixed berries (2 pints)",
                "Bananas (5)",
                "Avocados (3)",
                "Sweet potatoes (2)",
                "Asparagus (1 bunch)",
                "Carrots (1 bunch)",
                "Bell peppers (3)",
                "Spinach (1 bag)",
                "Brussels sprouts (1 lb)",
                "Mushrooms (8 oz)",
                "Eggplant (1)",
                "Fresh herbs: basil, parsley, cilantro",
                "Lemons (2)",
                "Garlic (1 head)",
                "Ginger root (1 small piece)"
              ],
              "dairy": [
                "Feta cheese (4 oz)",
                "Parmesan cheese (4 oz)",
                "Mozzarella, fresh (8 oz)",
                "Almond milk (1/2 gallon)",
                "Butter (small package)"
              ],
              "grains": [
                "Whole grain bread (1 loaf)",
                "Quinoa (1 lb)",
                "Brown rice (1 lb)",
                "Wild rice (12 oz)",
                "Arborio rice (1 lb)",
                "Rolled oats (18 oz)",
                "Whole grain tortillas (8 pack)",
                "Whole grain pancake mix (small box)"
              ],
              "legumes": [
                "Black beans (1 can)",
                "Chickpeas (1 can)",
                "Lentils (16 oz)"
              ],
              "other": [
                "Olive oil",
                "Balsamic vinegar",
                "Mixed nuts (12 oz)",
                "Almond butter (8 oz)",
                "Honey (small jar)",
                "Hummus (8 oz)",
                "Chia seeds (small package)",
                "Granola (12 oz)",
                "Protein powder (if you don't already have)",
                "Maple syrup (small bottle)",
                "Dark chocolate (3.5 oz)",
                "Rice cakes (1 package)",
                "Peanut butter (small jar)",
                "Dried fruit (small package)",
                "Salsa (small jar)",
                "Tomato sauce (16 oz)"
              ]
            },
            meal_prep_guide: {
              day: "Sunday",
              instructions: [
                "Wash and chop all vegetables for the week",
                "Cook a batch of quinoa and brown rice",
                "Marinate chicken breasts",
                "Prepare homemade dressing for salads",
                "Make a large pot of lentil soup for lunches",
                "Portion nuts and snacks into containers",
                "Prepare overnight oats in jars for easy weekday breakfasts",
                "Roast a tray of mixed vegetables for easy sides"
              ],
              storage_tips: [
                "Store chopped vegetables in airtight containers with paper towels to absorb moisture",
                "Keep nuts and seeds in the refrigerator to maintain freshness",
                "Store homemade dressings in small jars",
                "Freeze individual portions of soups and stews in freezer-safe containers",
                "Keep herbs fresh by storing them like flowers in a glass of water in the refrigerator",
                "Label all containers with contents and date prepared"
              ]
            },
            nutrition_summary: {
              average_daily_calories: "1720 kcal",
              protein_ratio: "30%",
              carb_ratio: "45%",
              fat_ratio: "25%",
              daily_macros: {
                calories_breakdown: {
                  breakfast: "~350-450 kcal",
                  lunch: "~380-450 kcal",
                  dinner: "~490-650 kcal",
                  snacks: "~300-370 kcal"
                },
                protein: {
                  grams: "129g",
                  sources: ["Lean meats", "Fish", "Greek yogurt", "Eggs", "Legumes"]
                },
                carbohydrates: {
                  grams: "194g",
                  sources: ["Whole grains", "Fruits", "Vegetables", "Legumes"]
                },
                fats: {
                  grams: "48g",
                  sources: ["Avocado", "Olive oil", "Nuts", "Seeds", "Fatty fish"]
                },
                fiber: {
                  grams: "32g",
                  sources: ["Vegetables", "Fruits", "Whole grains", "Legumes"]
                }
              },
              micronutrients: {
                vitamin_a: "120% DV",
                vitamin_c: "180% DV",
                calcium: "95% DV",
                iron: "85% DV"
              }
            },
            estimated_total_cost: "$85-95 per week"
          },
          user_subscription: {
            level: "premium",
            expiry_date: new Date(Date.now() + 30*24*60*60*1000).toISOString()
          },
          request_remaining: 25,
          suggestions: [
            "Try adding more plant-based meals to your plan",
            "Consider meal prepping on Sunday for the week",
            "Add more variety to your protein sources",
            "Experiment with international cuisines for more flavor options",
            "Try batch cooking to save time during busy weekdays"
          ]
        });
      } else if (body.request_type === "cooking_guidance") {
        // Sample cooking guidance response
        return NextResponse.json({
          premium_content: {
            recipe_overview: {
              name: body.recipe_text || "Spaghetti Carbonara",
              difficulty: "Intermediate",
              estimated_time: "30 minutes"
            },
            professional_techniques: [
              {
                name: "Tempering Eggs",
                description: "Slowly incorporating hot liquid into eggs to raise their temperature without scrambling",
                pro_tip: "Add a ladleful of hot pasta water to your egg mixture while whisking continuously before adding to pasta"
              },
              {
                name: "Al Dente Pasta",
                description: "Cooking pasta until it's tender but still firm when bitten",
                pro_tip: "Always taste test rather than strictly following package timing - typically cook 1-2 minutes less than recommended"
              },
              {
                name: "Emulsification",
                description: "Creating a smooth sauce by incorporating fat into liquid",
                pro_tip: "Reserve at least 1 cup of starchy pasta water to help bind your sauce together"
              }
            ],
            step_by_step_guide: [
              {
                step: 1,
                instruction: "Bring a large pot of salted water to a rolling boil (it should taste like sea water)",
                timing: "5-8 minutes",
                chef_notes: "The salt is crucial for properly seasoning the pasta from within"
              },
              {
                step: 2,
                instruction: "While water is heating, dice pancetta or guanciale into small cubes",
                timing: "3 minutes",
                chef_notes: "Quarter-inch cubes provide optimal texture. Keep the fat, it's essential for flavor"
              },
              {
                step: 3,
                instruction: "In a large bowl, whisk together eggs, grated Pecorino Romano, grated Parmesan, freshly ground black pepper, and a tiny pinch of salt",
                timing: "2 minutes",
                chef_notes: "Room temperature eggs will incorporate better into the hot pasta"
              },
              {
                step: 4,
                instruction: "Add spaghetti to boiling water and cook until al dente",
                timing: "8-10 minutes",
                chef_notes: "Stir occasionally to prevent sticking, but don't break the pasta strands"
              },
              {
                step: 5,
                instruction: "While pasta cooks, add pancetta to a cold, large skillet, then turn to medium heat and cook until crisp and fat has rendered",
                timing: "8 minutes",
                chef_notes: "Starting in a cold pan allows fat to render more evenly"
              },
              {
                step: 6,
                instruction: "Reserve 1 cup of pasta water, then drain pasta (but don't rinse)",
                timing: "30 seconds",
                chef_notes: "Move quickly - pasta should be very hot for the next step"
              },
              {
                step: 7,
                instruction: "Immediately add hot pasta to the pan with pancetta, toss quickly to coat with fat",
                timing: "1 minute",
                chef_notes: "Keep the pan off heat during this step to prevent eggs from scrambling"
              },
              {
                step: 8,
                instruction: "Add a splash of pasta water to egg mixture while whisking (tempering), then quickly pour mixture over pasta and toss vigorously",
                timing: "1 minute",
                chef_notes: "The residual heat will cook the eggs into a silky sauce - never return the pan to high heat"
              },
              {
                step: 9,
                instruction: "Add more pasta water as needed to create a glossy sauce that coats each strand",
                timing: "1 minute",
                chef_notes: "The sauce will thicken as it cools, so keep it slightly loose at first"
              }
            ],
            common_pitfalls: [
              {
                issue: "Scrambled eggs instead of smooth sauce",
                solution: "Remove pan from heat before adding eggs, and continuously toss while incorporating"
              },
              {
                issue: "Sauce too thick and clumpy",
                solution: "Add more pasta water in small increments while tossing until silky"
              },
              {
                issue: "Sauce too watery",
                solution: "Let it rest for 30 seconds, the starch will help thicken it; add more cheese if needed"
              },
              {
                issue: "Bland flavor profile",
                solution: "Be generous with black pepper and properly salt the pasta water; use high-quality aged Pecorino and Parmesan"
              }
            ],
            equipment_recommendations: [
              {
                item: "Large heavy-bottomed skillet",
                purpose: "Even heat distribution for cooking pancetta and finishing pasta",
                alternative: "Sauté pan or Dutch oven"
              },
              {
                item: "Wooden spoon or tongs",
                purpose: "Gently tossing pasta without breaking strands",
                alternative: "Silicone-tipped tongs"
              },
              {
                item: "Microplane or fine grater",
                purpose: "Finely grating hard cheeses for smooth incorporation",
                alternative: "Box grater's finest side"
              }
            ],
            plating_guide: {
              description: "Twirl pasta into a neat mound using a carving fork against a ladle or plate, creating height in the center",
              garnish_suggestions: ["Freshly grated Pecorino Romano", "Coarsely ground black pepper", "Finely chopped Italian parsley (nontraditional but adds color)"],
              presentation_tips: ["Serve in warmed shallow bowls to maintain temperature", "Use a portion size that allows the pasta to be the star - about 2oz dry pasta per person for appetizer, 4oz for main", "Garnish immediately before serving for maximum visual impact"]
            },
            advanced_variations: [
              {
                name: "Carbonara with Seasonal Vegetables",
                modification: "Add blanched spring peas or asparagus tips just before serving",
                additional_ingredients: ["Fresh spring peas", "Blanched asparagus tips", "Lemon zest"]
              },
              {
                name: "Luxurious Truffle Carbonara",
                modification: "Finish with freshly shaved black truffle and a few drops of truffle oil",
                additional_ingredients: ["Fresh black truffle", "High-quality truffle oil", "Parmigiano-Reggiano aged 36 months"]
              },
              {
                name: "Seafood Carbonara",
                modification: "Replace pancetta with sautéed pancetta and add seared scallops",
                additional_ingredients: ["Large sea scallops", "Lemon zest", "Chives"]
              }
            ]
          },
          user_subscription: {
            level: "premium",
            expiry_date: new Date(Date.now() + 30*24*60*60*1000).toISOString()
          },
          request_remaining: 25,
          suggestions: [
            "Explore other classic Italian pasta techniques",
            "Learn about wine pairings for pasta dishes",
            "Discover regional variations of carbonara across Italy",
            "Master egg-based pasta sauces"
          ]
        });
      } else if (body.request_type === "ingredient_sourcing") {
        // Sample ingredient sourcing response
        const ingredient = body.specific_ingredient || "truffles";
        
        return NextResponse.json({
          premium_content: {
            ingredient_guide: [
              {
                ingredient: ingredient,
                quality_indicators: [
                  "Intense aroma - fresh truffles should have a strong, earthy scent",
                  "Firm texture - should not be soft, mushy or have any dark spots",
                  "Proper weight - should feel dense for their size",
                  "Marbled interior - when cut, should display distinctive marbling pattern"
                ],
                sourcing_locations: [
                  {
                    name: "Specialty Gourmet Shops",
                    type: "Retail",
                    price_range: "$$$-$$$$",
                    quality: "Excellent to Superior"
                  },
                  {
                    name: "Farmers Markets (in truffle regions)",
                    type: "Direct",
                    price_range: "$$$",
                    quality: "Excellent"
                  },
                  {
                    name: "Online Specialty Importers",
                    type: "E-commerce",
                    price_range: "$$$-$$$$",
                    quality: "Good to Excellent"
                  },
                  {
                    name: "Restaurant Suppliers",
                    type: "Wholesale",
                    price_range: "$$$",
                    quality: "Good to Superior"
                  }
                ],
                selection_tips: [
                  "Always smell before purchasing - the aroma should be potent and pleasant",
                  "Buy whole truffles rather than pre-sliced when possible",
                  "Select truffles that feel firm and heavy for their size",
                  "For black truffles, look for specimens with visible veining when cut",
                  "For white truffles, color should be pale beige to cream, never yellow or brown"
                ],
                seasonality: {
                  peak_season: "Black: Winter (Dec-Mar), White: Fall (Oct-Dec)",
                  availability: "Fresh available seasonally, preserved year-round",
                  seasonal_notes: "Black summer truffles (May-Aug) are less aromatic and less expensive than winter varieties"
                },
                storage_method: {
                  duration: "Fresh: 5-7 days maximum",
                  instructions: "Wrap loosely in paper towel, place in airtight container with uncooked rice to absorb moisture, store in refrigerator. Change paper towel daily. Never freeze fresh truffles."
                },
                sustainable_options: [
                  {
                    description: "Cultivated black truffles",
                    certification: "Local farm certifications vary by country",
                    benefits: "More sustainable than wild-foraged, helps preserve wild truffle habitats"
                  },
                  {
                    description: "Truffle-infused products",
                    certification: "Look for all-natural ingredient lists",
                    benefits: "Longer shelf life, more affordable, less environmental impact"
                  }
                ]
              }
            ],
            estimated_total_cost: {
              premium: "$500-1,500 per pound for fresh black winter truffles, $1,500-4,000 per pound for fresh white truffles",
              mid_range: "$50-150 for high-quality truffle products (oils, salts, butters)",
              budget: "$15-30 for truffle-infused products"
            },
            specialty_recommendations: [
              {
                store: "Eataly",
                location: "Various US cities",
                specialty: "Italian imported truffles and truffle products",
                notes: "Offers seasonal fresh truffles with authentication certificates"
              },
              {
                store: "Urbani Truffles",
                location: "Online + NYC physical store",
                specialty: "Full range of fresh truffles and preserved products",
                notes: "Direct importer with connections to European truffle hunters"
              },
              {
                store: "Regalis Foods",
                location: "Online + NYC",
                specialty: "High-end fresh truffles and specialty foods",
                notes: "Supplies top restaurants, excellent quality control"
              },
              {
                store: "D'Artagnan",
                location: "Online",
                specialty: "Fresh seasonal truffles and preserved truffle products",
                notes: "Reliable quality and overnight shipping"
              }
            ],
            preparing_and_serving: {
              cleaning: "Gently brush dirt off with a soft brush. For black truffles only, you can briefly rinse with cold water and pat dry immediately. Never wash white truffles.",
              serving_temperature: "Always serve at room temperature to maximize aroma",
              preserving_methods: [
                "Store in airtight container with fresh eggs to infuse flavor into eggs",
                "Make truffle butter by mixing finely chopped truffles with high-quality butter",
                "Infuse in neutral oil for truffle oil (use within 1 week)"
              ],
              pairing_recommendations: [
                "Eggs - the proteins in eggs capture and hold truffle aroma exceptionally well",
                "Risotto - the creamy texture highlights truffle flavor without competition",
                "Fresh pasta - particularly with butter or cream-based sauces",
                "Mashed potatoes - the starch absorbs and distributes truffle flavor",
                "Mild soft cheeses - brie or similar create excellent carriers for truffle flavor"
              ]
            }
          },
          user_subscription: {
            level: "premium",
            expiry_date: new Date(Date.now() + 30*24*60*60*1000).toISOString()
          },
          request_remaining: 25,
          suggestions: [
            "Explore other luxury ingredients and how to source them",
            "Learn about seasonal ingredient availability in your area",
            "Discover how to store specialty ingredients properly",
            "Find reliable specialty food suppliers near you"
          ]
        });
      } else if (body.request_type === "recipe_curation") {
        // Sample recipe curation response
        const cuisine = body.cuisine_type || "Italian";
        const occasion = body.occasion || "Dinner Party";
        
        return NextResponse.json({
          premium_content: {
            curated_menu: {
              theme: `${cuisine} ${occasion}`,
              overview: `A sophisticated ${cuisine} menu perfect for entertaining guests at your next ${occasion}. This carefully curated selection balances traditional flavors with modern presentation, featuring seasonal ingredients and dishes that can be partially prepared in advance.`,
              chef_notes: `This menu is designed to impress while allowing you to spend time with your guests. Most components can be prepared ahead, with final cooking and assembly done just before serving.`
            },
            recipes: [
              {
                course: "Appetizer",
                dish_name: "Burrata with Heirloom Tomatoes and Basil Oil",
                description: "Creamy burrata cheese served with colorful heirloom tomatoes, drizzled with basil-infused olive oil and aged balsamic reduction",
                prep_time: "15 minutes",
                difficulty: "Easy",
                make_ahead: "Basil oil can be made 1 day ahead, other components assembled just before serving",
                wine_pairing: "Pinot Grigio or Vermentino",
                chef_technique: "For the perfect basil oil, blanch basil leaves for 10 seconds before blending with oil to maintain vibrant color",
                presentation_tip: "Serve on a white plate or slate board to showcase the vibrant colors"
              },
              {
                course: "First Course",
                dish_name: "Risotto ai Funghi Porcini",
                description: "Creamy Arborio rice risotto with dried porcini mushrooms, fresh cremini mushrooms, Parmigiano-Reggiano, and fresh thyme",
                prep_time: "40 minutes",
                difficulty: "Intermediate",
                make_ahead: "Prepare mushroom stock a day ahead; par-cook risotto 15 minutes before guests arrive, finish just before serving",
                wine_pairing: "Barbera d'Alba or light Nebbiolo",
                chef_technique: "Rehydrate dried porcini in warm water for 30 minutes, then strain through coffee filter and use the liquid in your stock for intense mushroom flavor",
                presentation_tip: "Serve in shallow bowls, finishing with shaved Parmigiano-Reggiano, a drizzle of extra virgin olive oil, and fresh thyme leaves"
              },
              {
                course: "Main Course",
                dish_name: "Osso Buco alla Milanese",
                description: "Slow-braised veal shanks in white wine, broth, and aromatics, served with saffron risotto and gremolata",
                prep_time: "30 minutes prep + 2.5 hours cooking",
                difficulty: "Intermediate",
                make_ahead: "Can be made entirely 1 day ahead and reheated; flavors improve overnight",
                wine_pairing: "Barolo or Barbaresco",
                chef_technique: "Brown the veal shanks thoroughly before braising to develop rich flavor; tie with kitchen twine to maintain shape during cooking",
                presentation_tip: "Serve each shank standing upright in a shallow bowl with risotto alongside, garnished with fresh gremolata"
              },
              {
                course: "Dessert",
                dish_name: "Panna Cotta with Seasonal Fruit Coulis",
                description: "Silky vanilla bean panna cotta with berry coulis and fresh berries",
                prep_time: "20 minutes prep + 4 hours chilling",
                difficulty: "Easy",
                make_ahead: "Make up to 2 days ahead; prepare coulis 1 day ahead",
                wine_pairing: "Moscato d'Asti or Vin Santo",
                chef_technique: "Use just enough gelatin to set the cream but keep it wobbly; bloom gelatin completely before incorporating",
                presentation_tip: "Unmold onto dessert plates, pool coulis around base, garnish with fresh berries and a small sprig of mint"
              }
            ],
            shopping_list: {
              produce: ["Heirloom tomatoes", "Fresh basil", "Garlic", "Shallots", "Thyme", "Italian parsley", "Lemons", "Oranges", "Celery", "Carrots", "Onions", "Fresh cremini mushrooms", "Seasonal berries"],
              dairy: ["Burrata cheese", "Heavy cream", "Parmigiano-Reggiano", "Unsalted butter", "Mascarpone"],
              meat: ["Veal shanks (1 per person)", "Pancetta"],
              pantry: ["Arborio rice", "Dried porcini mushrooms", "Saffron threads", "Vanilla beans", "Extra virgin olive oil", "Aged balsamic vinegar", "Beef stock", "White wine", "Red wine", "Gelatin sheets or powder", "Bay leaves", "Sea salt", "Black peppercorns"],
              specialty_items: ["High-quality extra virgin olive oil for finishing", "Flaky sea salt"]
            },
            preparation_timeline: {
              "2 days before": [
                "Make panna cotta and refrigerate",
                "Purchase all non-perishable ingredients",
                "Make beef stock for osso buco if making from scratch"
              ],
              "1 day before": [
                "Make basil oil",
                "Prepare mushroom stock for risotto",
                "Prepare osso buco completely, cool and refrigerate",
                "Make fruit coulis for panna cotta",
                "Chop all vegetables for risotto, store in refrigerator"
              ],
              "Day of, morning": [
                "Purchase fresh ingredients (burrata, herbs, etc.)",
                "Set table",
                "Prepare gremolata, refrigerate",
                "Slice and season tomatoes, keep at room temperature"
              ],
              "1 hour before guests arrive": [
                "Remove osso buco from refrigerator to take chill off",
                "Measure all risotto ingredients",
                "Remove panna cotta from refrigerator"
              ],
              "After guests arrive": [
                "Assemble and serve appetizer",
                "Reheat osso buco",
                "Begin cooking risotto",
                "Plate and serve each course"
              ]
            },
            cultural_context: {
              history: `Osso Buco originated in Milan in the 19th century. The name means "bone with a hole," referring to the marrow hole in the center of the veal shank. Traditionally served with risotto alla Milanese, which gets its golden color from saffron - a spice introduced to Milan through trade with the Middle East.`,
              regional_significance: `This menu represents the cuisine of Northern Italy, particularly Lombardy, which tends to feature more butter and rice compared to the olive oil and pasta of Southern Italy. Each dish has been refined over centuries and represents the sophisticated culinary tradition of Milan.`,
              traditional_occasions: `In Italy, this would be considered a special occasion meal, often served at Sunday family gatherings or important celebrations. The lengthy cooking time of osso buco symbolizes the care and attention given to honored guests.`
            },
            dietary_modifications: {
              gluten_free: "This menu is naturally gluten-free; ensure any stock used is also gluten-free",
              vegetarian: "Replace osso buco with mushroom and vegetable ragout over polenta; use vegetable stock for risotto",
              dairy_free: "Substitute olive oil for butter in risotto; use coconut cream for panna cotta; omit burrata and offer marinated vegetables instead"
            }
          },
          user_subscription: {
            level: "premium",
            expiry_date: new Date(Date.now() + 30*24*60*60*1000).toISOString()
          },
          request_remaining: 25,
          suggestions: [
            "Explore other cuisine types for your next dinner party",
            "Learn about wine and food pairing principles",
            "Discover make-ahead entertaining strategies",
            "Find more seasonal menu ideas"
          ]
        });
      } else {
        // For other request types or invalid requests
        return NextResponse.json(
          { detail: "Please log in to access premium features" }, 
          { status: 401 }
        );
      }
    }
    
    // Forward the request to the backend API
    const response = await fetch(`${process.env.BACKEND_URL || 'http://127.0.0.1:8001'}/ai-chef/premium/ai-chef`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionCookie.value}`
      },
      body: JSON.stringify(body),
    });
    
    // Get the response data
    const data = await response.json();
    
    // If the response is not ok, handle it appropriately
    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || 'Failed to process request' }, 
        { status: response.status }
      );
    }
    
    // Return the successful response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in AI Chef premium API route:', error);
    return NextResponse.json(
      { detail: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}