"use client";

import { useIsMobile } from "@/hooks/use-mobile";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveDialog = ({
  title,
  description,
  children,
  open,
  onOpenChange,
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="glass-strong border-t border-primary/30">
          <DrawerHeader className="text-left border-b border-primary/20 pb-4">
            <DrawerTitle className="text-white text-lg font-semibold">
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-gray-400 text-sm">
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-6">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md glass-strong border border-primary/30 text-white shadow-2xl shadow-black/50">
        <DialogHeader className="border-b border-primary/20 pb-4">
          <DialogTitle className="text-white text-xl font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};