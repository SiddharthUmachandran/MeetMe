// src/components/WorkflowSidebar.jsx
import React from 'react';
import { Card } from "@/components/ui/card";
import { GripVertical, Mail, HardDrive, Video, Bot, FileText, MessageCircle, Calendar } from 'lucide-react';

// Helper function to get the Lucide icon component by name
const getIconComponent = (iconName) => {
  const icons = { Mail, HardDrive, Video, Bot, FileText, MessageCircle, Calendar };
  const IconComponent = icons[iconName];
  return <IconComponent className="h-5 w-5 text-gray-500" />;
};

export default function WorkflowSidebar() {
  const handleDragStart = (e, step) => {
    // Fix: Create a new object without the React element to prevent circular reference error.
    const sanitizedStep = { ...step };
    delete sanitizedStep.icon; 
    e.dataTransfer.setData('application/json', JSON.stringify(sanitizedStep));
    e.dataTransfer.effectAllowed = 'move';
  };
  const sidebarSteps = [
    { id: 'email-collector', type: 'Email Collector', iconName: 'Mail', description: 'Gather and filter emails based on keywords, sender, and date range' },
    { id: 'drive-fetcher', type: 'Drive Fetcher', iconName: 'HardDrive', description: 'Pull relevant documents and files from Google Drive or other sources' },
    { id: 'meeting-recorder', type: 'Meeting Recorder', iconName: 'Video', description: 'Record and transcribe the meeting automatically' },
    { id: 'summary-generator', type: 'Summary Generator', iconName: 'Bot', description: 'Generate meeting summary and send to participants' },
    { id: 'action-item-extractor', type: 'Action Item Extractor', iconName: 'FileText', description: 'Extract and assign action items from meeting transcript' },
    { id: 'slack-sender', type: 'Slack Sender', iconName: 'MessageCircle', description: 'Send a message to a Slack channel' },
    { id: 'google-task', type: 'Google Task', iconName: 'Calendar', description: 'Create and assign a task in Google Tasks' },
  ];

  return (
    <div className="overflow-y-scroll h-screen w-80 border-r border-gray-200 bg-gray-100 p-6 flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Workflow Components</h2>
        <p className="text-gray-500 text-sm">Drag to timeline</p>
      </div>
      <div className="flex-1 space-y-4 pr-2">
        {sidebarSteps.map((step) => (
          <Card
            key={step.id}
            className="bg-white shadow-md rounded-lg cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={(e) => handleDragStart(e, step)}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-gray-500" />
                {getIconComponent(step.iconName)}
                <div>
                  <h4 className="font-medium text-gray-800">{step.type}</h4>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
