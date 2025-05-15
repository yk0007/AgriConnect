import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Filter, Search, Plus, Star, Info, Truck, Shield } from "lucide-react";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock product data for marketplace
  const products = [
    {
      id: 1,
      name: "Organic NPK Fertilizer",
      category: "Fertilizers",
      price: 1200,
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg",
      seller: "GreenGrow Organics",
      inStock: true
    },
    {
      id: 2,
      name: "Premium Rice Seeds (5kg)",
      category: "Seeds",
      price: 850,
      rating: 4.7,
      reviews: 98,
      image: "/placeholder.svg",
      seller: "Indian Seed Corp",
      inStock: true
    },
    {
      id: 3,
      name: "Tractor Rotary Tiller",
      category: "Equipment",
      price: 12500,
      rating: 4.5,
      reviews: 67,
      image: "/placeholder.svg",
      seller: "AgriMachines",
      inStock: true
    },
    {
      id: 4,
      name: "Organic Pesticide Spray",
      category: "Pesticides",
      price: 450,
      rating: 4.3,
      reviews: 53,
      image: "/placeholder.svg",
      seller: "Eco Crop Solutions",
      inStock: true
    },
    {
      id: 5,
      name: "Solar Water Pump Set",
      category: "Equipment",
      price: 15000,
      rating: 4.9,
      reviews: 32,
      image: "/placeholder.svg",
      seller: "SunFarm Tech",
      inStock: false
    },
    {
      id: 6,
      name: "High-Yield Wheat Seeds (10kg)",
      category: "Seeds",
      price: 1200,
      rating: 4.6,
      reviews: 87,
      image: "/placeholder.svg",
      seller: "Premium Agro Seeds",
      inStock: true
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Marketplace</h1>
          <p className="text-muted-foreground">
            Shop for quality farming products from trusted suppliers
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Sell Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search products..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="fertilizers">Fertilizers</TabsTrigger>
          <TabsTrigger value="seeds">Seeds</TabsTrigger>
          <TabsTrigger value="pesticides">Pesticides</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden hover-scale">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/75 backdrop-blur-sm flex items-center justify-center">
                      <Badge variant="destructive" className="text-base px-4 py-1.5">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3">
                    {product.category}
                  </Badge>
                </div>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground text-sm">
                      By {product.seller}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.reviews} reviews
                    </span>
                  </div>
                  <p className="text-xl font-bold text-primary mb-4">
                    ₹{product.price}
                  </p>
                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={!product.inStock}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="fertilizers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(product => product.category === "Fertilizers")
              .map(product => (
                <Card key={product.id} className="overflow-hidden hover-scale">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/75 backdrop-blur-sm flex items-center justify-center">
                        <Badge variant="destructive" className="text-base px-4 py-1.5">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">
                        By {product.seller}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.reviews} reviews
                      </span>
                    </div>
                    <p className="text-xl font-bold text-primary mb-4">
                      ₹{product.price}
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1" disabled={!product.inStock}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        {/* Other category tabs would have similar content */}
        <TabsContent value="seeds" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(product => product.category === "Seeds")
              .map(product => (
                <Card key={product.id} className="overflow-hidden hover-scale">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/75 backdrop-blur-sm flex items-center justify-center">
                        <Badge variant="destructive" className="text-base px-4 py-1.5">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">
                        By {product.seller}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.reviews} reviews
                      </span>
                    </div>
                    <p className="text-xl font-bold text-primary mb-4">
                      ₹{product.price}
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1" disabled={!product.inStock}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pesticides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(product => product.category === "Pesticides")
              .map(product => (
                <Card key={product.id} className="overflow-hidden hover-scale">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/75 backdrop-blur-sm flex items-center justify-center">
                        <Badge variant="destructive" className="text-base px-4 py-1.5">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">
                        By {product.seller}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.reviews} reviews
                      </span>
                    </div>
                    <p className="text-xl font-bold text-primary mb-4">
                      ₹{product.price}
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1" disabled={!product.inStock}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="equipment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(product => product.category === "Equipment")
              .map(product => (
                <Card key={product.id} className="overflow-hidden hover-scale">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/75 backdrop-blur-sm flex items-center justify-center">
                        <Badge variant="destructive" className="text-base px-4 py-1.5">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground text-sm">
                        By {product.seller}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.reviews} reviews
                      </span>
                    </div>
                    <p className="text-xl font-bold text-primary mb-4">
                      ₹{product.price}
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1" disabled={!product.inStock}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 bg-card border rounded-lg p-6">
        <h2 className="text-xl font-bold font-heading mb-4">Why Shop With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Verified Products</h3>
            <p className="text-sm text-muted-foreground">
              All products on our marketplace are verified for quality and authenticity
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Most products shipped within 24-48 hours with delivery tracking
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Expert Support</h3>
            <p className="text-sm text-muted-foreground">
              Get advice from agricultural experts about the products you're interested in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
