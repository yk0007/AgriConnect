
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store as StoreIcon, Plus, Search, Filter, Package, Truck, Calendar, Leaf, ShoppingBag, CircleDollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Product category background images
const categoryBackgrounds = {
  rice: "https://images.unsplash.com/photo-1568347355280-d33dff366b74?q=80&w=1200",
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200", 
  potatoes: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1200",
  mangoes: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1200",
  tomatoes: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?q=80&w=1200",
  organic: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1200",
  default: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=1200"
};

const Store = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock produce data
  const userListings = [
    {
      id: 1,
      product: "Rice",
      variety: "Basmati",
      quantity: 500,
      unit: "kg",
      price: 45,
      location: "Punjab",
      organic: true,
      listed: "2 days ago",
      views: 34,
      inquiries: 5,
      category: "rice"
    },
    {
      id: 2,
      product: "Tomatoes",
      variety: "Hybrid",
      quantity: 200,
      unit: "kg",
      price: 30,
      location: "Maharashtra",
      organic: false,
      listed: "1 week ago",
      views: 72,
      inquiries: 8,
      category: "tomatoes"
    }
  ];
  
  const marketListings = [
    {
      id: 3,
      product: "Wheat",
      variety: "Premium",
      quantity: 1000,
      unit: "kg",
      price: 28,
      location: "Haryana",
      seller: "Gupta Farms",
      sellerRating: 4.8,
      organic: false,
      available: "Immediate",
      category: "wheat"
    },
    {
      id: 4,
      product: "Potatoes",
      variety: "Red",
      quantity: 800,
      unit: "kg",
      price: 20,
      location: "Uttar Pradesh",
      seller: "Krishna Agriculture",
      sellerRating: 4.5,
      organic: false,
      available: "In 1 week",
      category: "potatoes"
    },
    {
      id: 5,
      product: "Mangoes",
      variety: "Alphonso",
      quantity: 300,
      unit: "kg",
      price: 120,
      location: "Maharashtra",
      seller: "Desai Orchards",
      sellerRating: 4.9,
      organic: true,
      available: "Immediate",
      category: "mangoes"
    },
    {
      id: 6,
      product: "Organic Rice",
      variety: "Brown",
      quantity: 400,
      unit: "kg",
      price: 65,
      location: "Kerala",
      seller: "Green Earth Farms",
      sellerRating: 4.7,
      organic: true,
      available: "In 3 days",
      category: "rice"
    }
  ];
  
  const getProductBackground = (category: string) => {
    return categoryBackgrounds[category as keyof typeof categoryBackgrounds] || categoryBackgrounds.default;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Virtual Store</h1>
          <p className="text-muted-foreground">
            Sell your produce directly to buyers and browse other farmers' offerings
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          List New Produce
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search listings..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="grains">Grains</SelectItem>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="fruits">Fruits</SelectItem>
            <SelectItem value="organic">Organic Only</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Marketplace</TabsTrigger>
          <TabsTrigger value="mylistings">My Listings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketListings.map(listing => (
              <Card key={listing.id} className="overflow-hidden relative hover:shadow-lg transition-shadow">
                {/* Background image with gradient overlay */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <img 
                    src={getProductBackground(listing.category)} 
                    alt={listing.product}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                
                <CardHeader className="pb-0 relative z-10 pt-16">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                        {listing.product}
                        {listing.organic && (
                          <Badge className="bg-green-500 text-white hover:bg-green-600">Organic</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-gray-200">{listing.variety}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white/90 text-primary border-primary font-bold">
                      ₹{listing.price}/{listing.unit}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 bg-white p-4 mt-3 rounded-t-xl">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-primary mr-2" />
                      <span>
                        <span className="font-medium">{listing.quantity}</span> {listing.unit} available
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-primary mr-2" />
                      <span>Available: {listing.available}</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-primary mr-2" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center">
                      <StoreIcon className="h-4 w-4 text-primary mr-2" />
                      <span className="truncate">{listing.seller}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Purchase
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mylistings" className="mt-6">
          {userListings.length > 0 ? (
            <div className="space-y-4">
              {userListings.map(listing => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="relative md:w-4/12">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
                      <img 
                        src={getProductBackground(listing.category)} 
                        alt={listing.product}
                        className="w-full h-full object-cover object-center md:h-full absolute inset-0"
                      />
                      <div className="relative z-20 h-48 md:h-full flex items-center p-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white">{listing.product}</h3>
                          <p className="text-gray-200">{listing.variety}</p>
                          <Badge className={`mt-2 ${listing.organic ? 'bg-green-500 hover:bg-green-600' : 'bg-primary'}`}>
                            {listing.organic ? 'Organic' : 'Standard'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 md:w-5/12">
                      <div className="mb-4">
                        <Badge variant="outline" className="bg-primary/10 text-primary mb-3">
                          ₹{listing.price}/{listing.unit}
                        </Badge>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium">{listing.quantity} {listing.unit}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium">{listing.location}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Listed</p>
                            <p className="font-medium">{listing.listed}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Value</p>
                            <p className="font-medium">₹{listing.quantity * listing.price}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline">Edit Listing</Button>
                        <Button variant="destructive">Remove</Button>
                      </div>
                    </div>
                    
                    <div className="p-6 border-t md:border-t-0 md:border-l border-border md:w-3/12 bg-muted/30">
                      <h4 className="font-medium mb-4">Listing Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Views</span>
                          <span className="font-medium">{listing.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Inquiries</span>
                          <span className="font-medium">{listing.inquiries}</span>
                        </div>
                        <div className="pt-4">
                          <Button variant="outline" className="w-full">
                            View Inquiries
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
                  <StoreIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  You haven't created any produce listings yet. Start selling your farm produce by creating your first listing.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <Card className="mt-10 border-none shadow-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-primary" />
            Selling Tips
          </CardTitle>
          <CardDescription>
            Tips to help you sell your produce faster and at better prices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center mr-1">1</div>
                Quality Images
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Include clear, well-lit photos of your produce to attract more buyers
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center mr-1">2</div>
                Competitive Pricing
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Research current market rates to set competitive prices for your produce
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center mr-1">3</div>
                Detailed Description
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Provide detailed information about freshness, harvesting date, and quality
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Store;
