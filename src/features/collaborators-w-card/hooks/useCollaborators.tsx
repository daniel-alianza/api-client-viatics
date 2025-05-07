"use client"

import { useCollaboratorContext } from "@/features/collaborators-w-card/context/CollaboratorContext"

export function useCollaborators() {
  return useCollaboratorContext()
}
