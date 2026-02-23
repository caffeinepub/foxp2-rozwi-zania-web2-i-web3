import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Mail, Phone, Calendar, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useGetContactMessages, useDeleteContactMessage } from '../hooks/useQueries';
import { useLanguage } from '../contexts/LanguageContext';
import type { ContactMessage } from '../backend';

interface AdminMessagesDialogProps {
  children: React.ReactNode;
}

export default function AdminMessagesDialog({ children }: AdminMessagesDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const { data: messages = [], isLoading } = useGetContactMessages();
  const deleteMessage = useDeleteContactMessage();

  const handleDeleteMessage = async (message: ContactMessage) => {
    try {
      // Create a unique message ID based on email and timestamp
      const messageId = `${message.email}${message.timestamp}`;
      await deleteMessage.mutateAsync(messageId);
      // Remove from selected messages if it was selected
      setSelectedMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
      toast.success(t('admin.messages.deleteSuccess'));
    } catch (error) {
      toast.error(t('admin.messages.deleteError'));
    }
  };

  const handleMessageSelection = (messageId: string, checked: boolean) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(messageId);
      } else {
        newSet.delete(messageId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allMessageIds = messages.map(message => `${message.email}${message.timestamp}`);
      setSelectedMessages(new Set(allMessageIds));
    } else {
      setSelectedMessages(new Set());
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleString('pl-PL');
  };

  const getSelectedMessages = () => {
    return messages.filter(message => {
      const messageId = `${message.email}${message.timestamp}`;
      return selectedMessages.has(messageId);
    });
  };

  const exportToPDF = () => {
    try {
      const selectedMessagesData = getSelectedMessages();
      
      if (selectedMessagesData.length === 0) {
        toast.error(t('admin.messages.export.noSelection'));
        return;
      }

      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${t('admin.messages.export.title')}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #f97316;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #f97316;
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0 0 0;
              color: #666;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background-color: #f8f9fa;
              font-weight: bold;
              color: #333;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .message-cell {
              max-width: 300px;
              word-wrap: break-word;
              white-space: pre-wrap;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .no-messages {
              text-align: center;
              color: #666;
              font-style: italic;
              padding: 40px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FoxP2 - ${t('admin.messages.export.title')}</h1>
            <p>${t('admin.messages.export.generated')}: ${new Date().toLocaleString('pl-PL')}</p>
            <p>${t('admin.messages.export.selectedMessages')}: ${selectedMessagesData.length}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>${t('admin.messages.export.name')}</th>
                <th>${t('admin.messages.export.email')}</th>
                <th>${t('admin.messages.export.phone')}</th>
                <th>${t('admin.messages.export.date')}</th>
                <th>${t('admin.messages.export.message')}</th>
              </tr>
            </thead>
            <tbody>
              ${selectedMessagesData.map(message => `
                <tr>
                  <td>${message.firstName} ${message.lastName}</td>
                  <td>${message.email}</td>
                  <td>${message.phone || '-'}</td>
                  <td>${formatDate(message.timestamp)}</td>
                  <td class="message-cell">${message.message}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>© 2025 FoxP2 - ${t('admin.messages.export.footer')}</p>
          </div>
        </body>
        </html>
      `;

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load, then print
        printWindow.onload = () => {
          printWindow.print();
          // Close the window after printing (optional)
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        };
        
        toast.success(t('admin.messages.export.success'));
      } else {
        toast.error(t('admin.messages.export.error'));
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(t('admin.messages.export.error'));
    }
  };

  const isAllSelected = messages.length > 0 && selectedMessages.size === messages.length;
  const isIndeterminate = selectedMessages.size > 0 && selectedMessages.size < messages.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-center">
            <Mail className="h-5 w-5" />
            {t('admin.messages.dialogTitle')} ({messages.length})
          </DialogTitle>
          {messages.length > 0 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={isAllSelected ? true : isIndeterminate ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                />
                <span>{t('admin.messages.selectAll')}</span>
                <span>({selectedMessages.size}/{messages.length})</span>
              </div>
              <Button
                onClick={exportToPDF}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={selectedMessages.size === 0}
              >
                <Download className="h-4 w-4" />
                {t('admin.messages.export.button')} ({selectedMessages.size})
              </Button>
            </div>
          )}
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('admin.messages.noMessages')}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const messageId = `${message.email}${message.timestamp}`;
                const isSelected = selectedMessages.has(messageId);
                
                return (
                  <Card key={messageId} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleMessageSelection(messageId, checked as boolean)}
                          />
                          <CardTitle className="text-lg">
                            {message.firstName} {message.lastName}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMessage(message)}
                          disabled={deleteMessage.isPending}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${message.email}`} className="hover:text-primary">
                          {message.email}
                        </a>
                      </div>
                      
                      {message.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${message.phone}`} className="hover:text-primary">
                            {message.phone}
                          </a>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(message.timestamp)}
                      </div>
                      
                      <div className="mt-3 p-3 bg-muted/50 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
