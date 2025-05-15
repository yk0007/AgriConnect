
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Leaf, Droplet, Sun, CloudRain, CalendarDays, Sprout, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import CropGuidelinesSearch from "../components/farming/CropGuidelinesSearch";

const FarmingMethods = () => {
  const [activeTab, setActiveTab] = useState("traditional");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Farming Methods & Guidelines</h1>
        <p className="text-muted-foreground">
          Explore different farming techniques and crop cultivation guides
        </p>
      </div>
      
      <Tabs defaultValue="traditional" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="traditional">Traditional Methods</TabsTrigger>
          <TabsTrigger value="modern">Modern Techniques</TabsTrigger>
          <TabsTrigger value="cropGuides">Crop Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="traditional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trees className="h-5 w-5 text-primary" />
                Traditional Farming Methodologies
              </CardTitle>
              <CardDescription>
                Time-tested agricultural practices that have been passed down through generations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Indigenous Farming Systems</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Jhum Cultivation (Northeastern India)</h3>
                      <p className="text-sm text-muted-foreground">
                        A traditional slash-and-burn agriculture practiced in northeastern states. Land is cleared, vegetation is burned, and multiple crops are grown together.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline">Sustainable</Badge>
                        <Badge variant="outline">Shifting Cultivation</Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold">Zabo Farming (Nagaland)</h3>
                      <p className="text-sm text-muted-foreground">
                        An indigenous farming system combining forestry, animal husbandry, and agriculture with efficient water management.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline">Water Conservation</Badge>
                        <Badge variant="outline">Integrated</Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold">Dhap Farming (West Bengal)</h3>
                      <p className="text-sm text-muted-foreground">
                        A wetland cultivation practice where crops are grown on artificially constructed islands surrounded by water bodies.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline">Wetland</Badge>
                        <Badge variant="outline">Flood-Resistant</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Traditional Methods & Techniques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Crop Rotation</h3>
                      <p className="text-sm text-muted-foreground">
                        The practice of growing different types of crops in the same area across seasons to improve soil health, optimize nutrients, and combat pest and weed pressure.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline">Soil Health</Badge>
                        <Badge variant="outline">Sustainable</Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold">Mixed Cropping</h3>
                      <p className="text-sm text-muted-foreground">
                        Growing two or more crops simultaneously in the same field, providing insurance against crop failure and maximizing land use.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline">Risk Management</Badge>
                        <Badge variant="outline">Land Optimization</Badge>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold">Traditional Seed Storage</h3>
                      <p className="text-sm text-muted-foreground">
                        Methods like storing seeds in ash, neem leaves, or traditional containers to preserve seed viability and protect against pests.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline">Seed Preservation</Badge>
                        <Badge variant="outline">Indigenous Knowledge</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Traditional Water Management Systems</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold flex items-center">
                          <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                          Kuls (Himachal Pradesh)
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Water channels that carry glacial waters to villages for irrigation. This gravity-flow system has been used for centuries in the Himalayan regions.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold flex items-center">
                          <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                          Ahar-Pyne (Bihar)
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Traditional floodwater harvesting system with 'Ahar' (catchment basin) and 'Pyne' (channels) to divert water from rivers to fields for irrigation.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold flex items-center">
                          <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                          Johads (Rajasthan)
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Small earthen check dams that capture and store rainwater, helping to recharge groundwater and provide water for irrigation and livestock.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Benefits of Traditional Methods
              </CardTitle>
              <CardDescription>
                Understanding why traditional practices remain valuable in modern agriculture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Ecological Sustainability</h3>
                      <p className="text-sm text-muted-foreground">
                        Traditional methods evolved over centuries to work in harmony with local ecosystems, often preserving biodiversity and natural resources.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <CloudRain className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Climate Resilience</h3>
                      <p className="text-sm text-muted-foreground">
                        Many traditional farming methods are adapted to local climate conditions and can withstand weather fluctuations better than some modern approaches.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Sun className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Low External Input</h3>
                      <p className="text-sm text-muted-foreground">
                        Traditional farming typically requires fewer external inputs like chemical fertilizers and pesticides, making it more accessible to smallholder farmers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Cultural Heritage</h3>
                      <p className="text-sm text-muted-foreground">
                        Traditional methods preserve agricultural knowledge and cultural practices that have been developed and refined over generations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modern" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                Modern Farming Technologies
              </CardTitle>
              <CardDescription>
                Contemporary agricultural innovations that enhance productivity and sustainability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Precision Agriculture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Utilizes GPS, sensors, robotics, and data analytics to optimize field-level management for improved crop performance and reduced waste.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm">Variable Rate Technology (VRT) for precise application of inputs</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm">Soil mapping and grid sampling for targeted soil management</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm">Yield monitoring systems to track productivity variations</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge>Data-Driven</Badge>
                      <Badge variant="outline">Resource Efficiency</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Protected Cultivation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Growing crops in controlled environments to protect them from unfavorable conditions and enhance production quality.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm">Polyhouse/greenhouse cultivation for year-round production</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm">Shade nets and rain shelters to protect sensitive crops</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm">Hydroponics and vertical farming for space optimization</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge>Climate Control</Badge>
                      <Badge variant="outline">High Yield</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Integrated Farming</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Combines multiple agricultural activities to create synergistic systems that maximize resource efficiency and minimize waste.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm">Aquaponics: combining fish farming with hydroponics</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm">Agroforestry: integrating trees with crop and livestock systems</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <p className="text-sm">Integrated pest management for reduced chemical usage</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge>Sustainable</Badge>
                      <Badge variant="outline">Diversified</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Advanced Irrigation Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold flex items-center">
                            <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                            Drip Irrigation
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Delivers water directly to plant roots through a network of valves, pipes, tubing, and emitters. Reduces water usage by 30-70% compared to surface irrigation methods.
                          </p>
                          <Badge className="mt-2" variant="outline">Water Efficient</Badge>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold flex items-center">
                            <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                            Micro-Sprinklers
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Spray water over small areas near plant roots. Suitable for tree crops and provides better coverage than drip systems for certain applications.
                          </p>
                          <Badge className="mt-2" variant="outline">Uniform Distribution</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold flex items-center">
                            <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                            Sensor-Based Irrigation
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Uses soil moisture sensors and weather data to automate irrigation scheduling. Delivers water only when needed, optimizing water use and plant health.
                          </p>
                          <Badge className="mt-2" variant="outline">Smart Technology</Badge>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold flex items-center">
                            <Droplet className="h-4 w-4 text-blue-500 mr-2" />
                            Subsurface Drip Irrigation (SDI)
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Delivers water directly to the root zone below the soil surface. Reduces evaporation loss and allows for simultaneous field operations.
                          </p>
                          <Badge className="mt-2" variant="outline">Minimum Evaporation</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cropGuides">
          <CropGuidelinesSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmingMethods;
