import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TerminalOutputProps {
  logs: string[];
  count: number;
  onDownload: () => void;
  isGenerating: boolean;
}

export function TerminalOutput({ logs, count, onDownload, isGenerating }: TerminalOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-black/80 border border-primary/20 rounded-md overflow-hidden relative backdrop-blur-sm">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-primary uppercase tracking-wider">
            Output_Console {count > 0 && `[${count.toLocaleString()} ENTRIES]`}
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>

      {/* Terminal Body */}
      <ScrollArea className="flex-1 p-4 font-mono text-xs md:text-sm">
        <div className="space-y-1">
          {isGenerating ? (
            <div className="flex items-center gap-2 text-primary animate-pulse">
              <span className="text-xl">›</span>
              <span>GENERATING_COMBINATIONS...</span>
            </div>
          ) : logs.length > 0 ? (
            logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex gap-2 text-primary/80 hover:bg-primary/5 px-1 rounded cursor-default"
              >
                <span className="text-muted-foreground select-none">{(i + 1).toString().padStart(3, '0')}</span>
                <span className="text-white/90">{log}</span>
              </motion.div>
            ))
          ) : (
            <div className="text-muted-foreground italic flex flex-col items-center justify-center h-64 gap-2 opacity-50">
              <Terminal className="w-8 h-8" />
              <p>AWAITING_INPUT...</p>
            </div>
          )}
          {logs.length > 0 && (
             <div className="text-primary/50 mt-4 border-t border-dashed border-primary/20 pt-2">
               -- END OF PREVIEW --
             </div>
          )}
        </div>
      </ScrollArea>

      {/* Terminal Actions */}
      {logs.length > 0 && (
        <div className="p-3 border-t border-primary/20 bg-primary/5 flex gap-3">
          <Button 
            onClick={onDownload} 
            className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold font-mono text-xs"
          >
            <Download className="w-4 h-4 mr-2" />
            DOWNLOAD_FULL_LIST.TXT
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCopy}
            className="border-primary/50 text-primary hover:bg-primary/10 font-mono text-xs"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
