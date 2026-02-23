import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '../contexts/LanguageContext';

interface RodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RodoModal({ open, onOpenChange }: RodoModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t('rodo.title')}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {t('rodo.purpose.title')}
              </h3>
              <p>{t('rodo.purpose.content')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {t('rodo.scope.title')}
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('rodo.scope.firstName')}</li>
                <li>{t('rodo.scope.lastName')}</li>
                <li>{t('rodo.scope.email')}</li>
                <li>{t('rodo.scope.phone')}</li>
                <li>{t('rodo.scope.message')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {t('rodo.storage.title')}
              </h3>
              <p>{t('rodo.storage.content')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {t('rodo.access.title')}
              </h3>
              <p>{t('rodo.access.content')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {t('rodo.rights.title')}
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('rodo.rights.access')}</li>
                <li>{t('rodo.rights.rectification')}</li>
                <li>{t('rodo.rights.erasure')}</li>
                <li>{t('rodo.rights.portability')}</li>
                <li>{t('rodo.rights.objection')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {t('rodo.contact.title')}
              </h3>
              <p>{t('rodo.contact.content')}</p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
