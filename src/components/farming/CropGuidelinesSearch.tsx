
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Sprout } from "lucide-react";

// Sample crop database with cultivation guidelines
const cropDatabase = [
  {
    name: "Rice",
    category: "Cereal",
    season: "Kharif",
    waterRequirement: "High",
    steps: [
      "Prepare the land: Puddle the soil to reduce water percolation",
      "Seed treatment: Treat seeds with fungicides before sowing",
      "Nursery preparation: Raise seedlings in raised beds",
      "Transplanting: Plant seedlings 20-25 days after sowing",
      "Water management: Maintain 5cm water level throughout growing period",
      "Fertilizer application: Apply NPK in split doses",
      "Weed management: Control weeds at early stages",
      "Harvesting: Harvest when 80% of the grains turn golden yellow"
    ],
    tips: "Avoid water stress during the reproductive phase. Consider SRI (System of Rice Intensification) for water conservation."
  },
  {
    name: "Wheat",
    category: "Cereal",
    season: "Rabi",
    waterRequirement: "Medium",
    steps: [
      "Land preparation: Plough and level the field properly",
      "Seed treatment: Treat seeds with fungicides",
      "Sowing: Sow in rows 20-22cm apart at 4-5cm depth",
      "Irrigation: Provide first irrigation 21 days after sowing",
      "Fertilizer application: Apply NPK in split doses",
      "Weed control: Use herbicides or manual weeding",
      "Harvesting: Harvest when crop turns golden yellow"
    ],
    tips: "Crown root initiation stage (21-25 days after sowing) is critical for irrigation. Avoid waterlogging."
  },
  {
    name: "Maize",
    category: "Cereal",
    season: "Both",
    waterRequirement: "Medium",
    steps: [
      "Land preparation: Plough and harrow to fine tilth",
      "Seed treatment: Treat seeds with fungicides and insecticides",
      "Sowing: Sow at 60×20 cm spacing at 5cm depth",
      "Thinning: Thin to one plant per hill 15 days after sowing",
      "Irrigation: Provide irrigation at critical stages",
      "Fertilizer application: Apply NPK in split doses",
      "Earthing up: Earth up soil around stems at 30-35 days after sowing",
      "Harvesting: Harvest when cobs turn brown and dry"
    ],
    tips: "Silking and tasseling stages are critical for irrigation. Avoid moisture stress during this period."
  },
  {
    name: "Cotton",
    category: "Fiber",
    season: "Kharif",
    waterRequirement: "Medium",
    steps: [
      "Land preparation: Deep ploughing and formation of ridges and furrows",
      "Seed treatment: Acid-delinting followed by fungicide treatment",
      "Sowing: Sow at 90×60 cm spacing",
      "Thinning: Thin to retain one plant per hill 15-20 days after sowing",
      "Irrigation: Critical stages are flowering and boll development",
      "Fertilizer application: Apply NPK in split doses",
      "Pest management: Regular monitoring and IPM practices",
      "Harvesting: Pick cotton when bolls are fully open"
    ],
    tips: "Adopt integrated pest management to control bollworms. Maintain optimal plant population."
  },
  {
    name: "Soybean",
    category: "Pulse",
    season: "Kharif",
    waterRequirement: "Medium-Low",
    steps: [
      "Land preparation: Fine seedbed preparation",
      "Seed treatment: Treat with Rhizobium culture",
      "Sowing: Sow at 30×10 cm spacing at 3-4cm depth",
      "Weed management: Keep field weed-free for first 40 days",
      "Irrigation: Critical stages are flowering and pod formation",
      "Fertilizer application: Apply NPK as basal dose",
      "Pest management: Monitor for defoliators and pod borers",
      "Harvesting: Harvest when pods turn yellow to brown"
    ],
    tips: "Avoid waterlogging. Soybean is sensitive to excess moisture and flooding."
  },
  {
    name: "Tomato",
    category: "Vegetable",
    season: "Year-round",
    waterRequirement: "Medium-High",
    steps: [
      "Nursery raising: Raise seedlings in raised beds or pro-trays",
      "Land preparation: Plough and harrow to fine tilth",
      "Transplanting: Transplant 25-30 days old seedlings at 60×45 cm spacing",
      "Staking: Provide support to plants as they grow",
      "Irrigation: Drip irrigation is ideal, maintain consistent moisture",
      "Pruning: Remove suckers to improve air circulation",
      "Fertilizer application: Apply NPK in split doses",
      "Harvesting: Harvest when fruits are firm and color has developed"
    ],
    tips: "Practice crop rotation to avoid soilborne diseases. Use mulching to conserve moisture and suppress weeds."
  },
  {
    name: "Potato",
    category: "Vegetable",
    season: "Rabi",
    waterRequirement: "Medium",
    steps: [
      "Land preparation: Deep ploughing and formation of ridges and furrows",
      "Seed tuber treatment: Treat with fungicides",
      "Planting: Plant tubers at 60×20 cm spacing at 5-6cm depth",
      "Earthing up: Earth up soil around plants 30 days after planting",
      "Irrigation: Light and frequent irrigation is ideal",
      "Fertilizer application: Apply NPK in split doses",
      "Pest and disease management: Regular monitoring for late blight",
      "Harvesting: Harvest when vines start yellowing and drying"
    ],
    tips: "Use certified seed tubers. Dehaulming (cutting off tops) 10 days before harvesting improves skin setting."
  },
  {
    name: "Sugarcane",
    category: "Commercial",
    season: "Year-round",
    waterRequirement: "High",
    steps: [
      "Land preparation: Deep ploughing and formation of furrows",
      "Sett treatment: Treat setts with fungicides",
      "Planting: Plant setts in furrows at 90cm spacing",
      "Gap filling: Fill gaps 30 days after planting",
      "Earthing up: Earth up soil around plants 60-70 days after planting",
      "Irrigation: Provide irrigation at critical stages",
      "Fertilizer application: Apply NPK in split doses",
      "Harvesting: Harvest when canes are mature (11-12 months)"
    ],
    tips: "Practice trashing (removing dried leaves) to reduce pest incidence. Ratooning can be practiced for the subsequent crop."
  },
  {
    name: "Groundnut",
    category: "Oilseed",
    season: "Kharif",
    waterRequirement: "Low-Medium",
    steps: [
      "Land preparation: Fine seedbed preparation",
      "Seed treatment: Treat with fungicides and Rhizobium culture",
      "Sowing: Sow at 30×10 cm spacing at 4-5cm depth",
      "Gypsum application: Apply gypsum 40-45 days after sowing",
      "Irrigation: Critical stages are flowering and peg formation",
      "Weed management: Keep field weed-free for first 45 days",
      "Pest management: Monitor for leaf miner and Spodoptera",
      "Harvesting: Harvest when leaves turn yellow and start drying"
    ],
    tips: "Light soil with good drainage is ideal. Calcium application is essential for pod development."
  },
  {
    name: "Mustard",
    category: "Oilseed",
    season: "Rabi",
    waterRequirement: "Low",
    steps: [
      "Land preparation: Fine seedbed preparation",
      "Seed treatment: Treat with fungicides",
      "Sowing: Sow in lines 30cm apart at 2-3cm depth",
      "Thinning: Thin to maintain 10-15cm plant to plant distance",
      "Irrigation: Pre-sowing irrigation and at critical stages",
      "Fertilizer application: Apply NPK as basal dose",
      "Pest management: Monitor for aphids and painted bug",
      "Harvesting: Harvest when siliquae (pods) turn yellowish brown"
    ],
    tips: "Early sowing gives better yield. Bee-keeping enhances pollination and increases yield."
  }
];

