import { Mail, Phone, MessageCircle, Copy, Check, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerPrincipalAndAdminStatus } from '../hooks/useQueries';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import RodoModal from './RodoModal';

export default function Footer() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: callerInfo } = useGetCallerPrincipalAndAdminStatus();
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rodoModalOpen, setRodoModalOpen] = useState(false);

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const handleImageError = () => {
    setImageError(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <footer id="footer" className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info with Logo */}
            <div>
              <div className="mb-4">
                {/* Company Logo */}
                {!imageError ? (
                  <img 
                    src="/assets/generated/foxp2.png" 
                    alt="FoxP2 Logo" 
                    className="h-16 w-auto rounded-lg"
                    onError={handleImageError}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <div className="h-16 flex items-center">
                    <h3 className="text-2xl font-bold text-primary">
                      {t('company.name')}
                    </h3>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mb-4">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.contact.title')}</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <a 
                    href="https://oc.app/?ref=zhs7r-qqaaa-aaaar-a6bsq-cai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('footer.contact.openchat')}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <a 
                    href="tel:+48503074672" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('footer.contact.phone')}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <a 
                    href="mailto:biuro@foxp2.pl" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('footer.contact.email')}
                  </a>
                </div>
                
                {/* Principal ID Display - Only when logged in, now in contact section */}
                {isLoggedIn && callerInfo && (
                  <div className="pt-3 border-t border-muted-foreground/20">
                    <div className="text-xs text-muted-foreground">
                      <div>{t('footer.principalId.label')}:</div>
                      <div className="font-mono text-xs break-all mt-1 flex items-center gap-2">
                        <span className="flex-1">
                          {callerInfo.principal.toString()}
                          {callerInfo.isAdmin && (
                            <span className="ml-2 text-orange-500 font-medium">
                              ({t('footer.principalId.admin')})
                            </span>
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-muted"
                          onClick={() => copyToClipboard(callerInfo.principal.toString())}
                          title={t('footer.principalId.copy')}
                        >
                          {copied ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      {copied && (
                        <div className="text-xs text-green-500 mt-1">
                          {t('footer.principalId.copied')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.services.title')}</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <span className="text-web2">{t('footer.services.web2')}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-web3">{t('footer.services.web3')}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('footer.services.consulting')}
                </div>
              </div>
            </div>
          </div>

          {/* RODO and Copyright */}
          <div className="border-t mt-8 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* RODO Button */}
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRodoModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {t('rodo.button')}
                </Button>
              </div>

              {/* Copyright */}
              <div className="text-center text-sm text-muted-foreground">
                {t('footer.copyrightText')}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <RodoModal open={rodoModalOpen} onOpenChange={setRodoModalOpen} />
    </>
  );
}
