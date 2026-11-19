import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { StageValidationModal } from './StageValidationModal';
import { KANBAN_STAGES, PIPELINE_STAGES } from '../../lib/constants';
import { useAppStore } from '../../lib/store';
import { showToast } from '../../hooks/useToast';

export function KanbanBoard({ filteredLeads = [] }) {
  const { moveLeadStage, settings } = useAppStore();
  const [activeLead, setActiveLead] = useState(null);

  // Validation modal state
  const [validationModal, setValidationModal] = useState({
    isOpen: false,
    lead: null,
    targetStage: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const lead = filteredLeads.find((l) => l.id === active.id);
    if (lead) {
      setActiveLead(lead);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id;
    const lead = filteredLeads.find((l) => l.id === leadId);
    if (!lead) return;

    // Determine target stage: either dropped directly on a column or over another card
    let targetStageId = null;
    const overId = over.id;

    // Check if over is a column
    const isColumn = KANBAN_STAGES.some((s) => s.id === overId);
    if (isColumn) {
      targetStageId = overId;
    } else {
      // Over another lead card
      const targetLead = filteredLeads.find((l) => l.id === overId);
      if (targetLead) {
        targetStageId = targetLead.stage;
      }
    }

    if (!targetStageId) return;

    // If dropping on 'won_lost', default to won or open modal
    if (targetStageId === 'won_lost') {
      setValidationModal({
        isOpen: true,
        lead,
        targetStage: 'won',
      });
      return;
    }

    if (lead.stage === targetStageId) return;

    // Validation checks for stage entry
    if (targetStageId === 'qualified') {
      if (!lead.budgetVerified || !lead.decisionMakerVerified) {
        setValidationModal({
          isOpen: true,
          lead,
          targetStage: 'qualified',
        });
        return;
      }
    } else if (targetStageId === 'won') {
      setValidationModal({
        isOpen: true,
        lead,
        targetStage: 'won',
      });
      return;
    } else if (targetStageId === 'lost') {
      setValidationModal({
        isOpen: true,
        lead,
        targetStage: 'lost',
      });
      return;
    }

    // Direct stage update
    moveLeadStage(leadId, targetStageId);
    showToast({
      type: 'info',
      title: 'Stage Updated',
      message: `${lead.businessName} moved to ${targetStageId.replace('_', ' ')}.`,
    });
  };

  const handleValidationConfirm = (stageData) => {
    if (validationModal.lead && validationModal.targetStage) {
      moveLeadStage(validationModal.lead.id, validationModal.targetStage, stageData);
      showToast({
        type: 'success',
        title: 'Stage Entry Complete',
        message: `${validationModal.lead.businessName} successfully moved to ${validationModal.targetStage}.`,
      });
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {KANBAN_STAGES.map((col) => {
            // Find stage probability configured in settings or fallback
            const stageConfig = (settings.pipeline?.stages || PIPELINE_STAGES).find((s) => s.id === col.id) || col;
            const columnLeads = filteredLeads.filter((l) => {
              if (col.id === 'won_lost') return l.stage === 'won' || l.stage === 'lost';
              return l.stage === col.id;
            });

            return (
              <KanbanColumn
                key={col.id}
                stage={col}
                leads={columnLeads}
                probability={stageConfig.probability || col.probability}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeLead ? <KanbanCard lead={activeLead} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <StageValidationModal
        isOpen={validationModal.isOpen}
        onClose={() => setValidationModal({ isOpen: false, lead: null, targetStage: null })}
        lead={validationModal.lead}
        targetStage={validationModal.targetStage}
        onConfirm={handleValidationConfirm}
      />
    </>
  );
}
