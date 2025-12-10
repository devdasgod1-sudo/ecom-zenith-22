import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const toolbarButtons = [
  { icon: Bold, command: "bold", title: "Bold" },
  { icon: Italic, command: "italic", title: "Italic" },
  { icon: Underline, command: "underline", title: "Underline" },
  { icon: "divider" },
  { icon: Heading1, command: "formatBlock", value: "h1", title: "Heading 1" },
  { icon: Heading2, command: "formatBlock", value: "h2", title: "Heading 2" },
  { icon: Heading3, command: "formatBlock", value: "h3", title: "Heading 3" },
  { icon: "divider" },
  { icon: List, command: "insertUnorderedList", title: "Bullet List" },
  { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
  { icon: "divider" },
  { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
  { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
  { icon: AlignRight, command: "justifyRight", title: "Align Right" },
  { icon: "divider" },
  { icon: Quote, command: "formatBlock", value: "blockquote", title: "Quote" },
  { icon: Code, command: "formatBlock", value: "pre", title: "Code Block" },
  { icon: Link, command: "createLink", title: "Insert Link" },
  { icon: Image, command: "insertImage", title: "Insert Image" },
];

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start writing...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  const executeCommand = (command: string, value?: string) => {
    if (command === "createLink") {
      const url = prompt("Enter URL:");
      if (url) document.execCommand(command, false, url);
    } else if (command === "insertImage") {
      const url = prompt("Enter image URL:");
      if (url) document.execCommand(command, false, url);
    } else if (value) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false);
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    const content = editorRef.current?.innerHTML || "";
    const textContent = editorRef.current?.textContent || "";
    setIsEmpty(!textContent.trim());
    onChange?.(content);
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Toolbar */}
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-2">
          {toolbarButtons.map((btn, idx) => {
            if (btn.icon === "divider") {
              return (
                <div
                  key={idx}
                  className="mx-1 h-6 w-px bg-border"
                />
              );
            }
            const Icon = btn.icon as React.ComponentType<{ className?: string }>;
            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted"
                    onClick={() => executeCommand(btn.command!, btn.value)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{btn.title}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Editor Area */}
      <div className="relative">
        {isEmpty && (
          <div className="pointer-events-none absolute left-4 top-4 text-muted-foreground">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
            [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-2
            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-2
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
            [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-sm
            [&_a]:text-primary [&_a]:underline
            [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2"
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    </div>
  );
}
