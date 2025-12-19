"use client";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CanvasProps, Section, SortableItemProps } from "@/types/dashboard";
import { ChangeEvent, JSX, useState } from "react";
import { Pencil, Save, Trash } from "lucide-react";

function SortableItem({
  section,
  onUpdate,
  onDelete,
  canEdit,
  canDelete,
  isDraggable,
}: SortableItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChange = (
    field:
      | "heading"
      | "subheading"
      | "title"
      | "description"
      | "button1Text"
      | "button1Link"
      | "button2Text"
      | "button2Link",
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdate(section.id, { [field]: e.target.value } as Partial<Section>);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border p-4 rounded bg-white shadow-sm space-y-3"
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        {isDraggable && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            ⋮⋮ {section.type.toUpperCase()}
          </div>
        )}

        <div className="flex items-center gap-3">
          {canEdit && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`text-sm rounded transition cursor-pointer ${
                isEditing ? "text-green-600" : "text-blue-600"
              }`}
            >
              {isEditing ? (
                <Save className="size-4" />
              ) : (
                <Pencil className="size-4" />
              )}
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(section.id)}
              className="text-red-500 hover:text-red-700 cursor-pointer  text-sm"
            >
              <Trash className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      {section.type === "hero" && (
        <div className="space-y-2">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">
                  Hero Heading
                </label>
                <input
                  value={section.heading}
                  onChange={(e) => handleChange("heading", e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full border rounded px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hero Heading"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">
                  Hero Subheading
                </label>
                <input
                  value={section.subheading}
                  onChange={(e) => handleChange("subheading", e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full border rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hero Subheading"
                />
              </div>
            </>
          ) : (
            <div className="py-20 px-5 bg-[linear-gradient(45deg,#FFB3D9_0%,#FFD1DC_20%,#FFF0F5_40%,#E6F3FF_60%,#D1E7FF_80%,#C7E9F1_100%)] rounded-xl space-y-5">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                {section.heading}
              </h2>
              <p className="text-gray-600 text-center">{section.subheading}</p>
            </div>
          )}
        </div>
      )}

      {/* Card Section */}
      {section.type === "card" && (
        <div className="space-y-3">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Title
                </label>
                <input
                  value={section.title}
                  onChange={(e) => handleChange("title", e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full border rounded px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Card Title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  value={section.description}
                  onChange={(e) => handleChange("description", e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full border rounded px-3 py-2 text-sm text-gray-600 min-h-20 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Card description"
                />
              </div>

              <div className="border-t pt-3 space-y-2">
                <label className="text-xs font-semibold text-gray-700">
                  Button 1
                </label>
                <input
                  value={section.button1Text}
                  onChange={(e) => handleChange("button1Text", e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Button 1 Text"
                />
                <input
                  value={section.button1Link}
                  onChange={(e) => handleChange("button1Link", e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Button 1 Link (URL)"
                />
              </div>

              <div className="border-t pt-3 space-y-2">
                <label className="text-xs font-semibold text-gray-700">
                  Button 2
                </label>
                <input
                  value={section.button2Text}
                  onChange={(e) => handleChange("button2Text", e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Button 2 Text"
                />
                <input
                  value={section.button2Link}
                  onChange={(e) => handleChange("button2Link", e)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Button 2 Link (URL)"
                />
              </div>
            </>
          ) : (
            <div className="bg-[radial-gradient(125%_125%_at_50%_90%,#fff_40%,#6366f1_100%)] p-3 rounded-xl flex flex-col gap-6 custom-box-shadow">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {section.title}
                </h3>
                <p className="text-gray-600">{section.description}</p>
              </div>
              <div>
                <div className="flex gap-3 pt-2">
                  {section.button1Text && (
                    <a
                      href={section.button1Link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition text-sm font-medium"
                    >
                      {section.button1Text}
                    </a>
                  )}
                  {section.button2Text && (
                    <a
                      href={section.button2Link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border outline-2 outline-gray-400 text-gary-400 rounded hover:bg-gray-100 transition text-sm font-medium"
                    >
                      {section.button2Text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Canvas({
  sections,
  setSections,
  cardsPerRow,
  canEditSections,
  canDeleteSections,
  isDraggable,
}: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: "canvas-droppable",
  });

  function updateSection(id: string, data: Partial<Section>) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? ({ ...s, ...data } as Section) : s))
    );
  }

  function deleteSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  const renderSections = () => {
    const result: JSX.Element[] = [];
    let currentCardGroup: Section[] = [];

    sections.forEach((section, index) => {
      if (section.type === "hero") {
        if (currentCardGroup.length > 0) {
          result.push(
            <div
              key={`card-group-${index}`}
              className={`grid gap-4 ${
                cardsPerRow === 1
                  ? "grid-cols-1"
                  : cardsPerRow === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {currentCardGroup.map((card) => (
                <SortableItem
                  key={card.id}
                  section={card}
                  onUpdate={updateSection}
                  onDelete={deleteSection}
                  canEdit={canEditSections}
                  canDelete={canDeleteSections}
                  isDraggable={isDraggable}
                />
              ))}
            </div>
          );
          currentCardGroup = [];
        }

        result.push(
          <SortableItem
            key={section.id}
            section={section}
            onUpdate={updateSection}
            onDelete={deleteSection}
            canEdit={canEditSections}
            canDelete={canDeleteSections}
            isDraggable={isDraggable}
          />
        );
      } else {
        currentCardGroup.push(section);
      }
    });

    if (currentCardGroup.length > 0) {
      result.push(
        <div
          key={`card-group-final`}
          className={`grid gap-4 ${
            cardsPerRow === 1
              ? "grid-cols-1"
              : cardsPerRow === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {currentCardGroup.map((card) => (
            <SortableItem
              key={card.id}
              section={card}
              onUpdate={updateSection}
              onDelete={deleteSection}
              canEdit={canEditSections}
              canDelete={canDeleteSections}
              isDraggable={isDraggable}
            />
          ))}
        </div>
      );
    }

    return result;
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-1 bg-gray-50 rounded-r-xl min-h-[calc(100vh-238px)]"
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <section className="p-6 space-y-4 h-full">
          {sections.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed rounded-lg bg-white/60">
              Drag sections from the left to start building your page
            </div>
          )}

          {renderSections()}
        </section>
      </SortableContext>
    </div>
  );
}
