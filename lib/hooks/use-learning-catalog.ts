"use client";

import { useEffect, useMemo, useState } from "react";

import { getEligibleLearningItems, type AccessProfile } from "@/lib/access";
import { getLearningItems, type LearningItem, type Level } from "@/lib/data";

export type RuntimeConfig = {
  ok: boolean;
  dataMode: "mock" | "live";
  allowMockData: boolean;
};

type CatalogApiItem = {
  id: string;
  item_type?: string;
  title: string;
  description?: string | null;
  practice_area?: string | null;
  level?: string | null;
  duration_label?: string | null;
  brightspace_url?: string | null;
};

function toLevel(value: string | null | undefined): Level {
  if (value === "Intermediate" || value === "Advanced" || value === "Foundations") return value;
  return "Foundations";
}

function mapCatalogApiItem(item: CatalogApiItem): LearningItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    level: toLevel(item.level),
    practiceArea: item.practice_area ?? "All Practice Areas",
    duration: item.duration_label ?? "Self-paced",
    brightspaceUrl: item.brightspace_url ?? `/learn/${item.id}`,
    type: "COURSE",
  };
}

async function fetchRuntimeConfig(): Promise<RuntimeConfig> {
  const response = await fetch("/api/app-config", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load app configuration.");
  const payload = (await response.json()) as RuntimeConfig;
  if (!payload.ok) throw new Error("Could not load app configuration.");
  return payload;
}

async function fetchLiveCatalog(): Promise<LearningItem[]> {
  const response = await fetch("/api/catalog", { cache: "no-store" });
  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    items?: CatalogApiItem[];
    error?: string;
  } | null;

  if (!response.ok || !payload?.ok || !Array.isArray(payload.items)) {
    throw new Error(payload?.error ?? "Could not load the live catalog.");
  }

  return payload.items.map(mapCatalogApiItem);
}

export function useLearningCatalog(user: AccessProfile | null | undefined) {
  const [runtimeConfig, setRuntimeConfig] = useState<RuntimeConfig | null>(null);
  const [liveCatalogItems, setLiveCatalogItems] = useState<LearningItem[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setCatalogError(null);
      try {
        const config = await fetchRuntimeConfig();
        if (cancelled) return;
        setRuntimeConfig(config);

        if (!config.allowMockData) {
          const items = await fetchLiveCatalog();
          if (!cancelled) setLiveCatalogItems(items);
        }
      } catch (error) {
        if (!cancelled) {
          setRuntimeConfig({ ok: true, dataMode: "live", allowMockData: false });
          setLiveCatalogItems([]);
          setCatalogError(error instanceof Error ? error.message : "Could not load catalog.");
        }
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  const allItems = useMemo(() => {
    if (!runtimeConfig) return [];
    const sourceItems = runtimeConfig.allowMockData ? getLearningItems() : liveCatalogItems;
    return getEligibleLearningItems(sourceItems, user);
  }, [runtimeConfig, liveCatalogItems, user]);

  return {
    allItems,
    allowMockData: runtimeConfig?.allowMockData ?? false,
    catalogError,
    catalogLoading: !runtimeConfig,
    dataMode: runtimeConfig?.dataMode ?? null,
  };
}
