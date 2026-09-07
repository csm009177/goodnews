"use client";

import { useSheetViewer } from "@/features/sheet/hooks/useSheetViewer";
import SheetViewer from "@/features/sheet/components/SheetViewer";
import { SheetMusic } from "@/features/sheet/services/sheet-data";

interface SheetViewerWrapperProps {
  sheet: SheetMusic;
}

export default function SheetViewerWrapper({ sheet }: SheetViewerWrapperProps) {
  const viewer = useSheetViewer(sheet);
  return <SheetViewer {...viewer} />;
}
