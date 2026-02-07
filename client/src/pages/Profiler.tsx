import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateWordlistSchema, type GenerateWordlistRequest } from "@shared/schema";
import { useGenerateWordlist, useHistory } from "@/hooks/use-wordlist";
import { CyberInput } from "@/components/CyberInput";
import { TerminalOutput } from "@/components/TerminalOutput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, Lock, User, Briefcase, Calendar, 
  Dog, Heart, Binary, History, Flame, Code 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profiler() {
  const { toast } = useToast();
  const generate = useGenerateWordlist();
  const { data: history } = useHistory();
  const [logs, setLogs] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [downloadContent, setDownloadContent] = useState<string>("");

  const form = useForm<GenerateWordlistRequest>({
    resolver: zodResolver(generateWordlistSchema),
    defaultValues: {
      useLeet: false,
      minLen: 6,
      maxLen: 12,
      firstName: "",
      lastName: "",
      dob: "",
      petName: "",
      partnerName: "",
      partnerDob: "",
      fatherName: "",
      fatherDob: "",
      motherName: "",
      motherDob: "",
      siblingNames: "",
      siblingDobs: "",
      company: "",
      favHobby: "",
      favPerson: "",
      favInfluencer: "",
      keywords: "",
    },
  });

  const onSubmit = (data: GenerateWordlistRequest) => {
    generate.mutate(data, {
      onSuccess: (res) => {
        setLogs(res.preview);
        setTotalCount(res.count);
        setDownloadContent(res.downloadContent);
        toast({
          title: "GENERATION COMPLETE",
          description: `Successfully generated ${res.count.toLocaleString()} passwords.`,
          variant: "default",
          className: "bg-primary text-black border-none",
        });
      },
      onError: (err) => {
        toast({
          title: "GENERATION FAILED",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDownload = () => {
    if (!downloadContent) return;
    const blob = new Blob([downloadContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wordlist_${new Date().getTime()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-primary/20 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white glitch-text" data-text="XTRACT">
            XTRACT
            <span className="text-primary">.v2</span>
          </h1>
          <p className="text-muted-foreground font-mono mt-2 text-sm">
            <span className="text-primary">root@xcorp:~$</span> ./xtract_profiler.py --target=unknown
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded border border-primary/20">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-primary">SECURE_ENVIRONMENT</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Form */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="cyber-card p-6 rounded-lg bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-6 text-primary border-b border-primary/20 pb-2">
              <User className="w-5 h-5" />
              <h2 className="font-display text-lg">TARGET_INTEL</h2>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CyberInput 
                  label="First Name" 
                  icon={<User className="w-3 h-3" />}
                  {...form.register("firstName")} 
                />
                <CyberInput 
                  label="Last Name" 
                  {...form.register("lastName")} 
                />
              </div>

              <CyberInput 
                label="Date of Birth" 
                placeholder="YYYY"
                icon={<Calendar className="w-3 h-3" />}
                {...form.register("dob")} 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <CyberInput 
                  label="Pet Name" 
                  icon={<Dog className="w-3 h-3" />}
                  {...form.register("petName")} 
                />
                <CyberInput 
                  label="Company/School" 
                  icon={<Briefcase className="w-3 h-3" />}
                  {...form.register("company")} 
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-primary/10">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Family Intel</Label>
                <div className="grid grid-cols-2 gap-4">
                  <CyberInput label="Partner Name" icon={<Heart className="w-3 h-3" />} {...form.register("partnerName")} />
                  <CyberInput label="Partner DOB" placeholder="YYYY" {...form.register("partnerDob")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CyberInput label="Father Name" {...form.register("fatherName")} />
                  <CyberInput label="Father DOB" placeholder="YYYY" {...form.register("fatherDob")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CyberInput label="Mother Name" {...form.register("motherName")} />
                  <CyberInput label="Mother DOB" placeholder="YYYY" {...form.register("motherDob")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CyberInput label="Sibling Names (CSV)" {...form.register("siblingNames")} />
                  <CyberInput label="Sibling DOBs (CSV)" placeholder="YYYY, YYYY" {...form.register("siblingDobs")} />
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-primary/10">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Personal Interests</Label>
                <CyberInput label="Favorite Hobby" icon={<Flame className="w-3 h-3" />} {...form.register("favHobby")} />
                <div className="grid grid-cols-2 gap-4">
                  <CyberInput label="Favorite Person" {...form.register("favPerson")} />
                  <CyberInput label="Favorite Influencer" {...form.register("favInfluencer")} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Flame className="w-3 h-3" />
                  Custom Keywords
                </Label>
                <textarea 
                  className="w-full bg-background/50 border border-white/10 rounded p-2 text-xs font-mono text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none min-h-[80px]"
                  placeholder="sport, city, hobby (comma separated)"
                  {...form.register("keywords")}
                />
              </div>

              <div className="border-t border-primary/10 my-4 pt-4 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Binary className="w-4 h-4 text-primary" />
                      <Label className="text-xs uppercase">Leet Speak Mode</Label>
                    </div>
                    <Switch 
                      checked={form.watch("useLeet")}
                      onCheckedChange={(c) => form.setValue("useLeet", c)}
                    />
                 </div>

                 <div className="space-y-4 pt-2">
                    <Label className="text-xs uppercase flex justify-between">
                      <span>Password Length</span>
                      <span className="font-mono text-primary">
                        {form.watch("minLen")} - {form.watch("maxLen")}
                      </span>
                    </Label>
                    <Slider 
                      defaultValue={[6, 12]}
                      min={4}
                      max={32}
                      step={1}
                      onValueChange={(vals) => {
                        form.setValue("minLen", vals[0]);
                        form.setValue("maxLen", vals[1]);
                      }}
                      className="py-2"
                    />
                 </div>
              </div>

              <Button 
                type="submit" 
                disabled={generate.isPending}
                className="w-full cyber-button mt-6 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {generate.isPending ? "PROCESSING..." : "INITIATE_GENERATION"}
                  <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </span>
                {generate.isPending && (
                  <div className="absolute inset-0 bg-primary/20 animate-progress-bar origin-left" />
                )}
              </Button>
            </form>
          </div>

          {/* History Panel Mobile/Tablet - shown here for layout balance on smaller screens */}
          <div className="lg:hidden">
             {/* ... same as right sidebar ... */}
          </div>
        </div>

        {/* Center Column: Terminal Output */}
        <div className="lg:col-span-5 xl:col-span-6 h-[600px] lg:h-auto">
          <TerminalOutput 
            logs={logs} 
            count={totalCount} 
            onDownload={handleDownload} 
            isGenerating={generate.isPending} 
          />
        </div>

        {/* Right Column: History & Credits */}
        <div className="lg:col-span-3 space-y-6 flex flex-col h-full">
          <div className="cyber-card flex-1 rounded-lg bg-black/40 backdrop-blur-md flex flex-col">
            <div className="p-4 border-b border-primary/20 flex items-center gap-2 text-primary">
              <History className="w-5 h-5" />
              <h3 className="font-display text-lg">LOG_HISTORY</h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {history?.length === 0 ? (
                  <p className="text-muted-foreground text-xs font-mono text-center mt-10">NO_LOGS_FOUND</p>
                ) : (
                  history?.map((entry) => (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 p-3 rounded hover:border-primary/50 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-xs text-primary font-bold">{entry.targetName}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(entry.createdAt || "").toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
                        <span>Generated:</span>
                        <span className="text-white group-hover:text-primary transition-colors">
                          {entry.wordCount.toLocaleString()} words
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="p-4 rounded border border-primary/10 bg-primary/5">
             <div className="flex items-center gap-2 text-primary mb-2">
               <Code className="w-4 h-4" />
               <h4 className="font-display text-sm font-bold">SYSTEM_CREDITS</h4>
             </div>
             <div className="space-y-1 font-mono text-[10px] text-muted-foreground">
               <div className="flex justify-between">
                 <span>DEVELOPER:</span>
                 <span className="text-white">arxncodes (Aryan)</span>
               </div>
               <div className="flex justify-between">
                 <span>CO-DEV:</span>
                 <span className="text-white">aashay</span>
               </div>
               <div className="flex justify-between">
                 <span>ORGANISATION:</span>
                 <span className="text-white">XCorp_</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
