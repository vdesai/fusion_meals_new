import 'react-to-print';

declare module 'react-to-print' {
  interface UseReactToPrintOptions {
    content: () => React.ReactInstance | null;
    documentTitle?: string;
    onBeforeGetContent?: () => Promise<void>;
    onAfterPrint?: () => Promise<void>;
    removeAfterPrint?: boolean;
    pageStyle?: string;
    copyStyles?: boolean;
    // Add other properties as needed
  }

  export function useReactToPrint(options: UseReactToPrintOptions): () => void;
} 