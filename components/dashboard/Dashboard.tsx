"use client";

import { getBuilderForUser, saveBuilderForUser } from "@/app/actions/builder";
import Sidebar from "@/components/dashboard/Sidebar";
import { Section, PageConfig, DashboardProps } from "@/types/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Role } from "@/types/roles";
import dynamic from "next/dynamic";
import Loader from "../common/Loader";

const Canvas = dynamic(() => import("@/components/dashboard/Canvas"), {
  ssr: false,
  loading: () => <div className="flex justify-center w-full"> Loading</div>,
});

export default function Dashboard({
  users,
  initialUserId,
  initialConfig,
  currentUserRole,
}: DashboardProps) {
  const [selectedUserId, setSelectedUserId] = useState(initialUserId ?? "");
  const [sections, setSections] = useState<Section[]>(
    initialConfig?.sections ?? []
  );
  const [cardsPerRow, setCardsPerRow] = useState<number>(
    initialConfig?.layout.cardsPerRow ?? 3
  );
  const [loading, setLoading] = useState(false);

  const role: Role = currentUserRole ?? "VIEWER";
  const isViewer = role === "VIEWER";
  const isEditor = role === "EDITOR";
  const isAdmin = role === "ADMIN";

  const canEditSections = isEditor || isAdmin; // EDITOR, ADMIN
  const canDeleteSections = isAdmin; // only ADMIN
  const isDraggable = isEditor || isAdmin; // EDITOR, ADMIN

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (!selectedUserId) {
      setSections([]);
      setCardsPerRow(3);
      return;
    }

    if (initialUserId && initialConfig && selectedUserId === initialUserId) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const config = await getBuilderForUser(selectedUserId);
        if (cancelled) return;

        if (config) {
          setSections(config.sections ?? []);
          setCardsPerRow(config.layout?.cardsPerRow ?? 3);
        } else {
          setSections([]);
          setCardsPerRow(3);
        }
      } catch (err) {
        if (!cancelled) {
          toast.error("Failed to load saved theme");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [selectedUserId, initialUserId, initialConfig]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    if (active.id.toString().startsWith("sidebar-")) {
      const type = active.data.current?.type as Section["type"] | undefined;
      if (!type) return;

      const newSection: Section =
        type === "hero"
          ? {
              id: crypto.randomUUID(),
              type: "hero",
              heading: "Hero Heading",
              subheading:
                "Hero Subheading (Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua tempor incididunt ut labore et dolore magna aliqua )",
            }
          : {
              id: crypto.randomUUID(),
              type: "card",
              title: "Card Title",
              description:
                "Card description (Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua tempor incididunt ut labore et dolore magna aliqua )",
              button1Text: "Learn More",
              button1Link: "#",
              button2Text: "Get Started",
              button2Link: "#",
            };

      setSections((prev) => [...prev, newSection]);
      return;
    }

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  async function savePage() {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    const builderJson: PageConfig = {
      sections: sections,
      layout: {
        cardsPerRow: cardsPerRow,
      },
    };

    setLoading(true);
    try {
      await saveBuilderForUser(selectedUserId, builderJson);
      toast.success("Theme saved successfully");
    } catch (err) {
      toast.error("Failed to save theme");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!isViewer && (
        <div className="mb-3 flex justify-end">
          <Select
            value={selectedUserId}
            onValueChange={(value) => setSelectedUserId(value)}
          >
            <SelectTrigger className="w-50 bg-white border border-gray-400">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>

            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name || "No name"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={isDraggable ? handleDragEnd : undefined}
        sensors={isDraggable ? sensors : undefined}
      >
        <div className="flex">
          {!isViewer && (
            <Sidebar
              setCardsPerRow={setCardsPerRow}
              cardsPerRow={cardsPerRow}
            />
          )}
          <Canvas
            sections={sections}
            setSections={setSections}
            cardsPerRow={cardsPerRow}
            canEditSections={canEditSections}
            canDeleteSections={canDeleteSections}
            isDraggable={isDraggable}
          />
          {!isViewer && (
            <Button
              onClick={savePage}
              className="fixed bottom-6 right-8 bg-primary hover:bg-primary-dark cursor-pointer text-white px-4 py-2 rounded shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader />
                  Saving Page...
                </>
              ) : (
                "Save Page"
              )}
            </Button>
          )}
        </div>
      </DndContext>
    </div>
  );
}
