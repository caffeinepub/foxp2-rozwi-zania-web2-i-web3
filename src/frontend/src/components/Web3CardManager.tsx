import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, ExternalLink, Languages, Upload, X, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetWeb3Cards, useAddWeb3Card, useUpdateWeb3Card, useDeleteWeb3Card } from '../hooks/useQueries';
import { useFileUpload, useFileUrl } from '../blob-storage/FileStorage';
import type { Web3Card } from '../backend';
import { toast } from 'sonner';
import { translateWeb3Card, getTranslationQuality, type TranslatedWeb3Card } from '../lib/translationService';

interface Web3CardFormData {
  id: string;
  imagePath: string;
  title: string;
  description: string;
  buttonTitle: string;
  link: string;
}

export default function Web3CardManager() {
  const { t } = useLanguage();
  const { data: cards = [], isLoading } = useGetWeb3Cards();
  const addCardMutation = useAddWeb3Card();
  const updateCardMutation = useUpdateWeb3Card();
  const deleteCardMutation = useDeleteWeb3Card();
  const { uploadFile, isUploading } = useFileUpload();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Web3Card | null>(null);
  const [formData, setFormData] = useState<Web3CardFormData>({
    id: '',
    imagePath: '',
    title: '',
    description: '',
    buttonTitle: '',
    link: '',
  });
  const [translatedPreview, setTranslatedPreview] = useState<TranslatedWeb3Card | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('form');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate translation preview when form data changes
  useEffect(() => {
    if (formData.title && formData.description && formData.buttonTitle) {
      const timeoutId = setTimeout(() => {
        setIsGeneratingPreview(true);
        // Simulate a small delay for better UX
        setTimeout(() => {
          const translated = translateWeb3Card(formData);
          setTranslatedPreview(translated);
          setIsGeneratingPreview(false);
        }, 300);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setTranslatedPreview(null);
    }
  }, [formData.title, formData.description, formData.buttonTitle]);

  const resetForm = () => {
    setFormData({
      id: '',
      imagePath: '',
      title: '',
      description: '',
      buttonTitle: '',
      link: '',
    });
    setEditingCard(null);
    setTranslatedPreview(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setActiveTab('form');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openAddDialog = () => {
    resetForm();
    setFormData(prev => ({ ...prev, id: Date.now().toString() }));
    setIsDialogOpen(true);
  };

  const openEditDialog = (card: Web3Card) => {
    setEditingCard(card);
    setFormData(card);
    setIsDialogOpen(true);
    // Auto-generate translation preview for existing card
    if (card.title && card.description && card.buttonTitle) {
      const translated = translateWeb3Card(card);
      setTranslatedPreview(translated);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Dozwolone są tylko pliki PNG, JPG i SVG');
      return;
    }

    // Validate file size (50kB = 51200 bytes)
    if (file.size > 51200) {
      toast.error('Plik nie może być większy niż 50kB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormChange = (field: keyof Web3CardFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const forceRegeneratePreview = () => {
    if (formData.title && formData.description && formData.buttonTitle) {
      setIsGeneratingPreview(true);
      setTimeout(() => {
        const translated = translateWeb3Card(formData);
        setTranslatedPreview(translated);
        setIsGeneratingPreview(false);
        setActiveTab('preview');
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.buttonTitle || !formData.link) {
      toast.error(t('web3.admin.validation.required'));
      return;
    }

    // For new cards, require an image
    if (!editingCard && !selectedFile) {
      toast.error('Proszę wybrać obraz dla karty');
      return;
    }

    try {
      let imagePath = formData.imagePath;

      // Upload new image if selected
      if (selectedFile) {
        const uploadPath = `web3-cards/${formData.id}-${selectedFile.name}`;
        const result = await uploadFile(uploadPath, selectedFile);
        imagePath = result.path;
      }

      const cardData = {
        ...formData,
        imagePath,
      };

      if (editingCard) {
        await updateCardMutation.mutateAsync(cardData);
        toast.success(t('web3.admin.success.updated'));
      } else {
        await addCardMutation.mutateAsync(cardData);
        toast.success(t('web3.admin.success.added'));
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(editingCard ? t('web3.admin.error.update') : t('web3.admin.error.add'));
    }
  };

  const handleDelete = async (cardId: string) => {
    if (window.confirm(t('web3.admin.confirm.delete'))) {
      try {
        await deleteCardMutation.mutateAsync(cardId);
        toast.success(t('web3.admin.success.deleted'));
      } catch (error) {
        toast.error(t('web3.admin.error.delete'));
      }
    }
  };

  // Component to display card image in management view
  const CardImageDisplay = ({ imagePath, title }: { imagePath: string; title: string }) => {
    const { data: imageUrl } = useFileUrl(imagePath);
    
    if (!imageUrl) {
      return (
        <div className="w-20 h-[45px] bg-muted rounded border border-orange-500 flex items-center justify-center">
          <div className="text-xs text-muted-foreground">Loading...</div>
        </div>
      );
    }
    
    return (
      <div className="w-20 h-[45px] rounded border border-orange-500 overflow-hidden flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  // Component to display translation quality indicator
  const TranslationQualityBadge = ({ originalText, translatedText, language }: { 
    originalText: string; 
    translatedText: string; 
    language: string;
  }) => {
    const quality = getTranslationQuality(originalText, translatedText);
    
    const qualityConfig = {
      high: { 
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800', 
        icon: CheckCircle, 
        text: 'Wysoka jakość' 
      },
      medium: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800', 
        icon: AlertCircle, 
        text: 'Średnia jakość' 
      },
      low: { 
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800', 
        icon: AlertCircle, 
        text: 'Podstawowa' 
      }
    };

    const config = qualityConfig[quality];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{t('web3.admin.title')}</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center gap-2" size="sm">
              <Plus className="h-4 w-4" />
              {t('web3.admin.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg flex items-center gap-2">
                {editingCard ? t('web3.admin.edit') : t('web3.admin.add')}
                <Languages className="h-5 w-5 text-primary" />
              </DialogTitle>
              <DialogDescription className="text-sm">
                {t('web3.admin.description')} - {t('web3.admin.autoTranslation')}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">{t('web3.admin.form.tab')}</TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  {t('web3.admin.preview.tab')}
                  {translatedPreview && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                      ✓
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="title" className="text-sm">{t('web3.admin.form.title')}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder={t('web3.admin.form.titlePlaceholder')}
                      className="text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">Obraz (PNG, JPG, SVG, max 50kB)</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2"
                          disabled={isUploading}
                        >
                          <Upload className="h-4 w-4" />
                          {selectedFile ? 'Zmień obraz' : 'Wybierz obraz'}
                        </Button>
                        {selectedFile && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeSelectedFile}
                            className="p-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {(previewUrl || (editingCard && formData.imagePath)) && (
                        <div className="w-40 h-[90px] rounded border-2 border-orange-500 overflow-hidden">
                          {previewUrl ? (
                            <img 
                              src={previewUrl} 
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <CardImageDisplay imagePath={formData.imagePath} title={formData.title} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="description" className="text-sm">{t('web3.admin.form.description')}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder={t('web3.admin.form.descriptionPlaceholder')}
                      rows={2}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="buttonTitle" className="text-sm">{t('web3.admin.form.buttonTitle')}</Label>
                      <Input
                        id="buttonTitle"
                        value={formData.buttonTitle}
                        onChange={(e) => handleFormChange('buttonTitle', e.target.value)}
                        placeholder={t('web3.admin.form.buttonTitlePlaceholder')}
                        className="text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="link" className="text-sm">{t('web3.admin.form.link')}</Label>
                      <Input
                        id="link"
                        type="url"
                        value={formData.link}
                        onChange={(e) => handleFormChange('link', e.target.value)}
                        placeholder={t('web3.admin.form.linkPlaceholder')}
                        className="text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={forceRegeneratePreview}
                      className="flex items-center gap-2"
                      disabled={!formData.title || !formData.description || !formData.buttonTitle || isGeneratingPreview}
                    >
                      {isGeneratingPreview ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Languages className="h-4 w-4" />
                      )}
                      {isGeneratingPreview ? 'Generowanie...' : t('web3.admin.generatePreview')}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-6">
                {isGeneratingPreview ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Generowanie podglądu tłumaczeń...</p>
                  </div>
                ) : translatedPreview ? (
                  <div className="space-y-6">
                    {/* Enhanced side-by-side language comparison */}
                    <div className="bg-muted/30 p-6 rounded-lg border">
                      <div className="flex items-center gap-2 mb-6">
                        <Languages className="h-5 w-5 text-primary" />
                        <h4 className="text-lg font-semibold">Porównanie wersji językowych</h4>
                      </div>
                      
                      <div className="space-y-8">
                        {/* Title comparison */}
                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Tytuł</h5>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🇵🇱</span>
                                  <span className="font-medium text-sm">Polski</span>
                                </div>
                                <Badge variant="outline" className="text-xs">Oryginał</Badge>
                              </div>
                              <div className="p-3 bg-background border rounded-md">
                                <p className="font-medium">{translatedPreview.title}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🇺🇸</span>
                                  <span className="font-medium text-sm">English</span>
                                </div>
                                <TranslationQualityBadge 
                                  originalText={translatedPreview.title} 
                                  translatedText={translatedPreview.titleEn || ''} 
                                  language="en" 
                                />
                              </div>
                              <div className="p-3 bg-background border rounded-md">
                                <p className="font-medium">{translatedPreview.titleEn}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🇩🇪</span>
                                  <span className="font-medium text-sm">Deutsch</span>
                                </div>
                                <TranslationQualityBadge 
                                  originalText={translatedPreview.title} 
                                  translatedText={translatedPreview.titleDe || ''} 
                                  language="de" 
                                />
                              </div>
                              <div className="p-3 bg-background border rounded-md">
                                <p className="font-medium">{translatedPreview.titleDe}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Description comparison */}
                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Opis</h5>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇵🇱</span>
                                <span className="font-medium text-sm">Polski</span>
                              </div>
                              <div className="p-3 bg-background border rounded-md min-h-[80px]">
                                <p className="text-sm text-muted-foreground">{translatedPreview.description}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇺🇸</span>
                                <span className="font-medium text-sm">English</span>
                              </div>
                              <div className="p-3 bg-background border rounded-md min-h-[80px]">
                                <p className="text-sm text-muted-foreground">{translatedPreview.descriptionEn}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇩🇪</span>
                                <span className="font-medium text-sm">Deutsch</span>
                              </div>
                              <div className="p-3 bg-background border rounded-md min-h-[80px]">
                                <p className="text-sm text-muted-foreground">{translatedPreview.descriptionDe}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Button text comparison */}
                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Tekst przycisku</h5>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇵🇱</span>
                                <span className="font-medium text-sm">Polski</span>
                              </div>
                              <div className="p-3 bg-background border rounded-md">
                                <Button variant="outline" size="sm" className="text-xs pointer-events-none">
                                  {translatedPreview.buttonTitle}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇺🇸</span>
                                <span className="font-medium text-sm">English</span>
                              </div>
                              <div className="p-3 bg-background border rounded-md">
                                <Button variant="outline" size="sm" className="text-xs pointer-events-none">
                                  {translatedPreview.buttonTitleEn}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇩🇪</span>
                                <span className="font-medium text-sm">Deutsch</span>
                              </div>
                              <div className="p-3 bg-background border rounded-md">
                                <Button variant="outline" size="sm" className="text-xs pointer-events-none">
                                  {translatedPreview.buttonTitleDe}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-center p-3 bg-muted/50 rounded">
                      💡 {t('web3.admin.preview.note')}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Languages className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">{t('web3.admin.preview.instruction')}</p>
                    <p className="text-xs">Tłumaczenia generują się automatycznie podczas wypełniania formularza</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleSubmit}
                size="sm"
                disabled={addCardMutation.isPending || updateCardMutation.isPending || isUploading}
              >
                {addCardMutation.isPending || updateCardMutation.isPending || isUploading ? t('common.saving') : t('common.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {cards.map((card) => (
          <Card key={card.id} className="flex items-start p-3">
            <div className="flex items-start gap-3 flex-1">
              <CardImageDisplay imagePath={card.imagePath} title={card.title} />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-sm">{card.title}</h4>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(card)}
                      className="p-1 h-7 w-7"
                      title={t('common.edit')}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(card.id)}
                      className="p-1 h-7 w-7 text-destructive hover:text-destructive"
                      disabled={deleteCardMutation.isPending}
                      title={t('common.delete')}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs line-clamp-2">{card.description}</p>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(card.link, '_blank')}
                    className="flex items-center gap-1 text-xs px-2 py-1 h-7"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {card.buttonTitle}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {cards.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {t('web3.admin.noCards')}
          </div>
        )}
      </div>
    </div>
  );
}
