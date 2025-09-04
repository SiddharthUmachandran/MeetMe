// src/components/WorkflowBox.jsx
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Settings, Trash2, Zap, Mail, HardDrive, Video, Bot, FileText, MessageCircle, Calendar } from 'lucide-react';

// Helper function to get the Lucide icon component by name
const getIconComponent = (iconName) => {
  const icons = { Mail, HardDrive, Video, Bot, FileText, MessageCircle, Calendar, Zap };
  const IconComponent = icons[iconName] || icons.Zap;
  return <IconComponent className="h-5 w-5 text-gray-500" />;
};

export default function WorkflowBox({ step, isTimelineItem, onEdit, onDelete }) {
  const handleDragStart = (e) => {
    // This is the original code, which is fine since the step object no longer contains a React element
    e.dataTransfer.setData('application/json', JSON.stringify(step));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card
      className={`bg-white shadow-md rounded-lg ${isTimelineItem ? 'border-l-4 border-l-blue-800' : ''}`}
      draggable={!isTimelineItem}
      onDragStart={!isTimelineItem ? handleDragStart : undefined}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isTimelineItem && <GripVertical className="h-4 w-4 text-gray-500" />}
          {isTimelineItem ? getIconComponent(step.iconName) : getIconComponent(step.iconName)}
          <div>
            <h4 className="font-medium text-gray-800">{step.type}</h4>
            {step.config?.description && (
              <p className="text-sm text-gray-500">{step.config.description}</p>
            )}
          </div>
        </div>
        {isTimelineItem && (
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => onEdit(step)} className="h-7 w-7 text-gray-500 hover:text-blue-600">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => onDelete(step.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
