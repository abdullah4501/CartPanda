import { memo, useRef, ChangeEvent } from "react";
import {
    DownloadIcon,
    UploadIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    EnterFullScreenIcon, // Closest to Fit View
    HamburgerMenuIcon,
    MinusIcon,
    PlusIcon,
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
import { useReactFlow } from "@xyflow/react";
import { useFunnelStore } from "@/features/funnels/hooks/useFunnelStore";


import { ArchiveIcon } from "@radix-ui/react-icons";

export const TopBar = memo(() => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    const saveFunnel = useFunnelStore((state) => state.saveFunnel);
    const exportFunnel = useFunnelStore((state) => state.exportFunnel);
    const importFunnel = useFunnelStore((state) => state.importFunnel);
    const clearFunnel = useFunnelStore((state) => state.clearFunnel);

    const handleSave = () => {
        saveFunnel();
        toast.success("Funnel saved to browser storage");
    };

    const handleExport = () => {
        const json = exportFunnel();
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
            const success = importFunnel(json);
            if (success) {
                toast.success("Funnel imported successfully");
            } else {
                toast.error("Invalid funnel file");
            }
        };
        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFitView = () => fitView({ padding: 0.2, duration: 500 });

    return (
        <header className="h-14 bg-background border-b border-border flex items-center px-4 justify-between z-50">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden text-foreground">
                    <HamburgerMenuIcon className="h-5 w-5" />
                </Button>
                <h1 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                    <span className="text-primary tracking-tight">Cartpanda</span>
                    <span className="text-muted-foreground font-normal">Funnel Builder</span>
                </h1>
            </div>

            <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center border-r border-border pr-2 mr-2 gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => zoomOut()} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MinusIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom Out</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => zoomIn()} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <PlusIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom In</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleFitView} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <EnterFullScreenIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Fit View</TooltipContent>
                    </Tooltip>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleSave} className="gap-2 text-muted-foreground hover:text-primary">
                        <ArchiveIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Save</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleExport} className="gap-2 text-muted-foreground hover:text-primary">
                        <DownloadIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleImportClick} className="gap-2 text-muted-foreground hover:text-primary">
                        <UploadIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Import</span>
                    </Button>

                    <div className="border-l border-border pl-2 ml-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Clear Canvas?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={clearFunnel} className="bg-destructive text-destructive-foreground">
                                        Clear All
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        </header>
    );
});

TopBar.displayName = "TopBar";
