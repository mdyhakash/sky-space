"use client";

import { ChevronRight, Folder, FolderOpen, HardDrive } from "lucide-react";
import type { FileNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { childrenOf } from "./file-helpers";

interface FolderTreeProps {
  files: FileNode[];
  currentId: string | null;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onOpen: (id: string | null) => void;
}

interface NodeProps extends FolderTreeProps {
  node: FileNode;
  depth: number;
}

function TreeNode({ node, depth, files, currentId, expanded, onToggle, onOpen }: NodeProps) {
  const subfolders = childrenOf(files, node.id).filter((c) => c.kind === "folder");
  const isOpen = expanded.has(node.id);
  const active = currentId === node.id;

  return (
    <li>
      <div
        className={cn(
          "flex items-center rounded-lg text-sm transition-colors",
          active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-card-2 hover:text-foreground",
        )}
        style={{ paddingLeft: depth * 12 }}
      >
        <button
          type="button"
          aria-label={isOpen ? `Collapse ${node.name}` : `Expand ${node.name}`}
          onClick={() => onToggle(node.id)}
          className={cn("flex size-7 shrink-0 items-center justify-center", subfolders.length === 0 && "invisible")}
        >
          <ChevronRight className={cn("size-3.5 transition-transform", isOpen && "rotate-90")} />
        </button>
        <button type="button" onClick={() => onOpen(node.id)} className="flex min-w-0 flex-1 items-center gap-2 py-1.5 pr-2 text-left">
          {isOpen || active ? <FolderOpen className="size-4 shrink-0 text-primary" /> : <Folder className="size-4 shrink-0 text-primary" />}
          <span className="truncate">{node.name}</span>
        </button>
      </div>
      {isOpen && subfolders.length > 0 && (
        <ul>
          {subfolders.map((c) => (
            <TreeNode
              key={c.id}
              node={c}
              depth={depth + 1}
              files={files}
              currentId={currentId}
              expanded={expanded}
              onToggle={onToggle}
              onOpen={onOpen}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function FolderTree(props: FolderTreeProps) {
  const roots = childrenOf(props.files, null).filter((c) => c.kind === "folder");
  return (
    <nav aria-label="Folders">
      <button
        type="button"
        onClick={() => props.onOpen(null)}
        className={cn(
          "mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
          props.currentId === null ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-card-2 hover:text-foreground",
        )}
      >
        <HardDrive className="size-4 text-primary" /> My files
      </button>
      <ul>
        {roots.map((n) => (
          <TreeNode key={n.id} node={n} depth={0} {...props} />
        ))}
      </ul>
    </nav>
  );
}
