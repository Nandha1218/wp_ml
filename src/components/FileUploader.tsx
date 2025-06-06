
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatData } from '@/types/chat';
import { parseChatFile } from '@/utils/chatParser';

interface FileUploaderProps {
  onFileProcessed: (data: ChatData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileProcessed, 
  isLoading, 
  setIsLoading 
}) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt file containing WhatsApp chat export.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const text = await file.text();
      const chatData = parseChatFile(text);
      
      if (Object.keys(chatData.userStats).length === 0) {
        toast({
          title: "No data found",
          description: "The file doesn't contain valid WhatsApp chat data.",
          variant: "destructive",
        });
        return;
      }

      onFileProcessed(chatData);
      toast({
        title: "File processed successfully!",
        description: `Found ${Object.keys(chatData.userStats).length} users and ${chatData.totalMessages} messages.`,
      });
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Processing failed",
        description: "Failed to process the chat file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onFileProcessed, setIsLoading, toast]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const input = document.createElement('input');
      input.type = 'file';
      input.files = event.dataTransfer.files;
      handleFileUpload({ target: input } as any);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <Card 
      className="border-2 border-dashed border-blue-300 hover:border-blue-400 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-blue-600" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isLoading ? 'Processing chat file...' : 'Upload WhatsApp Chat Export'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your .txt file here, or click to browse
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={isLoading}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isLoading ? 'Processing...' : 'Choose File'}
            </Button>
            
            <input
              id="file-input"
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading}
            />
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p>• Export your WhatsApp group chat without media</p>
            <p>• Supported format: .txt files only</p>
            <p>• Your data is processed locally and never uploaded</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
