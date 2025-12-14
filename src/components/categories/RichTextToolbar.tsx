// src/components/admin/categories/RichTextToolbar.tsx
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Link,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Quote,
    Code,
    Heading1,
    Heading2,
    Undo,
    Redo,
    Image,
    Table,
    Type,
    Subscript,
    Superscript
} from "lucide-react";
import { RichTextToolbarProps } from "./interfacefile";
import { Separator } from "@/components/ui/separator";

export function RichTextToolbar({ editorRef }: RichTextToolbarProps) {
    const applyCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const insertTable = () => {
        const rows = prompt("Number of rows:", "3");
        const cols = prompt("Number of columns:", "3");
        if (rows && cols) {
            let table = '<table style="border-collapse: collapse; width: 100%; margin: 8px 0;">';
            for (let i = 0; i < parseInt(rows); i++) {
                table += '<tr>';
                for (let j = 0; j < parseInt(cols); j++) {
                    table += '<td style="border: 1px solid #ddd; padding: 8px;">&nbsp;</td>';
                }
                table += '</tr>';
            }
            table += '</table>';
            document.execCommand('insertHTML', false, table);
            editorRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-0.5 border border-border rounded-t-md bg-muted/50 p-1.5">
            {/* Text Format Dropdown */}
            <Select onValueChange={(v) => applyCommand("formatBlock", v)}>
                <SelectTrigger className="w-24 h-7 text-xs">
                    <SelectValue placeholder="Normal" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="p">Normal</SelectItem>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                    <SelectItem value="h4">Heading 4</SelectItem>
                    <SelectItem value="pre">Code Block</SelectItem>
                </SelectContent>
            </Select>

            {/* Font Family */}
            <Select onValueChange={(v) => applyCommand("fontName", v)}>
                <SelectTrigger className="w-24 h-7 text-xs">
                    <SelectValue placeholder="Sans Serif" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Arial, sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="Georgia, serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="cursive">Cursive</SelectItem>
                </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Basic Formatting */}
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("bold")} title="Bold">
                <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("italic")} title="Italic">
                <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("underline")} title="Underline">
                <Underline className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("strikeThrough")} title="Strikethrough">
                <Strikethrough className="h-3.5 w-3.5" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Headings */}
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("formatBlock", "h1")} title="Heading 1">
                <Heading1 className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("formatBlock", "h2")} title="Heading 2">
                <Heading2 className="h-3.5 w-3.5" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Subscript/Superscript */}
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("subscript")} title="Subscript">
                <Subscript className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("superscript")} title="Superscript">
                <Superscript className="h-3.5 w-3.5" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists */}
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("insertUnorderedList")} title="Bullet List">
                <List className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("insertOrderedList")} title="Numbered List">
                <ListOrdered className="h-3.5 w-3.5" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Alignment */}
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("justifyLeft")} title="Align Left">
                <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("justifyCenter")} title="Align Center">
                <AlignCenter className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("justifyRight")} title="Align Right">
                <AlignRight className="h-3.5 w-3.5" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Quote & Code */}
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("formatBlock", "blockquote")} title="Quote">
                <Quote className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("formatBlock", "pre")} title="Code">
                <Code className="h-3.5 w-3.5" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Link & Image */}
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                title="Insert Link"
                onClick={() => {
                    const url = prompt("Enter URL:");
                    if (url) applyCommand("createLink", url);
                }}
            >
                <Link className="h-3.5 w-3.5" />
            </Button>
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                title="Insert Image"
                onClick={() => {
                    const url = prompt("Enter image URL:");
                    if (url) applyCommand("insertImage", url);
                }}
            >
                <Image className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={insertTable} title="Insert Table">
                <Table className="h-3.5 w-3.5" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Colors */}
            <div className="flex items-center gap-1">
                <input
                    type="color"
                    className="h-6 w-6 rounded border cursor-pointer"
                    onChange={(e) => applyCommand("foreColor", e.target.value)}
                    title="Text Color"
                />
                <Type className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1">
                <input
                    type="color"
                    defaultValue="#ffff00"
                    className="h-6 w-6 rounded border cursor-pointer"
                    onChange={(e) => applyCommand("hiliteColor", e.target.value)}
                    title="Highlight Color"
                />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Undo/Redo */}
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("undo")} title="Undo">
                <Undo className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applyCommand("redo")} title="Redo">
                <Redo className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
}