import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Moon, Sun, Languages, LogIn, LogOut, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '../contexts/LanguageContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import AdminMessagesDialog from './AdminMessagesDialog';

export default function Header() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin = false } = useIsCallerAdmin();

  const languageOptions = [
    { code: 'pl' as const, name: 'Polski', flag: '🇵🇱' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentLanguage = languageOptions.find(lang => lang.code === language);
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      clear();
    } else {
      try {
        await login();
      } catch (error) {
        console.error('Login error:', error);
      }
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

  const scrollToWeb2 = () => {
    scrollToSection('web2-projects');
  };

  const scrollToWeb3 = () => {
    scrollToSection('web3-projects');
  };

  const scrollToFooter = () => {
    scrollToSection('footer');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/50 backdrop-blur-md supports-[backdrop-filter]:bg-background/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">{t('company.name')}</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={scrollToWeb2}
            className="text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            {t('nav.web2')}
          </button>
          <button 
            onClick={scrollToWeb3}
            className="text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            {t('nav.web3')}
          </button>
          <button 
            onClick={scrollToFooter}
            className="text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            {t('nav.contact')}
          </button>
        </nav>

        <div className="flex items-center space-x-2">
          {/* Admin Messages Button - Only visible to logged-in admins */}
          {isLoggedIn && isAdmin && (
            <AdminMessagesDialog>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">{t('admin.messages.title')}</span>
              </Button>
            </AdminMessagesDialog>
          )}

          {/* Authentication Button */}
          <Button
            variant={isLoggedIn ? "outline" : "default"}
            size="sm"
            onClick={handleAuthAction}
            disabled={isLoggingIn}
            className="flex items-center space-x-2"
          >
            {isLoggingIn ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>...</span>
              </>
            ) : isLoggedIn ? (
              <>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('auth.logout')}</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{t('auth.login')}</span>
              </>
            )}
          </Button>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title={t('language.select')}>
                <Languages className="h-4 w-4" />
                <span className="sr-only">{t('language.select')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languageOptions.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? 'bg-accent' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={t('theme.toggle')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t('theme.toggle')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