interface CropGuidelinesSearchProps {
  onSelectCrop?: (crop: any) => void;
}

const CropGuidelinesSearch = ({ onSelectCrop }: CropGuidelinesSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSelectCrop = (crop: any) => {
    setSelectedCrop(crop);
    if (onSelectCrop) {
      onSelectCrop(crop);
    }
  };
  
  const filteredCrops = cropDatabase.filter(crop => 
    crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.season.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              Search Crops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                placeholder="Search crop name, category or season..." 
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4"
              />
              
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {filteredCrops.length > 0 ? (
                    filteredCrops.map((crop) => (
                      <div 
                        key={crop.name} 
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedCrop?.name === crop.name 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleSelectCrop(crop)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{crop.name}</h3>
                          <Badge variant={selectedCrop?.name === crop.name ? "outline" : "secondary"}>
                            {crop.category}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs mt-1 gap-2">
                          <span className={selectedCrop?.name === crop.name ? "text-primary-foreground" : "text-muted-foreground"}>
                            Season: {crop.season}
                          </span>
                          <span className={selectedCrop?.name === crop.name ? "text-primary-foreground" : "text-muted-foreground"}>
                            Water: {crop.waterRequirement}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No crops found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        {selectedCrop ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-primary" />
                  {selectedCrop.name} Cultivation Guide
                </CardTitle>
                <div className="flex gap-2">
                  <Badge>{selectedCrop.category}</Badge>
                  <Badge variant="outline">{selectedCrop.season}</Badge>
                  <Badge variant="secondary">Water: {selectedCrop.waterRequirement}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Step-by-Step Cultivation Process</h3>
                  <ol className="space-y-3 list-decimal list-inside ml-2">
                    {selectedCrop.steps.map((step: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        <span className="text-foreground font-medium">{step.split(":")[0]}:</span> {step.split(":")[1]}
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Cultivation Tips</h3>
                  <p className="text-muted-foreground">{selectedCrop.tips}</p>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" asChild>
                    <a 
                      href={`https://www.google.com/search?q=${selectedCrop.name}+farming+techniques`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Learn More About {selectedCrop.name} Farming
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex flex-col justify-center items-center p-12">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Sprout className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Select a Crop</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Browse our database of cultivation guides or search for specific crops to view detailed planting and management techniques.
            </p>
            <p className="text-sm text-muted-foreground">
              {cropDatabase.length} crops available in the database
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CropGuidelinesSearch;
