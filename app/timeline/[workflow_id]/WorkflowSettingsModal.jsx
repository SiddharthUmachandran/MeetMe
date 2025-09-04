// src/components/WorkflowSettings.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WorkflowSettingsModal({ step, onSave, onClose }) {
  const [config, setConfig] = useState(step.config || {});

  const handleSave = () => {
    onSave({ ...step, config });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle>Edit {step.type} Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Description</Label>
            <Input
              value={config.description || ''}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="Enter step description"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
