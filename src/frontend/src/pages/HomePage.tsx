import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Zap, CheckCircle, Code, Rocket, ExternalLink, Settings, Users, ShoppingCart, Wifi } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetWeb3Cards } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import ContactForm from '../components/ContactForm';
import Web3CardManager from '../components/Web3CardManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { translateWeb3Card, getTranslatedCardContent } from '../lib/translationService';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: web3Cards = [] } = useGetWeb3Cards();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  // Animation state for the main slogan
  const [animationPhase, setAnimationPhase] = useState<'complete' | 'fadeOut' | 'showTworzymy' | 'showZ' | 'showPasja' | 'shake'>('complete');

  // Animation effect for the main slogan
  useEffect(() => {
    const runAnimation = () => {
      // Start fade out
      setAnimationPhase('fadeOut');
      
      setTimeout(() => {
        setAnimationPhase('showTworzymy');
      }, 1000);
      
      setTimeout(() => {
        setAnimationPhase('showZ');
      }, 3000);
      
      setTimeout(() => {
        setAnimationPhase('showPasja');
      }, 5000);
      
      setTimeout(() => {
        setAnimationPhase('shake');
      }, 8000);
      
      setTimeout(() => {
        setAnimationPhase('complete');
      }, 11000);
    };

    // Start the animation cycle every 30 seconds
    const interval = setInterval(runAnimation, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Render the animated slogan with proper translations
  const renderAnimatedSlogan = () => {
    const baseClasses = "text-4xl md:text-6xl font-bold mb-12 leading-tight py-4";
    
    switch (animationPhase) {
      case 'fadeOut':
        return (
          <h1 className={`${baseClasses} animated-slogan-fade-out`}>
            <span className="text-web2">{t('hero.animated.tworzymy')}</span>{' '}
            <span className="text-orange-500">{t('hero.animated.z')}</span>{' '}
            <span className="text-web3">{t('hero.animated.pasja')}</span>
          </h1>
        );
      case 'showTworzymy':
        return (
          <h1 className={`${baseClasses} animated-slogan-show`}>
            <span className="text-web2">{t('hero.animated.tworzymy')}</span>
          </h1>
        );
      case 'showZ':
        return (
          <h1 className={`${baseClasses} animated-slogan-show`}>
            <span className="text-web2">{t('hero.animated.tworzymy')}</span>{' '}
            <span className="text-orange-500">{t('hero.animated.z')}</span>
          </h1>
        );
      case 'showPasja':
        return (
          <h1 className={`${baseClasses} animated-slogan-show`}>
            <span className="text-web2">{t('hero.animated.tworzymy')}</span>{' '}
            <span className="text-orange-500">{t('hero.animated.z')}</span>{' '}
            <span className="text-web3">{t('hero.animated.pasja')}</span>
          </h1>
        );
      case 'shake':
        return (
          <h1 className={`${baseClasses} animated-slogan-shake`}>
            <span className="text-web2">{t('hero.animated.tworzymy')}</span>{' '}
            <span className="text-orange-500">{t('hero.animated.z')}</span>{' '}
            <span className="text-web3">{t('hero.animated.pasja')}</span>
          </h1>
        );
      default:
        return (
          <h1 className={`${baseClasses} bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent`}>
            <span className="text-web2">{t('hero.animated.tworzymy')}</span>{' '}
            <span className="text-orange-500">{t('hero.animated.z')}</span>{' '}
            <span className="text-web3">{t('hero.animated.pasja')}</span>
          </h1>
        );
    }
  };

  // Custom scroll function that accounts for the fixed header height
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64; // 16 * 4px = 64px (h-16 in Tailwind)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const openKaSKaWebsite = () => {
    window.open('https://kaska.foxp2.pl', '_blank');
  };

  // Helper function to render the KaSKa subtitle with special styling
  const renderKaSKaSubtitle = () => {
    const text = t('projects.web2.subtitle2');
    
    // For Polish language, apply special styling
    if (language === 'pl' && text.includes('KaSKa - Kapitalny System Kateringowy')) {
      return (
        <span>
          <span className="kaska-orange">KaSKa</span> - <span className="kaska-styled">Ka</span>pitalny <span className="kaska-styled">S</span>ystem <span className="kaska-styled">Ka</span>teringowy
        </span>
      );
    }
    
    // For other languages, return as is
    return text;
  };

  // Helper function to render the additional KaSKa text with orange styling
  const renderKaSKaAdditionalText = () => {
    const text = t('projects.web2.additional');
    
    // For Polish language, apply special styling to KaSKa
    if (language === 'pl' && text.includes('System KaSKa składa się')) {
      return (
        <span>
          System <span className="kaska-orange">KaSKa</span> składa się z następujących trzech zasadniczych elementów:
        </span>
      );
    }
    
    // For other languages, return as is
    return text;
  };

  // Helper function to render card titles with KaSKa in orange
  const renderCardTitle = (title: string) => {
    if (title.includes('KaSKa')) {
      const parts = title.split('KaSKa');
      return (
        <span>
          {parts[0]}<span className="kaska-orange">KaSKa</span>{parts[1]}
        </span>
      );
    }
    return title;
  };

  // Helper function to render formatted text with line breaks and bullet points
  const renderFormattedDescription = (text: string) => {
    // Split by newlines and process each line
    const lines = text.split('\n');
    
    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          // Check if line starts with a bullet point
          if (line.startsWith('- ')) {
            return (
              <div key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{line.substring(2)}</span>
              </div>
            );
          }
          // Regular line
          return line.trim() ? (
            <div key={index}>{line}</div>
          ) : null;
        })}
      </div>
    );
  };

  // Helper function to render Web3 subtitle with bold formatting
  const renderWeb3Subtitle = () => {
    const text = t('projects.web3.subtitle');
    
    // Check if text contains markdown-style bold formatting
    if (text.includes('**')) {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span>
          {parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              // Remove the ** markers and make bold
              const boldText = part.slice(2, -2);
              return <strong key={index}>{boldText}</strong>;
            }
            return part;
          })}
        </span>
      );
    }
    
    return text;
  };

  // Get translated Web3 cards based on current language
  const getTranslatedWeb3Cards = () => {
    return web3Cards.map(card => {
      const translatedCard = translateWeb3Card(card);
      const content = getTranslatedCardContent(translatedCard, language);
      return {
        ...card,
        title: content.title,
        description: content.description,
        buttonTitle: content.buttonTitle,
      };
    });
  };

  const translatedWeb3Cards = getTranslatedWeb3Cards();

  // Component to display Web3 card image
  const Web3CardImage = ({ imagePath, title }: { imagePath: string; title: string }) => {
    const { data: imageUrl } = useFileUrl(imagePath);
    
    if (!imageUrl) {
      return (
        <div className="w-40 h-[90px] bg-muted rounded-lg border-2 border-orange-500 flex items-center justify-center">
          <div className="text-xs text-muted-foreground">Loading...</div>
        </div>
      );
    }
    
    return (
      <div className="w-40 h-[90px] rounded-lg border-2 border-orange-500 overflow-hidden flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTYwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iOTAiIGZpbGw9IiNmMWYxZjEiLz48dGV4dCB4PSI4MCIgeT0iNDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2U8L3RleHQ+PC9zdmc+';
          }}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        {renderAnimatedSlogan()}
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {t('hero.subtitle')}
        </p>
        
        <ContactForm>
          <Button size="lg" className="text-lg px-8 py-6">
            {t('contact.button')}
          </Button>
        </ContactForm>
      </section>

      {/* Services Section */}
      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
        <div className="relative">
          <Card className="group transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer relative z-10"
                onClick={() => scrollToSection('web2-projects')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-primary/5 rounded-full w-fit group-hover:bg-primary/10 transition-colors backdrop-blur-sm">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-5xl md:text-6xl font-bold text-web2 mb-2 shake-on-hover">
                {t('web2.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                {t('web2.description')}
              </CardDescription>
            </CardContent>
          </Card>
          {/* Gradient Shadow */}
          <div className="absolute top-2 left-2 w-full h-full bg-gradient-to-br from-gray-400/40 via-gray-400/20 to-gray-400/5 dark:from-gray-600/40 dark:via-gray-600/20 dark:to-gray-600/5 rounded-lg blur-sm -z-10 group-hover:from-gray-400/50 group-hover:via-gray-400/25 group-hover:to-gray-400/8 dark:group-hover:from-gray-600/50 dark:group-hover:via-gray-600/25 dark:group-hover:to-gray-600/8 transition-all duration-300"></div>
        </div>

        <div className="relative">
          <Card className="group transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer relative z-10"
                onClick={() => scrollToSection('web3-projects')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-primary/5 rounded-full w-fit group-hover:bg-primary/10 transition-colors backdrop-blur-sm">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-5xl md:text-6xl font-bold text-web3 mb-2 shake-on-hover">
                {t('web3.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                {t('web3.description')}
              </CardDescription>
            </CardContent>
          </Card>
          {/* Gradient Shadow */}
          <div className="absolute top-2 left-2 w-full h-full bg-gradient-to-br from-gray-400/40 via-gray-400/20 to-gray-400/5 dark:from-gray-600/40 dark:via-gray-600/20 dark:to-gray-600/5 rounded-lg blur-sm -z-10 group-hover:from-gray-400/50 group-hover:via-gray-400/25 group-hover:to-gray-400/8 dark:group-hover:from-gray-600/50 dark:group-hover:via-gray-600/25 dark:group-hover:to-gray-600/8 transition-all duration-300"></div>
        </div>
      </section>

      {/* Web2 Projects Section */}
      <section id="web2-projects" className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-web2">
            {t('projects.web2.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            {t('projects.web2.subtitle')}
          </p>
          <div className="text-center mb-4">
            <img 
              src="/assets/logo.png" 
              alt="KaSKa Logo" 
              className="mx-auto mb-4 h-20 w-auto object-contain rounded-2xl border-3 border-orange-500"
              onError={(e) => {
                console.warn('Logo image failed to load:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-muted-foreground">
              {renderKaSKaSubtitle()}
            </h3>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {renderKaSKaAdditionalText()}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <div className="mb-3 p-2 bg-primary/5 rounded-lg w-fit backdrop-blur-sm">
                <Users className="h-6 w-6 text-web2" />
              </div>
              <CardTitle className="text-xl">{renderCardTitle(t('projects.web2.project1.title'))}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="text-base flex-1 mb-4">
                {renderFormattedDescription(t('projects.web2.project1.description'))}
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openKaSKaWebsite}
                className="w-full mt-auto"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('projects.web2.moreInfo')}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <div className="mb-3 p-2 bg-primary/5 rounded-lg w-fit backdrop-blur-sm">
                <ShoppingCart className="h-6 w-6 text-web2" />
              </div>
              <CardTitle className="text-xl">{renderCardTitle(t('projects.web2.project2.title'))}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="text-base flex-1 mb-4">
                {renderFormattedDescription(t('projects.web2.project2.description'))}
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openKaSKaWebsite}
                className="w-full mt-auto"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('projects.web2.moreInfo')}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <div className="mb-3 p-2 bg-primary/5 rounded-lg w-fit backdrop-blur-sm">
                <Wifi className="h-6 w-6 text-web2" />
              </div>
              <CardTitle className="text-xl">{renderCardTitle(t('projects.web2.project3.title'))}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="text-base flex-1 mb-4">
                {t('projects.web2.project3.description')}
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openKaSKaWebsite}
                className="w-full mt-auto"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('projects.web2.moreInfo')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Web3 Projects Section */}
      <section id="web3-projects" className="mb-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-web3">
              {t('projects.web3.title')}
            </h2>
            {/* Admin Web3 Card Management Button */}
            {isLoggedIn && isAdmin && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t('web3.admin.manage')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t('web3.admin.title')}</DialogTitle>
                  </DialogHeader>
                  <Web3CardManager />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            {renderWeb3Subtitle()}
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('projects.web3.intro')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {translatedWeb3Cards.map((card) => (
            <Card key={card.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Title at the top with Zap icon */}
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-web3 flex-shrink-0" />
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                </div>
                
                {/* Responsive layout: flex on desktop/tablet, flex-col on mobile */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  {/* Image - centered on mobile, left-aligned on desktop */}
                  <div className="flex justify-center sm:justify-start">
                    <Web3CardImage imagePath={card.imagePath} title={card.title} />
                  </div>
                  {/* Description - centered on mobile, left-aligned on desktop */}
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
                  </div>
                </div>
                
                {/* Button at bottom right */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(card.link, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {card.buttonTitle}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {translatedWeb3Cards.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-3 p-2 bg-primary/5 rounded-lg w-fit backdrop-blur-sm">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{t('projects.web3.project1.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t('projects.web3.project1.description')}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-3 p-2 bg-primary/5 rounded-lg w-fit backdrop-blur-sm">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{t('projects.web3.project2.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t('projects.web3.project2.description')}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-3 p-2 bg-primary/5 rounded-lg w-fit backdrop-blur-sm">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{t('projects.web3.project3.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t('projects.web3.project3.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Cooperation Process Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            {t('cooperation.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('cooperation.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-3 p-3 bg-primary/5 rounded-full w-fit backdrop-blur-sm">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('cooperation.stage1.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {t('cooperation.stage1.description')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-3 p-3 bg-primary/5 rounded-full w-fit backdrop-blur-sm">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('cooperation.stage2.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {t('cooperation.stage2.description')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-3 p-3 bg-primary/5 rounded-full w-fit backdrop-blur-sm">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('cooperation.stage3.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {t('cooperation.stage3.description')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-3 p-3 bg-primary/5 rounded-full w-fit backdrop-blur-sm">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('cooperation.stage4.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {t('cooperation.stage4.description')}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
