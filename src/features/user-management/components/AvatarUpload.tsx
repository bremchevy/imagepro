'use client';

import { useState } from 'react';
import { useAvatarUpload } from '../hooks/useAvatarUpload';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';
import { Loader2, Upload, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onAvatarUpdate: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) {
  const { uploadAvatar, deleteAvatar, isUploading, error } = useAvatarUpload();
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Upload file
      const response = await uploadAvatar(file);
      if (response.error) {
        throw new Error(response.error);
      }

      onAvatarUpdate(response.url);
      toast.success('Avatar updated successfully');
    } catch (error) {
      setPreviewUrl(currentAvatarUrl);
      toast.error(error instanceof Error ? error.message : 'Failed to update avatar');
    }
  };

  const handleDelete = async () => {
    if (!currentAvatarUrl) return;

    try {
      const success = await deleteAvatar(currentAvatarUrl);
      if (success) {
        setPreviewUrl(null);
        onAvatarUpdate('');
        toast.success('Avatar removed successfully');
      } else {
        toast.error('Failed to remove avatar');
      }
    } catch (error) {
      toast.error('Failed to remove avatar');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || ''} />
          <AvatarFallback>
            {previewUrl ? 'U' : '?'}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="avatar-upload"
            disabled={isUploading}
          />
          <label htmlFor="avatar-upload">
            <Button
              variant="outline"
              asChild
              disabled={isUploading}
            >
              <span>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Change Avatar
                  </>
                )}
              </span>
            </Button>
          </label>
          {currentAvatarUrl && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isUploading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Avatar</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your avatar? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 