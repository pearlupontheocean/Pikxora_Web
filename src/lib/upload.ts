import { supabase } from "@/integrations/supabase/client";

export interface UploadProgress {
  progress: number;
  fileName: string;
}

export const uploadFile = async (
  file: File,
  bucket: string,
  folder: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Simulate progress for better UX
    if (onProgress) {
      const progressInterval = setInterval(() => {
        onProgress({ progress: Math.random() * 50, fileName: file.name });
      }, 300);

      setTimeout(() => clearInterval(progressInterval), 2000);
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    if (onProgress) {
      onProgress({ progress: 100, fileName: file.name });
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
};

export const deleteFile = async (
  bucket: string,
  filePath: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};
