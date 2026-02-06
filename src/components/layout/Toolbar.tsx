import { memo, useRef, ChangeEvent } from "react";
import {
  DownloadIcon,
  UploadIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EnterFullScreenIcon,
  MinusIcon,
  PlusIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

interface ToolbarProps {
  onSave: () => void;
  onExport: () => string;
  onImport: (json: string) => boolean;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = memo(
  ({
    onSave,
    onExport,
    onImport,
    onClear,
    onZoomIn,
    onZoomOut,
    onFitView,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
  }: ToolbarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
      onSave();
      toast.success("Funnel saved to browser storage");
    };

    const handleExport = () => {
      const json = onExport();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `funnel-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Funnel exported as JSON");
    };

    const handleImportClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        const success = onImport(json);
        if (success) {
          toast.success("Funnel imported successfully");
        } else {
          toast.error("Invalid funnel file");
        }
      };
      reader.readAsText(file);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    return (
      <div className="flex items-center gap-1 p-1 bg-card rounded-md border shadow-sm">
        <div className="flex items-center border-r border-border pr-1 mr-1 gap-0.5">


          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                aria-label="Zoom out"
                className="h-7 w-7"
              >
                <MinusIcon className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                aria-label="Zoom in"
                className="h-7 w-7"
              >
                <PlusIcon className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onFitView}
                aria-label="Fit to view"
                className="h-7 w-7"
              >
                <EnterFullScreenIcon className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fit View</TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              aria-label="Save funnel"
              className="h-7 w-7"
            >
              <ArchiveIcon className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save to Browser</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExport}
              aria-label="Export funnel as JSON"
              className="h-7 w-7"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export JSON</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleImportClick}
              aria-label="Import funnel from JSON"
              className="h-7 w-7"
            >
              <UploadIcon className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import JSON</TooltipContent>
        </Tooltip>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Import funnel file"
        />

        <div className="border-l border-border pl-1 ml-1">
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Clear canvas"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Clear Canvas</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Canvas?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all nodes and connections. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClear}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }
);

Toolbar.displayName = "Toolbar";
