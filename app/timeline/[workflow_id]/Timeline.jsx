// src/components/Timeline.jsx
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Video, Clock, Plus, Settings, X, Calendar } from 'lucide-react';
import WorkflowBox from './WorkflowBox';
import WorkflowSettingsModal from './WorkflowSettingsModal';

export default function Timeline({
  workflowSteps,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onDropStep,
  workflowID
}) {
  const [editingStep, setEditingStep] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);

  const sortedSteps = [...workflowSteps].sort((a, b) => a.position - b.position);

  const handleDragOver = (e, position) => {
    e.preventDefault();
    setDragOverPosition(position);
  };

  const handleDragLeave = () => {
    setDragOverPosition(null);
  };

  const handleDrop = (e, position) => {
    e.preventDefault();
    setDragOverPosition(null);
    
    const stepData = e.dataTransfer.getData('application/json');
    if (stepData) {
      const step = JSON.parse(stepData);
      onDropStep(step, position);
    }
  };

  const [timelinePositions, setTimelinePositions] = useState([
    { id: 'meeting', label: 'Meeting Time', position: 0, isMeeting: true, isCustom: false }
  ]);

  const addCustomTimePosition = () => {
    const newId = `custom-${Date.now()}`;
    const newPosition = {
      id: newId,
      label: 'Custom Time',
      position: -1,
      isMeeting: false,
      isCustom: true
    };
    setTimelinePositions(prev => [...prev, newPosition].sort((a, b) => a.position - b.position));
  };

  const updateTimePosition = (id, newLabel, newPosition) => {
    setTimelinePositions(prev => 
      prev.map(pos => 
        pos.id === id ? { ...pos, label: newLabel, position: newPosition } : pos
      ).sort((a, b) => a.position - b.position)
    );
  };

  const removeTimePosition = (id) => {
    if (id !== 'meeting') {
      setTimelinePositions(prev => prev.filter(pos => pos.id !== id));
      const positionToRemove = timelinePositions.find(pos => pos.id === id)?.position;
      if (positionToRemove !== undefined) {
        workflowSteps.filter(step => step.position === positionToRemove).forEach(step => {
          onDeleteStep(step.id);
        });
      }
    }
  };

  return (
    <div className="flex-1 p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Meeting Workflow Timeline
              </h1>
              <p className="text-gray-500">
                Drag workflow components from the sidebar to build your meeting automation
              </p>
            </div>
            <Button onClick={addCustomTimePosition} className="bg-blue-800 hover:bg-blue-900 text-white shadow-lg flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Time Position</span>
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-1 rounded-full bg-gray-300" />
          <div className="space-y-8">
            {timelinePositions.map((timePos) => {
              const stepsAtPosition = sortedSteps.filter(step => 
                step.position === timePos.position
              );

              return (
                <div key={timePos.id} className="relative">
                  <div className="absolute left-3 w-6 h-6 rounded-full border-4 border-white bg-blue-800 shadow-md" />
                  
                  <div className="ml-12 mb-4">
                    <div className="flex items-center gap-3">
                      {timePos.isMeeting ? (
                        <Video className="h-5 w-5 text-blue-800" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-500" />
                      )}
                      
                      <h3 className={`font-semibold ${timePos.isMeeting ? 'text-blue-800' : 'text-gray-800'}`}>
                        {timePos.label}
                      </h3>
                      
                      {timePos.isMeeting && (
                        <Badge variant="default" className="bg-blue-800 text-white">
                          Core Event
                        </Badge>
                      )}

                      {timePos.isCustom && (
                        <div className="flex items-center gap-2">
                          <Popover open={openPopover === timePos.id} onOpenChange={(isOpen) => setOpenPopover(isOpen ? timePos.id : null)}>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-gray-500 hover:text-blue-600">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-white shadow-lg">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="time-label">Position Label</Label>
                                  <Input
                                    id="time-label"
                                    value={timePos.label}
                                    onChange={(e) => updateTimePosition(timePos.id, e.target.value, timePos.position)}
                                    placeholder="e.g. 2 hours before"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="time-position">Hours relative to meeting</Label>
                                  <Input
                                    id="time-position"
                                    type="number"
                                    step="0.5"
                                    value={timePos.position}
                                    onChange={(e) => updateTimePosition(timePos.id, timePos.label, parseFloat(e.target.value) || 0)}
                                    placeholder="-2 for 2 hours before, 1 for 1 hour after"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Negative = before meeting, Positive = after meeting
                                  </p>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            onClick={() => removeTimePosition(timePos.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`ml-12 min-h-[60px] rounded-lg border-2 border-dashed transition-all duration-300
                      ${dragOverPosition === timePos.position
                          ? 'border-blue-800 bg-blue-800/10'
                          : 'border-transparent hover:border-blue-800/30'
                      }`}
                    onDragOver={(e) => handleDragOver(e, timePos.position)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, timePos.position)}
                  >
                    {timePos.isMeeting && (
                      <Card className="bg-white border-2 border-blue-800 shadow-lg mb-4">
                        <div className="p-6 text-center">
                          <Video className="h-8 w-8 text-blue-800 mx-auto mb-3" />
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Google Meet Session
                          </h4>
                          <p className="text-sm text-gray-500 mb-4">
                            Your scheduled meeting will happen here
                          </p>
                          <Button variant="outline" size="sm" className="bg-white shadow-sm border border-gray-300">
                            <Calendar className="h-4 w-4 mr-2" />
                            Connect Google Meet
                          </Button>
                        </div>
                      </Card>
                    )}

                    <div className="space-y-4">
                      {stepsAtPosition.map((step) => (
                        <WorkflowBox
                          key={step.id}
                          step={step}
                          isTimelineItem={true}
                          onEdit={setEditingStep}
                          onDelete={onDeleteStep}
                        />
                      ))}
                    </div>

                    {stepsAtPosition.length === 0 && !timePos.isMeeting && (
                      <div className="flex items-center justify-center h-16 text-gray-400">
                        <Plus className="h-4 w-4 mr-2" />
                        <span className="text-sm">Drop workflow here</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto w-full mt-6">
      <Button
        className="bg-blue-800 hover:bg-blue-900 text-white shadow-lg"
        onClick={async () => {await handleSaveChanges();}}

      >
        Save Changes
      </Button>
    </div>
      {editingStep && (
        <WorkflowSettingsModal
          step={editingStep}
          onSave={(updatedStep) => {
            onUpdateStep(updatedStep);
            setEditingStep(null);
          }}
          onClose={() => setEditingStep(null)}
        />
      )}
    </div>
  );
}
