import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Bug, Droplets, Leaf, Presentation } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';

const features = [
  {
    icon: <Presentation className="w-8 h-8 text-primary" />,
    title: 'AI-Powered Analysis',
    description: 'Upload images or video frames of your crops to get instant analysis on diseases, pests, and soil health.',
    image: PlaceHolderImages.find(p => p.id === 'feature-analysis'),
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'Expert Chatbot',
    description: 'Ask our AI-powered chatbot any agricultural question and get immediate, expert advice.',
    image: PlaceHolderImages.find(p => p.id === 'feature-chatbot'),
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: 'Personalized Dashboard',
    description: 'Track your submission history, view detailed reports, and monitor your farm\'s health over time.',
    image: PlaceHolderImages.find(p => p.id === 'feature-dashboard'),
  },
];

const analysisIcons = [
  { icon: <Leaf className="w-10 h-10 text-primary" />, name: 'Diseases' },
  { icon: <Bug className="w-10 h-10 text-primary" />, name: 'Pests' },
  { icon: <Droplets className="w-10 h-10 text-primary" />, name: 'Dryness' },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'landing-hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full pt-12 md:pt-24 lg:pt-32">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover object-center -z-10"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50 -z-10" />
          <div className="container px-4 md:px-6 text-center text-white">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Welcome to AgriVision AI
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80">
                Revolutionizing agriculture with AI-powered insights for healthier crops and better yields.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button size="lg" asChild>
                  <Link href="/dashboard">Get Started for Free</Link>
                </Button>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto pb-16">
              {analysisIcons.map((item) => (
                <Link key={item.name} href={`/dashboard/analysis?category=${item.name}`} className="flex flex-col items-center gap-2 group">
                  <div className="p-4 bg-background/20 rounded-full backdrop-blur-sm group-hover:bg-background/30 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Smarter Farming, Simplified
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides powerful tools to help you monitor and improve your farm's health with ease.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-12">
              {features.map((feature) => (
                <Card key={feature.title} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {feature.image && (
                    <div className="aspect-video relative">
                      <Image
                        src={feature.image.imageUrl}
                        alt={feature.image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={feature.image.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {feature.icon}
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Transform Your Farm?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join AgriVision AI today and take the first step towards a more productive and sustainable future.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-x-2">
              <Button asChild size="lg">
                <Link href="/dashboard">Try the Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 AgriVision AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
