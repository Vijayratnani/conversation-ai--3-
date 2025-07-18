import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Headphones, Mic, BarChart3, Globe } from "lucide-react"

export default function Products() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground mt-1">Explore our voice analysis products and services</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Voice Analyzer Pro",
            description: "Advanced voice analysis with sentiment detection and language identification",
            icon: Headphones,
            price: "$49",
            features: ["Multi-language support", "Sentiment analysis", "Speaker identification", "Transcription"],
          },
          {
            title: "Call Recorder Suite",
            description: "Professional call recording with automatic transcription and analysis",
            icon: Mic,
            price: "$79",
            features: ["HD recording", "Cloud storage", "Automatic transcription", "Analytics dashboard"],
          },
          {
            title: "Analytics Dashboard",
            description: "Comprehensive analytics for your voice data with custom reports",
            icon: BarChart3,
            price: "$39",
            features: ["Custom reports", "Data visualization", "Export options", "Team collaboration"],
          },
          {
            title: "Multilingual Pack",
            description: "Extended language support for global voice analysis needs",
            icon: Globe,
            price: "$29",
            features: ["50+ languages", "Dialect detection", "Accent recognition", "Translation features"],
          },
        ].map((product, i) => (
          <Card key={i} className="card-hover overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-md gradient-bg flex items-center justify-center">
                  <product.icon className="h-5 w-5 text-white" />
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {product.price}/month
                </Badge>
              </div>
              <CardTitle className="mt-4">{product.title}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <ul className="space-y-2">
                {product.features.map((feature, j) => (
                  <li key={j} className="flex items-center text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full mt-4">Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
