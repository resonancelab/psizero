import { useToast } from "./use-toast";

export const useCopyToClipboard = () => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: successMessage || "Content has been copied to your clipboard.",
      });
      return true;
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { copyToClipboard };
};